import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { HashService } from '@/infra/hash/hash.service';
import { I18nService } from '@/infra/i18n/i18n-service';
import { DeviceService } from '@/modules/device/device.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { SessionService } from '@/modules/session/session.service';
import { AuthenticateDto } from '@/modules/auth/dtos/authenticate.dto';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { LoginDto } from '@/modules/auth/dtos/login.dto';
import { RegisterDto } from '@/modules/auth/dtos/register.dto';
import { ForgotPasswordDto } from '@/modules/auth/dtos/forgot-password.dto';
import { MessagePresenter } from '@/common/presenters/message.presenter';
import { ResetPasswordDto } from '@/modules/auth/dtos/reset-password.dto';
import { UserTokenType } from '@/modules/user-token/enums/user-token-type';
import { UserTokenStatus } from '@/modules/user-token/enums/user-token-status';
import { DateUtils } from '@/common/helpers/date-utils.helper';
import { ClockUtils } from '@/common/helpers/clock-utils.helper';
import { EncryptService } from '@/infra/encrypt/encrypt.service';
import { EnvService } from '@/infra/env/env.service';
import { CodeUtils } from '@/common/helpers/code-utils.helper';
import { MailService } from '@/infra/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
    private readonly encryptService: EncryptService,
    private readonly envService: EnvService,
    private readonly i18nService: I18nService,
    private readonly mailService: MailService,
    private readonly deviceService: DeviceService,
    private readonly sessionService: SessionService,
  ) {}

  async authenticate(
    userId: string,
    headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const device = await this.deviceService.upsert(
      userId,
      headers['x-fingerprint'],
    );
    return this.sessionService.create(device.id);
  }

  async register(
    dto: RegisterDto,
    headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const emailAlreadyExists =
      (await this.prismaService.user.count({
        where: {
          email: dto.email,
        },
      })) > 0;

    if (emailAlreadyExists) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.email_already_exists'),
      );
    }

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hashedPassword: await this.hashService.hash(dto.password),
        role: dto.role,
      },
    });

    return this.authenticate(user.id, headers);
  }

  async login(
    dto: LoginDto,
    headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        hashedPassword: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.invalid_credentials'),
      );
    }

    const isPasswordValid = await this.hashService.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.invalid_credentials'),
      );
    }

    return this.authenticate(user.id, headers);
  }

  async refresh(
    userId: string,
    headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    return this.authenticate(userId, headers);
  }

  async loggout(
    userId: string,
    fingerprint: string | undefined,
  ): Promise<MessagePresenter> {
    await this.deviceService.loggout(userId, fingerprint);
    return new MessagePresenter(this.i18nService.t('auth.logged_out'));
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessagePresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('user.not_found_with_email', { email: dto.email }),
      );
    }

    const code = CodeUtils.generateNumeric(6);

    await this.prismaService.$transaction([
      this.prismaService.userToken.updateMany({
        where: {
          userId: user.id,
          type: UserTokenType.RESET_PASSWORD,
          status: UserTokenStatus.PENDING,
        },
        data: {
          status: UserTokenStatus.CANCELLED,
        },
      }),
      this.prismaService.userToken.create({
        data: {
          userId: user.id,
          type: UserTokenType.RESET_PASSWORD,
          encryptedCode: await this.encryptService.encrypt(
            this.envService.ENCRYPT_TOKEN_SECRET,
            code,
          ),
          status: UserTokenStatus.PENDING,
          expiresAt: DateUtils.getDate(ClockUtils.getFutureTimestamp('10m')),
        },
      }),
    ]);

    await this.mailService.sendMail({
      template: 'forgot-password',
      to: user.email,
      subject: this.i18nService.t('mail.forgot_password.subject'),
      context: {
        title: this.i18nService.t('mail.forgot_password.title'),
        code,
      },
    });

    return new MessagePresenter(
      this.i18nService.t('auth.email_sent_to_reset_password'),
    );
  }

  async resetPassword(
    dto: ResetPasswordDto,
    headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('user.not_found_with_email', { email: dto.email }),
      );
    }

    const userToken = await this.prismaService.userToken.findFirst({
      where: {
        userId: user.id,
        type: UserTokenType.RESET_PASSWORD,
        status: UserTokenStatus.PENDING,
      },
    });

    if (!userToken) {
      throw new NotFoundException(
        this.i18nService.t('user_token.not_found_with_type', {
          type: UserTokenType.RESET_PASSWORD,
        }),
      );
    }

    if (userToken.expiresAt < DateUtils.getDate()) {
      throw new BadRequestException(this.i18nService.t('user_token.expired'));
    }

    const decryptedCode = await this.encryptService.decrypt(
      this.envService.ENCRYPT_TOKEN_SECRET,
      userToken.encryptedCode,
    );
    if (decryptedCode !== dto.code) {
      throw new BadRequestException(
        this.i18nService.t('user_token.invalid_code'),
      );
    }

    await this.prismaService.$transaction([
      this.prismaService.userToken.update({
        where: {
          id: userToken.id,
        },
        data: {
          status: UserTokenStatus.FULFILLED,
        },
      }),
      this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword: await this.hashService.hash(dto.password),
        },
      }),
    ]);

    return this.authenticate(user.id, headers);
  }

  async me(userId: string): Promise<UserPresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('user.not_found_with_id', { userId }),
      );
    }

    return new UserPresenter(user);
  }
}

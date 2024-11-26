import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DeviceService } from '@/modules/device/device.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { SessionService } from '@/modules/session/session.service';
import { AuthenticateDto } from '@/modules/auth/dtos/authenticate.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { LoginDto } from '@/modules/auth/dtos/login.dto';
import { HashService } from '@/infra/hash/hash.service';
import { I18nService } from '@/infra/i18n/i18n-service';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly deviceService: DeviceService,
    private readonly sessionService: SessionService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
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

  async me(userId: string): Promise<UserPresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('user.not_found', { userId }),
      );
    }

    return new UserPresenter(user);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeviceService } from '@/modules/device/device.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { SessionService } from '@/modules/session/session.service';
import { AuthenticateDto } from '@/modules/auth/dtos/authenticate.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { LoginDto } from '@/modules/auth/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly deviceService: DeviceService,
    private readonly sessionService: SessionService,
  ) {}

  async authenticate(
    userId: string,
    headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const device = await this.deviceService.upsert(userId, headers.fingerprint);
    return this.sessionService.create(device.id);
  }

  async login(dto: LoginDto): Promise<SessionPresenter> {
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
      throw new UnauthorizedException('Invalid credentials'); // TODO: Add i18n
    }

    const isPasswordValid = user.hashedPassword === dto.password; // TODO: Add password hashing

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials'); // TODO: Add i18n
    }

    return this.authenticate(user.id, {
      fingerprint: 'fingerprint',
    });
  }
}

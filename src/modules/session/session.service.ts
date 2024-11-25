import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { ClockUtils } from '@/common/clock-utils.helper';
import { DateUtils } from '@/common/date-utils.helper';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Issuer } from '@/infra/jwt/enums/issue.enum';
import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async create(deviceId: string): Promise<SessionPresenter> {
    const device = await this.prismaService.device.findUnique({
      where: {
        id: deviceId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!device) {
      throw new NotFoundException(`Device not found with id: ${deviceId}`); // TODO: i18n
    }

    const expiresSession = ClockUtils.getFutureTimestamp('1d'); // TODO: add env
    const expiresRefreshSession = ClockUtils.getFutureTimestamp('7d'); // TODO: add env

    const accessToken = await this.jwtService.sign({
      secret: 'access-secret', // TODO: add env
      issuer: Issuer.ACCESS_TOKEN,
      expiresIn: expiresSession,
      subject: device.userId,
    });
    const refreshToken = await this.jwtService.sign({
      secret: 'refresh-secret', // TODO: add env
      issuer: Issuer.REFRESH_TOKEN,
      expiresIn: expiresRefreshSession,
      subject: device.userId,
    });

    const hashedAccessToken = await this.hashService.hash(accessToken);
    const hashedRefreshToken = await this.hashService.hash(refreshToken);

    await this.prismaService.$transaction([
      this.prismaService.session.updateMany({
        where: {
          deviceId: device.id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      }),
      this.prismaService.session.create({
        data: {
          deviceId: device.id,
          hashedAccessToken,
          hashedRefreshToken,
          expiresAt: DateUtils.getDate(expiresSession),
        },
      }),
      this.prismaService.device.update({
        where: {
          id: device.id,
        },
        data: {
          lastLoginAt: DateUtils.getDate(),
        },
      }),
    ]);

    // TODO: add queue to disable expired sessions

    return new SessionPresenter({
      accessToken,
      refreshToken,
    });
  }

  async loggedOut(deviceId: string): Promise<void> {
    await this.prismaService.session.updateMany({
      where: {
        deviceId,
        isActive: true,
      },
      data: {
        isActive: false,
        loggedOutAt: DateUtils.getDate(),
      },
    });
  }
}

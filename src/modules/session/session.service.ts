import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { ClockUtils } from '@/common/clock-utils.helper';
import { DateUtils } from '@/common/date-utils.helper';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(deviceId: string): Promise<SessionPresenter> {
    const device = await this.prismaService.device.findUnique({
      where: {
        id: deviceId,
      },
      select: {
        id: true,
      },
    });

    if (!device) {
      throw new NotFoundException(`Device not found with id: ${deviceId}`); // TODO: i18n
    }

    const expiresSession = ClockUtils.getFutureTimestamp(ClockUtils.ONE_DAY);

    const accessToken = 'access-token'; // TODO: generate token
    const refreshToken = 'refresh-token'; // TODO: generate token

    const hashedAccessToken = 'hashed-access-token'; // TODO: hash token
    const hashedRefreshToken = 'hashed-refresh-token'; // TODO: hash token

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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { ClockUtils } from '@/common/helpers/clock-utils.helper';
import { DateUtils } from '@/common/helpers/date-utils.helper';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Issuer } from '@/infra/jwt/enums/issue.enum';
import { HashService } from '@/infra/hash/hash.service';
import { EnvService } from '@/infra/env/env.service';
import { I18nService } from '@/infra/i18n/i18n-service';
import { EventService } from '@/infra/event/event.service';
import { Events } from '@/infra/event/enums/events.enum';
import { CreateSessionEvent } from '@/modules/session/events/create-session.event';

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly envService: EnvService,
    private readonly i18nService: I18nService,
    private readonly eventService: EventService,
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
      throw new NotFoundException(
        this.i18nService.t('device.not_found', { deviceId }),
      );
    }

    const expiresSession = ClockUtils.getFutureTimestamp(
      this.envService.JWT_ACCESS_TOKEN_KEY_EXPIRES_IN,
    );
    const expiresRefreshSession = ClockUtils.getFutureTimestamp(
      this.envService.JWT_REFRESH_TOKEN_KEY_EXPIRES_IN,
    );

    const accessToken = await this.jwtService.sign({
      secret: this.envService.JWT_ACCESS_TOKEN_SECRET,
      issuer: Issuer.ACCESS_TOKEN,
      expiresIn: expiresSession,
      subject: device.userId,
    });
    const refreshToken = await this.jwtService.sign({
      secret: this.envService.JWT_REFRESH_TOKEN_SECRET,
      issuer: Issuer.REFRESH_TOKEN,
      expiresIn: expiresRefreshSession,
      subject: device.userId,
    });

    const hashedAccessToken = await this.hashService.hash(accessToken);
    const hashedRefreshToken = await this.hashService.hash(refreshToken);

    const [, session] = await this.prismaService.$transaction([
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
        select: { id: true },
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

    this.eventService.emit(
      Events.SESSION_CREATE,
      new CreateSessionEvent(session.id),
    );

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

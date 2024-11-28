import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/is-public.decorator';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { I18nService } from '@/infra/i18n/i18n-service';
import { DeviceService } from '@/modules/device/device.service';
import { DateUtils } from '@/common/helpers/date-utils.helper';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
    private readonly deviceService: DeviceService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        this.i18nService.t('user.not_found'),
      );
    }

    const fingerprint = request.headers['x-fingerprint'];

    const device = await this.deviceService.findOne(user.id, fingerprint);

    const activeSession = await this.prismaService.session.findFirst({
      where: {
        deviceId: device.id,
        isActive: true,
      },
    });

    if (!activeSession) {
      throw new ForbiddenException(
        this.i18nService.t('auth.session.not_found'),
      );
    }

    if (activeSession.expiresAt < DateUtils.getDate()) {
      await this.prismaService.session.update({
        where: {
          id: activeSession.id,
        },
        data: {
          isActive: false,
        },
      });

      throw new ForbiddenException(this.i18nService.t('auth.session.expired'));
    }

    request.session = activeSession;

    return true;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { DevicePresenter } from '@/modules/device/presenters/device.presenter';
import { I18nService } from '@/infra/i18n/i18n-service';

@Injectable()
export class DeviceService {
  private readonly DEFAULT_FINGERPRINT = 'UNKNOWN';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async upsert(
    userId: string,
    fingerprint: string = this.DEFAULT_FINGERPRINT,
  ): Promise<DevicePresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('user.not_found_with_id', { userId }),
      );
    }

    const device = await this.prismaService.device.upsert({
      where: {
        fingerprint_userId: {
          fingerprint,
          userId: user.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        fingerprint,
      },
    });

    return new DevicePresenter(device);
  }
}

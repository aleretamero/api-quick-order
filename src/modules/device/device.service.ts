import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { DevicePresenter } from '@/modules/device/presenters/device.presenter';

@Injectable()
export class DeviceService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsert(userId: string, fingerprint: string): Promise<DevicePresenter> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found with id: ${userId}`); // TODO: i18n
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

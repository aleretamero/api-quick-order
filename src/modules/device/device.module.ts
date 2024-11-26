import { Module } from '@nestjs/common';
import { DeviceService } from '@/modules/device/device.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { I18nModule } from '@/infra/i18n/i18n-module';

@Module({
  imports: [PrismaModule, I18nModule],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}

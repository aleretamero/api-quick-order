import { Module } from '@nestjs/common';
import { DeviceService } from '@/modules/device/device.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}

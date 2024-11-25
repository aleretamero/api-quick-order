import { Module } from '@nestjs/common';
import { DeviceService } from '@/modules/device/device.service';

@Module({
  providers: [DeviceService],
})
export class DeviceModule {}

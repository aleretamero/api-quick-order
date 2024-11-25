import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { DeviceModule } from '@/modules/device/device.module';

@Module({
  imports: [DeviceModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

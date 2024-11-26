import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { DeviceModule } from '@/modules/device/device.module';
import { SessionModule } from '@/modules/session/session.module';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { HashModule } from '@/infra/hash/hash.module';
import { I18nModule } from '@/infra/i18n/i18n-module';
import { EncryptModule } from '@/infra/encrypt/encrypt.module';
import { EnvModule } from '@/infra/env/env.module';
import { JwtModule } from '@/infra/jwt/jwt.module';

@Module({
  imports: [
    PrismaModule,
    EnvModule,
    I18nModule,
    JwtModule,
    HashModule,
    EncryptModule,
    DeviceModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

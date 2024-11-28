import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AuthModule } from '@/modules/auth/auth.module';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { SessionGuard } from '@/modules/session/guards/session.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { EnvModule } from '@/infra/env/env.module';
import { I18nModule } from '@/infra/i18n/i18n-module';
import { OrderModule } from '@/modules/order/order.module';

@Module({
  imports: [
    PrismaModule,
    I18nModule,
    JwtModule,
    EnvModule,
    AuthModule,
    OrderModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: SessionGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AuthModule } from '@/modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [AuthModule, PrismaModule, JwtModule, EnvModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

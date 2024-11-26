import { Module } from '@nestjs/common';
import { SessionService } from '@/modules/session/session.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { HashModule } from '@/infra/hash/hash.module';
import { EnvModule } from '@/infra/env/env.module';
import { I18nModule } from '@/infra/i18n/i18n-module';
import { EventModule } from '@/infra/event/event.module';

@Module({
  imports: [
    PrismaModule,
    I18nModule,
    EventModule,
    EnvModule,
    JwtModule,
    HashModule,
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

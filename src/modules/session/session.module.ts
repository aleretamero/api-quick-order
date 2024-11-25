import { Module } from '@nestjs/common';
import { SessionService } from '@/modules/session/session.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { JwtModule } from '@/infra/jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

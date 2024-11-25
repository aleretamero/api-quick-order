import { Module } from '@nestjs/common';
import { SessionService } from '@/modules/session/session.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

import { Module } from '@nestjs/common';
import { ReportController } from '@/modules/reports/report.controller';
import { ReportService } from '@/modules/reports/report.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

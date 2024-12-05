import { Module } from '@nestjs/common';
import { ReportController } from '@/modules/reports/report.controller';
import { ReportService } from '@/modules/reports/report.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

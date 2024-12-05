import { ReportController } from '@/modules/reports/report.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ReportController],
})
export class ReportModule {}

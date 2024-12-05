import { Controller, Get } from '@nestjs/common';
import { ReportService } from '@/modules/reports/report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dashboard-cards')
  async getDashboardCards() {
    return this.reportService.getDashbardCards();
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '@/modules/reports/report.service';
import { RangeDateQuery } from '@/common/queries/range-date.query';
import { CardsDashboardReportPresenter } from '@/modules/reports/presenters/cards-dashboard-report.presenter';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dashboard-cards')
  async getDashboardCards(): Promise<CardsDashboardReportPresenter> {
    return this.reportService.getDashbardCards();
  }

  @Get('orders-completed')
  async getOrdersCompleted(@Query() query: RangeDateQuery) {
    return this.reportService.getOrdersCompleted(query);
  }
}

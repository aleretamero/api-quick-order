import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '@/modules/reports/report.service';
import { RangeDateQuery } from '@/common/queries/range-date.query';
import { CardsDashboardReportPresenter } from '@/modules/reports/presenters/cards-dashboard-report.presenter';
import { OrdersStatusReportPresenter } from '@/modules/reports/presenters/orders-status-report.presenter';
import { OrdersCompletedReportPresenter } from '@/modules/reports/presenters/orders-completed-report.presenter';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dashboard-cards')
  async getDashboardCards(): Promise<CardsDashboardReportPresenter> {
    return this.reportService.getDashbardCards();
  }

  @Get('orders-completed')
  async getOrdersCompleted(
    @Query() query: RangeDateQuery,
  ): Promise<OrdersCompletedReportPresenter> {
    return this.reportService.getOrdersCompleted(query);
  }

  @Get('orders-status')
  async getOrdersStatus(
    @Query() query: RangeDateQuery,
  ): Promise<OrdersStatusReportPresenter> {
    return this.reportService.getOrdersByStatus(query);
  }
}

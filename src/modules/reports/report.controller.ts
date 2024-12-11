import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '@/modules/reports/report.service';
import { RangeDateQuery } from '@/common/queries/range-date.query';
import { CardsDashboardReportPresenter } from '@/modules/reports/presenters/cards-dashboard-report.presenter';
import { OrdersStatusReportPresenter } from '@/modules/reports/presenters/orders-status-report.presenter';
import { OrdersCompletedReportPresenter } from '@/modules/reports/presenters/orders-completed-report.presenter';
import { ApiDocs } from '@/common/decorators/api-docs.decorators';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dashboard-cards')
  @Roles(Role.ADMIN)
  @ApiDocs({ response: [401, 403, 500] })
  async getDashboardCards(): Promise<CardsDashboardReportPresenter> {
    return this.reportService.getDashbardCards();
  }

  @Get('orders-completed')
  @Roles(Role.ADMIN)
  @ApiDocs({ response: [400, 401, 403, 500] })
  async getOrdersCompleted(
    @Query() query: RangeDateQuery,
  ): Promise<OrdersCompletedReportPresenter> {
    return this.reportService.getOrdersCompleted(query);
  }

  @Get('orders-status')
  @Roles(Role.ADMIN)
  @ApiDocs({ response: [400, 401, 403, 500] })
  async getOrdersStatus(
    @Query() query: RangeDateQuery,
  ): Promise<OrdersStatusReportPresenter> {
    return this.reportService.getOrdersByStatus(query);
  }
}

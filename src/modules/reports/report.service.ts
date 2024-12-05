import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateUtils } from '@/common/helpers/date-utils.helper';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CardsDashboardReportPresenter } from '@/modules/reports/presenters/cards-dashboard-report.presenter';
import { DashboardCardsQueryRaw } from '@/modules/reports/query-raw/dashboard-cards.query-raw';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashbardCards(): Promise<any> {
    const today = DateUtils.getDate();
    const yesterday = DateUtils.subtract(today, 1, 'day');

    const startToday = DateUtils.startOfDay(today);
    const endToday = DateUtils.endOfDay(today);
    const startYesterday = DateUtils.startOfDay(yesterday);
    const endYesterday = DateUtils.endOfDay(yesterday);
    const startWeek = DateUtils.startOfWeek(today);
    const endWeek = DateUtils.endOfWeek(today);
    const startMonth = DateUtils.startOfMonth(today);
    const endMonth = DateUtils.endOfMonth(today);

    const query = Prisma.sql`
      SELECT
        SUM("received_price") FILTER (WHERE "created_at" >= ${startToday} AND "created_at" <= ${endToday}) AS "received_price_today",
        SUM("sale_price") FILTER (WHERE "created_at" >= ${startToday} AND "created_at" <= ${endToday}) AS "sale_price_today",
        COUNT(*) FILTER (WHERE "created_at" >= ${startToday} AND "created_at" <= ${endToday}) AS "quantity_today",
        SUM("received_price") FILTER (WHERE "created_at" >= ${startYesterday} AND "created_at" <= ${endYesterday}) AS "received_price_yesterday",
        SUM("sale_price") FILTER (WHERE "created_at" >= ${startYesterday} AND "created_at" <= ${endYesterday}) AS "sale_price_yesterday",
        COUNT(*) FILTER (WHERE "created_at" >= ${startYesterday} AND "created_at" <= ${endYesterday}) AS "quantity_yesterday",
        SUM("received_price") FILTER (WHERE "created_at" >= ${startWeek} AND "created_at" <= ${endWeek}) AS "received_price_week",
        SUM("sale_price") FILTER (WHERE "created_at" >= ${startWeek} AND "created_at" <= ${endWeek}) AS "sale_price_week",
        COUNT(*) FILTER (WHERE "created_at" >= ${startWeek} AND "created_at" <= ${endWeek}) AS "quantity_week",
        SUM("received_price") FILTER (WHERE "created_at" >= ${startMonth} AND "created_at" <= ${endMonth}) AS "received_price_month",
        SUM("sale_price") FILTER (WHERE "created_at" >= ${startMonth} AND "created_at" <= ${endMonth}) AS "sale_price_month",
        COUNT(*) FILTER (WHERE "created_at" >= ${startMonth} AND "created_at" <= ${endMonth}) AS "quantity_month"
      FROM orders
      WHERE "status" = ${OrderStatus.COMPLETED}
      AND created_at >= ${startMonth}
      AND created_at <= ${endMonth}
    `;

    const [result] =
      await this.prismaService.$queryRaw<DashboardCardsQueryRaw[]>(query);

    return new CardsDashboardReportPresenter(result);
  }
}

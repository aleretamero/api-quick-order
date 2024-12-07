import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateUtils } from '@/common/helpers/date-utils.helper';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CardsDashboardReportPresenter } from '@/modules/reports/presenters/cards-dashboard-report.presenter';
import { DashboardCardsQueryRaw } from '@/modules/reports/types/dashboard-cards-query-raw.type';
import { RangeDateQuery } from '@/common/queries/range-date.query';
import { OrdersCompletedReportPresenter } from '@/modules/reports/presenters/orders-completed-report.presenter';
import { OrdersCompletedQueryRaw } from '@/modules/reports/types/orders-completed-query-raw.type';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashbardCards(): Promise<CardsDashboardReportPresenter> {
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
        SUM("received_price") FILTER (WHERE "date" >= ${startToday} AND "date" <= ${endToday}) AS "received_price_today",
        SUM("sale_price") FILTER (WHERE "date" >= ${startToday} AND "date" <= ${endToday}) AS "sale_price_today",
        COUNT(*) FILTER (WHERE "date" >= ${startToday} AND "date" <= ${endToday}) AS "quantity_today",
        SUM("received_price") FILTER (WHERE "date" >= ${startYesterday} AND "date" <= ${endYesterday}) AS "received_price_yesterday",
        SUM("sale_price") FILTER (WHERE "date" >= ${startYesterday} AND "date" <= ${endYesterday}) AS "sale_price_yesterday",
        COUNT(*) FILTER (WHERE "date" >= ${startYesterday} AND "date" <= ${endYesterday}) AS "quantity_yesterday",
        SUM("received_price") FILTER (WHERE "date" >= ${startWeek} AND "date" <= ${endWeek}) AS "received_price_week",
        SUM("sale_price") FILTER (WHERE "date" >= ${startWeek} AND "date" <= ${endWeek}) AS "sale_price_week",
        COUNT(*) FILTER (WHERE "date" >= ${startWeek} AND "date" <= ${endWeek}) AS "quantity_week",
        SUM("received_price") FILTER (WHERE "date" >= ${startMonth} AND "date" <= ${endMonth}) AS "received_price_month",
        SUM("sale_price") FILTER (WHERE "date" >= ${startMonth} AND "date" <= ${endMonth}) AS "sale_price_month",
        COUNT(*) FILTER (WHERE "date" >= ${startMonth} AND "date" <= ${endMonth}) AS "quantity_month"
      FROM orders
      WHERE "status" = ${OrderStatus.COMPLETED}
      AND date >= ${startMonth}
      AND date <= ${endMonth}
    `;

    const [result] =
      await this.prismaService.$queryRaw<DashboardCardsQueryRaw[]>(query);

    return new CardsDashboardReportPresenter(result);
  }

  async getOrdersCompleted(
    query: RangeDateQuery,
  ): Promise<OrdersCompletedReportPresenter> {
    const { from, to } = this.getRangeDate(query);

    const orders = await this.prismaService.order.groupBy({
      by: ['createdAt'],
      _count: {
        _all: true,
      },
      _sum: {
        receivedPrice: true,
      },
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
        status: OrderStatus.COMPLETED,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const data: OrdersCompletedQueryRaw[] = [];

    for (
      let day = DateUtils.startOfDay(from);
      day < DateUtils.startOfDay(to);
      day = DateUtils.add(day, 1, 'day')
    ) {
      const formattedDate = DateUtils.format(day);

      const order = orders.find(
        (item) => DateUtils.format(item.createdAt) === formattedDate,
      );

      if (data.find((item) => item.date === formattedDate)) {
        continue;
      }

      if (!order) {
        data.push({
          date: formattedDate,
          value: new Decimal(0),
          quantity: 0,
        });
      } else {
        data.push({
          date: formattedDate,
          value: order._sum.receivedPrice,
          quantity: order._count._all,
        });
      }
    }

    return new OrdersCompletedReportPresenter({
      startDate: query.from,
      endDate: query.to,
      data,
    });
  }

  private getRangeDate(query: RangeDateQuery): RangeDateQuery {
    const from = DateUtils.startOfDay(query.from, 'America/Sao_Paulo');
    const to = DateUtils.endOfDay(query.to, 'America/Sao_Paulo');

    if (DateUtils.isAfter(from, to)) {
      throw new BadRequestException(
        'The start date must be less than or equal to the end date', // TODO: i18n
      );
    }

    return { from, to };
  }
}

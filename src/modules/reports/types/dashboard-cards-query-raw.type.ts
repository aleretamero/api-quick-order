import { Decimal } from '@prisma/client/runtime/library';

export type DashboardCardsQueryRaw = {
  received_price_today: Decimal | null;
  sale_price_today: Decimal | null;
  quantity_today: bigint;
  received_price_yesterday: Decimal | null;
  sale_price_yesterday: Decimal | null;
  quantity_yesterday: bigint;
  received_price_week: Decimal | null;
  sale_price_week: Decimal | null;
  quantity_week: bigint;
  received_price_month: Decimal | null;
  sale_price_month: Decimal | null;
  quantity_month: bigint;
};

export type DashboardCardsQueryRaw = {
  received_price_today: number | null;
  sale_price_today: number | null;
  quantity_today: bigint;
  received_price_yesterday: number | null;
  sale_price_yesterday: number | null;
  quantity_yesterday: bigint;
  received_price_week: number | null;
  sale_price_week: number | null;
  quantity_week: bigint;
  received_price_month: number | null;
  sale_price_month: number | null;
  quantity_month: bigint;
};

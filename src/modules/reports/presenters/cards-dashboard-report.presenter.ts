import { DashboardCardsQueryRaw } from '@/modules/reports/types/dashboard-cards-query-raw.type';

type CardDashboardPresenterProps = {
  receivedPrice: number;
  salePrice: number;
  quantity: number;
};

class CardDashboardPresenter {
  receivedPrice: number;
  salePrice: number;
  quantity: number;

  constructor(props: CardDashboardPresenterProps) {
    this.receivedPrice = props.receivedPrice;
    this.salePrice = props.salePrice;
    this.quantity = props.quantity;
  }
}

type CardsDashboardReportPresenterProps = DashboardCardsQueryRaw;

export class CardsDashboardReportPresenter {
  today: CardDashboardPresenter;
  yesterday: CardDashboardPresenter;
  thisWeek: CardDashboardPresenter;
  thisMonth: CardDashboardPresenter;

  constructor(props: CardsDashboardReportPresenterProps) {
    this.today = new CardDashboardPresenter({
      receivedPrice: props.received_price_today?.toNumber() ?? 0,
      salePrice: props.sale_price_today?.toNumber() ?? 0,
      quantity: Number(props.quantity_today),
    });
    this.yesterday = new CardDashboardPresenter({
      receivedPrice: props.received_price_yesterday?.toNumber() ?? 0,
      salePrice: props.sale_price_yesterday?.toNumber() ?? 0,
      quantity: Number(props.quantity_yesterday),
    });
    this.thisWeek = new CardDashboardPresenter({
      receivedPrice: props.received_price_week?.toNumber() ?? 0,
      salePrice: props.sale_price_week?.toNumber() ?? 0,
      quantity: Number(props.quantity_week),
    });
    this.thisMonth = new CardDashboardPresenter({
      receivedPrice: props.received_price_month?.toNumber() ?? 0,
      salePrice: props.sale_price_month?.toNumber() ?? 0,
      quantity: Number(props.quantity_month),
    });
  }
}

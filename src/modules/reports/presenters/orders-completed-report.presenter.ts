import { DateUtils } from '@/common/helpers/date-utils.helper';
import { OrdersCompletedQueryRaw } from '@/modules/reports/types/orders-completed-query-raw.type';

type OrderReportPresenterProps = {
  date: string;
  value: number;
  quantity: number;
};

class OrderReportPresenter {
  date: string;
  value: number;
  quantity: number;

  constructor(props: OrderReportPresenterProps) {
    this.date = props.date;
    this.value = props.value;
    this.quantity = props.quantity;
  }
}

type OrdersCompletedReportPresenterProps = {
  startDate: Date;
  endDate: Date;
  data: OrdersCompletedQueryRaw[];
};

export class OrdersCompletedReportPresenter {
  startDate: string;
  endDate: string;
  data: OrderReportPresenter[];

  constructor(props: OrdersCompletedReportPresenterProps) {
    this.startDate = DateUtils.format(props.startDate);
    this.endDate = DateUtils.format(props.endDate);
    this.data = props.data.map(
      (item) =>
        new OrderReportPresenter({
          date: item.date,
          value: item.value?.toNumber() ?? 0,
          quantity: item.quantity,
        }),
    );
  }
}

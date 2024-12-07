import { DateUtils } from '@/common/helpers/date-utils.helper';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { OrdersStatusQueryRaw } from '@/modules/reports/types/orders-status-query-raw.type';

type OrderStatusReportPresenterProps = OrdersStatusQueryRaw;

class OrderStatusReportPresenter {
  status: OrderStatus;
  quantity: number;

  constructor(props: OrderStatusReportPresenterProps) {
    this.status = props.status;
    this.quantity = Number(props.quantity);
  }
}

type OrdersStatusReportPresenterProps = {
  startDate: Date;
  endDate: Date;
  data: OrderStatusReportPresenterProps[];
};

export class OrdersStatusReportPresenter {
  startDate: string;
  endDate: string;
  data: OrderStatusReportPresenter[];

  constructor(props: OrdersStatusReportPresenterProps) {
    this.startDate = DateUtils.format(props.startDate);
    this.endDate = DateUtils.format(props.endDate);
    this.data = props.data.map((item) => new OrderStatusReportPresenter(item));
  }
}

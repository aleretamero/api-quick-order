import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import {
  OrderLogsPresenter,
  OrderLogsPresenterProps,
} from '@/modules/order/presenters/order-logs.presenter';
import { Order } from '@prisma/client';

type OrderPresenterProps = Order & {
  orderLogs?: OrderLogsPresenterProps[];
  isAdmin: boolean;
};

export class OrderPresenter {
  id: string;
  status: OrderStatus;
  description: string;
  imageUrl?: string;
  salePrice?: number;
  receivedPrice?: number;
  orderLogs?: OrderLogsPresenter[];

  constructor(props: OrderPresenterProps) {
    this.id = props.id;
    this.status = props.status as OrderStatus;
    this.description = props.description;
    this.imageUrl = props.imageUrl ?? undefined;

    if (props.isAdmin) {
      this.salePrice = props.salePrice.toNumber();
      this.receivedPrice = props.receivedPrice.toNumber();
      this.orderLogs = props.orderLogs?.map(
        (log) => new OrderLogsPresenter(log),
      );
    }
  }
}

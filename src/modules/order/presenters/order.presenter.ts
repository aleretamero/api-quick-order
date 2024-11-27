import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { Order } from '@prisma/client';

type OrderPresenterProps = Order & {
  orderLogs?: any[]; // TODO: add OrderLog type
  isAdmin: boolean;
};

export class OrderPresenter {
  id: string;
  status: OrderStatus;
  description: string;
  imageUrl: string;
  salePrice?: number;
  receivedPrice?: number;
  orderLogs?: any[]; // TODO: add OrderLog type

  constructor(props: OrderPresenterProps) {
    this.id = props.id;
    this.status = props.status as OrderStatus;
    this.description = props.description;
    this.imageUrl = props.image;
    this.orderLogs = props.orderLogs;

    if (props.isAdmin) {
      this.salePrice = props.salePrice.toNumber(); // TODO: add CurrencyUtils
      this.receivedPrice = props.receivedPrice.toNumber(); // TODO: add CurrencyUtils
    }
  }
}

import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { Order } from '@prisma/client';

export type OrderDetailsPresenterProps = Order & {
  salePrice: number;
  receivedPrice: number;
};

export class OrderDetailsPresenter {
  id: string;
  status: string;
  image: string;
  description: string;
  salePrice: number;
  receivedPrice: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: OrderDetailsPresenterProps) {
    this.id = props.id;
    this.status = props.status as OrderStatus;
    this.image = props.image;
    this.description = props.description;
    this.salePrice = props.salePrice;
    this.receivedPrice = props.receivedPrice;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

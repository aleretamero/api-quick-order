import { OrderStatus } from '@/modules/order/enums/order-status.enum';

export type OrdersStatusQueryRaw = {
  status: OrderStatus;
  quantity: bigint;
};

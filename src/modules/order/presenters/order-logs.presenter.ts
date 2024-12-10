import { OrderLogsAction } from '@/modules/order/enums/order-logs-action.enum';
import {
  OrderDetailsPresenter,
  OrderDetailsPresenterProps,
} from '@/modules/order/presenters/order-details.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { OrderLog } from '@prisma/client';

export type OrderLogsPresenterProps = OrderLog & {
  session: {
    device: {
      user: {
        id: string;
        email: string;
      };
    };
  };
};

export class OrderLogsPresenter {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  @ApiProperty({ enum: OrderLogsAction })
  action: OrderLogsAction;
  @ApiProperty({ type: () => OrderDetailsPresenter })
  beforeState: OrderDetailsPresenter | null;
  @ApiProperty({ type: () => OrderDetailsPresenter })
  afterState: OrderDetailsPresenter | null;
  createdAt: Date;

  constructor(props: OrderLogsPresenterProps) {
    this.id = props.id;
    this.orderId = props.orderId;
    this.action = props.action as OrderLogsAction;
    this.beforeState = props.beforeState
      ? new OrderDetailsPresenter(
          props.beforeState as unknown as OrderDetailsPresenterProps, // TODO: fix this type
        )
      : null;
    this.afterState = props.afterState
      ? new OrderDetailsPresenter(
          props.afterState as unknown as OrderDetailsPresenterProps, // TODO: fix this type
        )
      : null;
    this.createdAt = props.createdAt;
    this.userId = props.session.device.user.id;
    this.userEmail = props.session.device.user.email;
  }
}

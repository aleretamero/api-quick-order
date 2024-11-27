import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/order/order.controller';
import { OrderService } from '@/modules/order/order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

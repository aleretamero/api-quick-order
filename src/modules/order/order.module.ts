import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/order/order.controller';

@Module({
  controllers: [OrderController],
})
export class OrderModule {}

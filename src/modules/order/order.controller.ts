import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create() {
    return this.orderService.create();
  }

  @Get()
  index() {
    return this.orderService.findAll();
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.orderService.create(body);
  }

  @Get()
  index() {
    return this.orderService.findAll();
  }
}

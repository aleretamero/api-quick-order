import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';
import { ApiDocs } from '@/common/decorators/api-docs.decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiDocs({ response: [400, 401, 403, 500] })
  create(@Body() body: CreateOrderDto): Promise<OrderPresenter> {
    return this.orderService.create(body);
  }

  @Get()
  @ApiDocs({ response: [401, 500] })
  index(@CurrentUser('role') role: Role): Promise<OrderPresenter[]> {
    return this.orderService.findAll(role);
  }
}

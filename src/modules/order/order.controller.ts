import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';
import { ApiDocs } from '@/common/decorators/api-docs.decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PaginationPresenter } from '@/common/presenters/pagination.presenter';
import { PaginationQuery } from '@/common/queries/pagination.query';
import { CurrentSession } from '@/common/decorators/current-session.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiDocs({ response: [400, 401, 403, 500] })
  create(
    @CurrentSession('id') sessionId: string,
    @Body() body: CreateOrderDto,
  ): Promise<OrderPresenter> {
    return this.orderService.create(sessionId, body);
  }

  @Get()
  @ApiDocs({ response: [401, 500] })
  index(
    @CurrentUser('role') role: Role,
    @Query() query: PaginationQuery,
  ): Promise<PaginationPresenter<OrderPresenter>> {
    return this.orderService.findAll(role, query);
  }

  @Patch(':id')
  @ApiDocs({ response: [400, 401, 500] })
  update(
    @Param('id') orderId: string,
    @CurrentSession('id') sessionId: string,
    @Body() body: CreateOrderDto,
  ): Promise<OrderPresenter> {
    return this.orderService.update(sessionId, orderId, body);
  }
}

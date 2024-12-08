import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import {
  CreateOrderDto,
  CreateOrderSchema,
} from '@/modules/order/dtos/create-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';
import { ApiDocs } from '@/common/decorators/api-docs.decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PaginationPresenter } from '@/common/presenters/pagination.presenter';
import { CurrentSession } from '@/common/decorators/current-session.decorator';
import {
  UpdateOrderDto,
  UpdateOrderSchema,
} from '@/modules/order/dtos/update-order.dto';
import { UseInterceptorFile } from '@/common/decorators/use-file-interceptor';
import { ParseFilePipe } from '@/common/pipes/parse-file.pipe';
import { FileType } from '@/common/types/file.type';
import { GetOrdersQueryPagination } from '@/modules/order/queries/get-orders.query';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptorFile('image')
  @ApiDocs({ response: [400, 401, 403, 500], body: { type: CreateOrderSchema }}) // prettier-ignore
  create(
    @CurrentSession('id') sessionId: string,
    @Body() body: CreateOrderDto,
    @UploadedFile(ParseFilePipe) file?: FileType,
  ): Promise<OrderPresenter> {
    return this.orderService.create(sessionId, body, file);
  }

  @Get()
  @ApiDocs({ response: [401, 500] })
  index(
    @CurrentUser('role') role: Role,
    @Query() query: GetOrdersQueryPagination,
  ): Promise<PaginationPresenter<OrderPresenter>> {
    return this.orderService.findAll(role, query);
  }

  @Get(':id')
  @ApiDocs({ response: [400, 401, 404, 500] })
  show(
    @CurrentUser('role') role: Role,
    @Param('id') orderId: string,
  ): Promise<OrderPresenter> {
    return this.orderService.findOne(role, orderId);
  }

  @Patch(':id')
  @UseInterceptorFile('image')
  @ApiDocs({ response: [400, 401, 500], body: { type: UpdateOrderSchema } })
  update(
    @Param('id') orderId: string,
    @CurrentSession('id') sessionId: string,
    @Body() body: UpdateOrderDto,
    @UploadedFile(ParseFilePipe) file?: FileType,
  ): Promise<OrderPresenter> {
    return this.orderService.update(sessionId, orderId, body, file);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs({ response: [400, 401, 403, 500] })
  delete(
    @Param('id') orderId: string,
    @CurrentSession('id') sessionId: string,
  ): Promise<void> {
    return this.orderService.delete(sessionId, orderId);
  }
}

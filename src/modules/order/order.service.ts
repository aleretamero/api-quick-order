import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Role } from '@/modules/user/enums/role.enum';
import { PaginationPresenter } from '@/common/presenters/pagination.presenter';
import { PaginationQuery } from '@/common/queries/pagination.query';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    sessionId: string,
    dto: CreateOrderDto,
  ): Promise<OrderPresenter> {
    const order = await this.prismaService.$transaction(async (ctx) => {
      const order = await ctx.order.create({
        data: {
          status: OrderStatus.PENDING,
          description: dto.description,
          salePrice: dto.salePrice,
          receivedPrice: dto.receivedPrice,
          image: dto.image,
        },
      });

      await ctx.orderLog.create({
        data: {
          sessionId: sessionId,
          orderId: order.id,
          afterState: order,
        },
      });

      return order;
    });

    return new OrderPresenter({
      ...order,
      isAdmin: true,
    });
  }

  async findAll(
    role: Role,
    query: PaginationQuery,
  ): Promise<PaginationPresenter<OrderPresenter>> {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;

    const where: Prisma.OrderWhereInput = {
      status: {
        not: OrderStatus.DELETED,
      },
    };

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.order.count({ where }),
    ]);

    return new PaginationPresenter({
      data: orders.map(
        (order) =>
          new OrderPresenter({ ...order, isAdmin: role === Role.ADMIN }),
      ),
      meta: {
        total,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  }
}

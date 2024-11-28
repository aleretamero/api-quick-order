import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { I18nService } from '@/infra/i18n/i18n-service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { UpdateOrderDto } from '@/modules/order/dtos/update-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Role } from '@/modules/user/enums/role.enum';
import { PaginationPresenter } from '@/common/presenters/pagination.presenter';
import { PaginationQuery } from '@/common/queries/pagination.query';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

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

  async update(
    sessionId: string,
    orderId: string,
    dto: UpdateOrderDto,
  ): Promise<OrderPresenter> {
    const currentOrder = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!currentOrder) {
      throw new NotFoundException(
        this.i18nService.t('order.not_found_with_id', { orderId }),
      );
    }

    const order = await this.prismaService.$transaction(async (ctx) => {
      const updatedOrder = await ctx.order.update({
        where: {
          id: orderId,
        },
        data: {
          description: dto.description,
          salePrice: dto.salePrice,
          receivedPrice: dto.receivedPrice,
          image: dto.image,
          status: dto.status,
        },
      });

      await ctx.orderLog.create({
        data: {
          sessionId: sessionId,
          orderId: orderId,
          beforeState: currentOrder,
          afterState: updatedOrder,
        },
      });

      return updatedOrder;
    });

    return new OrderPresenter({
      ...order,
      isAdmin: true,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { I18nService } from '@/infra/i18n/i18n-service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { UpdateOrderDto } from '@/modules/order/dtos/update-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Role } from '@/modules/user/enums/role.enum';
import { PaginationPresenter } from '@/common/presenters/pagination.presenter';
import { Prisma } from '@prisma/client';
import { FileType } from '@/common/types/file.type';
import { StorageFirebaseService } from '@/infra/storage-firebase/storage-firebase.service';
import { GetOrdersQueryPagination } from '@/modules/order/queries/get-orders.query';
import { DateUtils } from '@/common/helpers/date-utils.helper';
import { OrderLogsAction } from '@/modules/order/enums/order-logs-action.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
    private readonly storageFirebaseService: StorageFirebaseService,
  ) {}

  async create(
    sessionId: string,
    dto: CreateOrderDto,
    file?: FileType,
  ): Promise<OrderPresenter> {
    const { image, imageUrl } = await this.uploadFile(file);

    const order = await this.prismaService.$transaction(async (ctx) => {
      const order = await ctx.order.create({
        data: {
          date: dto.date,
          status: OrderStatus.PENDING,
          description: dto.description,
          salePrice: dto.salePrice,
          receivedPrice: dto.receivedPrice,
          image,
          imageUrl,
        },
      });

      await ctx.orderLog.create({
        data: {
          action: OrderLogsAction.CREATE,
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
    query: GetOrdersQueryPagination,
  ): Promise<PaginationPresenter<OrderPresenter>> {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;

    if (!query.from || !query.to) {
      return new PaginationPresenter({
        data: [],
        meta: {
          total: 0,
          currentPage: page,
          itemsPerPage: limit,
        },
      });
    }

    const where: Prisma.OrderWhereInput = {
      status: {
        not: OrderStatus.DELETED,
        in: query.status,
      },
      date: {
        gte: DateUtils.startOfDay(query.from),
        lte: DateUtils.endOfDay(query.to),
      },
    };

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          date: 'desc',
        },
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

  async findOne(role: Role, id: string): Promise<OrderPresenter> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id,
      },
      include: {
        orderLogs: {
          include: {
            session: {
              select: {
                device: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        this.i18nService.t('order.not_found_with_id', { id }),
      );
    }

    return new OrderPresenter({
      ...order,
      isAdmin: role === Role.ADMIN,
    });
  }

  async update(
    sessionId: string,
    orderId: string,
    dto: UpdateOrderDto,
    file?: FileType,
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

    const { image, imageUrl } = await this.uploadFile(file);

    const order = await this.prismaService.$transaction(async (ctx) => {
      const updatedOrder = await ctx.order.update({
        where: {
          id: orderId,
        },
        data: {
          date: dto.date,
          description: dto.description,
          salePrice: dto.salePrice,
          receivedPrice: dto.receivedPrice,
          image,
          imageUrl,
        },
      });

      await ctx.orderLog.create({
        data: {
          action: OrderLogsAction.UPDATE,
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

  async finish(
    sessionId: string,
    role: Role,
    orderId: string,
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

    if (currentOrder.status === OrderStatus.COMPLETED) {
      return new OrderPresenter({
        ...currentOrder,
        isAdmin: role === Role.ADMIN,
      });
    }

    const order = await this.prismaService.$transaction(async (ctx) => {
      const updatedOrder = await ctx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.COMPLETED,
        },
      });

      await ctx.orderLog.create({
        data: {
          action: OrderLogsAction.FINISH,
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
      isAdmin: role === Role.ADMIN,
    });
  }

  async cancel(
    sessionId: string,
    role: Role,
    orderId: string,
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

    if (currentOrder.status === OrderStatus.CANCELED) {
      return new OrderPresenter({
        ...currentOrder,
        isAdmin: role === Role.ADMIN,
      });
    }

    const order = await this.prismaService.$transaction(async (ctx) => {
      const updatedOrder = await ctx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELED,
        },
      });

      await ctx.orderLog.create({
        data: {
          action: OrderLogsAction.CANCEL,
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
      isAdmin: role === Role.ADMIN,
    });
  }

  async process(
    sessionId: string,
    role: Role,
    orderId: string,
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

    if (currentOrder.status === OrderStatus.PROCESSING) {
      return new OrderPresenter({
        ...currentOrder,
        isAdmin: role === Role.ADMIN,
      });
    }

    const order = await this.prismaService.$transaction(async (ctx) => {
      const updatedOrder = await ctx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.PROCESSING,
        },
      });

      await ctx.orderLog.create({
        data: {
          action: OrderLogsAction.PROCESS,
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
      isAdmin: role === Role.ADMIN,
    });
  }

  async delete(sessionId: string, orderId: string): Promise<void> {
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

    if (currentOrder.status === OrderStatus.DELETED) {
      return;
    }

    await this.prismaService.$transaction(async (ctx) => {
      const updatedOrder = await ctx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.DELETED,
        },
      });

      await ctx.orderLog.create({
        data: {
          action: OrderLogsAction.DELETE,
          sessionId: sessionId,
          orderId: orderId,
          beforeState: currentOrder,
          afterState: updatedOrder,
        },
      });
    });
  }

  private async uploadFile(file?: FileType): Promise<{
    image?: string;
    imageUrl?: string;
  }> {
    let image: string | undefined;
    let imageUrl: string | undefined;

    if (file) {
      const { path, url } = await this.storageFirebaseService.uploadFile(
        'orders',
        file,
      );
      image = path;
      imageUrl = url;
    }

    return { image, imageUrl };
  }
}

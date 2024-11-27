import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';
import { Role } from '@/modules/user/enums/role.enum';
import { PaginationPresenter } from '@/common/presenters/pagination.presenter';
import { PaginationQuery } from '@/common/queries/pagination.query';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateOrderDto): Promise<OrderPresenter> {
    const order = await this.prismaService.order.create({
      data: {
        status: OrderStatus.PENDING,
        description: dto.description,
        salePrice: dto.salePrice,
        receivedPrice: dto.receivedPrice,
        image: dto.image,
      },
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

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.order.count(),
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

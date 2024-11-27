import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { CreateOrderDto } from '@/modules/order/dtos/create-order.dto';
import { OrderPresenter } from '@/modules/order/presenters/order.presenter';

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

  async findAll() {
    return this.prismaService.order.findMany();
  }
}

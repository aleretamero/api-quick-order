import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  create() {
    throw new Error('Method not implemented.');
  }

  async findAll() {
    return this.prismaService.order.findMany();
  }
}

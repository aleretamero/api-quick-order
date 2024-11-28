import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/order/order.controller';
import { OrderService } from '@/modules/order/order.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { I18nModule } from '@/infra/i18n/i18n-module';

@Module({
  imports: [PrismaModule, I18nModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/order/order.controller';
import { OrderService } from '@/modules/order/order.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { I18nModule } from '@/infra/i18n/i18n-module';
import { StorageFirebaseModule } from '@/infra/storage-firebase/storage-firebase.module';

@Module({
  imports: [PrismaModule, I18nModule, StorageFirebaseModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

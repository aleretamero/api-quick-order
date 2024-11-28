import { StorageLocalService } from '@/infra/storage-local/storage-local.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [StorageLocalService],
  exports: [StorageLocalService],
})
export class StorageLocalModule {}

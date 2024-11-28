import { Module } from '@nestjs/common';
import { EnvModule } from '@/infra/env/env.module';
import { StorageLocalService } from '@/infra/storage-local/storage-local.service';

@Module({
  imports: [EnvModule],
  providers: [StorageLocalService],
  exports: [StorageLocalService],
})
export class StorageLocalModule {}

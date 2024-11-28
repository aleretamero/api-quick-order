import { Module } from '@nestjs/common';
import { StorageFirebaseService } from '@/infra/storage-firebase/storage-firebase.service';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [EnvModule],
  providers: [StorageFirebaseService],
  exports: [StorageFirebaseService],
})
export class StorageFirebaseModule {}

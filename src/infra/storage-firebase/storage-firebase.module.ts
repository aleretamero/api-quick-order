import { Module } from '@nestjs/common';
import { StorageFirebaseService } from '@/infra/storage-firebase/storage-firebase.service';

@Module({
  providers: [StorageFirebaseService],
  exports: [StorageFirebaseService],
})
export class StorageFirebaseModule {}

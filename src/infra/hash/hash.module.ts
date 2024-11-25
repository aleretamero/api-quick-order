import { HashService } from '@/infra/hash/hash.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}

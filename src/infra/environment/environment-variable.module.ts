import { Module } from '@nestjs/common';
import { EnvironmentVariableService } from '@/infra/environment/environment-variable.service';

@Module({
  providers: [EnvironmentVariableService],
  exports: [EnvironmentVariableService],
})
export class EnvironmentVariableModule {}

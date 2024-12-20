import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventService } from '@/infra/event/event.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}

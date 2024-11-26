import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '@/infra/event/enums/events.enum';

@Injectable()
export class EventService {
  constructor(private readonly emitter: EventEmitter2) {}

  emit<T>(event: Events, data: T) {
    this.emitter.emit(event, data);
  }
}

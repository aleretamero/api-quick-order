import { Injectable } from '@nestjs/common';
import { DeviceService } from '@/modules/device/device.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { SessionService } from '@/modules/session/session.service';

class AuthenticateDto {
  fingerprint!: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly sessionService: SessionService,
  ) {}

  async authenticate(
    userId: string,
    dto: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const device = await this.deviceService.upsert(userId, dto.fingerprint);
    return this.sessionService.create(device.id);
  }

  async login() {
    return this.authenticate('user-id', {
      fingerprint: 'fingerprint',
    });
  }
}

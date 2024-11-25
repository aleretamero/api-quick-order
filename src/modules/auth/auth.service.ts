import { Injectable } from '@nestjs/common';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { DeviceService } from '@/modules/device/device.service';

class AuthenticateDto {
  fingerprint!: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly deviceService: DeviceService) {}

  async authenticate(
    userId: string,
    dto: AuthenticateDto,
  ): Promise<SessionPresenter> {
    const device = await this.deviceService.upsert(userId, dto.fingerprint);
    console.log(device);

    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  async login() {
    return this.authenticate('user-id', {
      fingerprint: 'fingerprint',
    });
  }
}

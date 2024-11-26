import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClockUtils, OffsetString } from '@/common/helpers/clock-utils.helper';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get PORT(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  get JWT_ACCESS_TOKEN_SECRET(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET');
  }

  get JWT_REFRESH_TOKEN_SECRET(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  get JWT_ACCESS_TOKEN_KEY_EXPIRES_IN(): OffsetString {
    const env = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );

    if (!ClockUtils.isOffsetString(env)) {
      throw new Error('Invalid JWT_ACCESS_TOKEN_EXPIRES_IN format');
    }

    return env;
  }

  get JWT_REFRESH_TOKEN_KEY_EXPIRES_IN(): OffsetString {
    const env = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );

    if (!ClockUtils.isOffsetString(env)) {
      throw new Error('Invalid JWT_REFRESH_TOKEN_EXPIRES_IN format');
    }

    return env;
  }
}

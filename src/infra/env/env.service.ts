import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClockUtils, OffsetString } from '@/common/helpers/clock-utils.helper';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  // #region GENERAL

  get BASE_URL(): string {
    return this.configService.getOrThrow<string>('BASE_URL');
  }

  get PORT(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  get NODE_ENV(): string {
    return this.configService.getOrThrow<string>('NODE_ENV');
  }

  get APP_NAME(): string {
    return this.configService.getOrThrow<string>('APP_NAME');
  }

  get API_VERSION(): number {
    return this.configService.getOrThrow<number>('API_VERSION');
  }

  get CORS_WHITE_LIST(): string[] {
    const env = this.configService.get<string>('CORS_WHITE_LIST');

    return (
      env
        ?.split(',')
        .filter(Boolean)
        .map((url) => url.trim().replace(/\/$/, '')) ?? []
    );
  }

  // #endregion

  // #region DOCUMENTATION

  get DOCS_PATH(): string {
    return this.configService.getOrThrow<string>('DOCS_PATH');
  }

  // #endregion

  // #region JWT

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

  // #endregion

  // #region ENCRYPT

  get ENCRYPT_TOKEN_SECRET(): string {
    return this.configService.getOrThrow<string>('ENCRYPT_TOKEN_SECRET');
  }

  // #endregion

  // #region MAIL

  get MAIL_HOST(): string {
    return this.configService.getOrThrow<string>('MAIL_HOST');
  }

  get MAIL_PORT(): number {
    return this.configService.getOrThrow<number>('MAIL_PORT');
  }

  get MAIL_USER(): string {
    return this.configService.getOrThrow<string>('MAIL_USER');
  }

  get MAIL_PASS(): string {
    return this.configService.getOrThrow<string>('MAIL_PASS');
  }

  get MAIL_DEFAULT_FROM_EMAIL(): string {
    return this.configService.getOrThrow<string>('MAIL_DEFAULT_FROM_EMAIL');
  }

  // #endregion

  // #region FIREBASE

  get FIREBASE_API_KEY(): string {
    return this.configService.getOrThrow<string>('FIREBASE_API_KEY');
  }

  get FIREBASE_AUTH_DOMAIN(): string {
    return this.configService.getOrThrow<string>('FIREBASE_AUTH_DOMAIN');
  }

  get FIREBASE_PROJECT_ID(): string {
    return this.configService.getOrThrow<string>('FIREBASE_PROJECT_ID');
  }

  get FIREBASE_STORAGE_BUCKET(): string {
    return this.configService.getOrThrow<string>('FIREBASE_STORAGE_BUCKET');
  }

  get FIREBASE_MESSAGING_SENDER_ID(): string {
    return this.configService.getOrThrow<string>('FIREBASE_MESSAGING_SENDER_ID'); // prettier-ignore
  }

  get FIREBASE_APP_ID(): string {
    return this.configService.getOrThrow<string>('FIREBASE_APP_ID');
  }

  // #endregion
}

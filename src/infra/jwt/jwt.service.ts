import { Injectable } from '@nestjs/common';
import { JwtService as DefaultJwtService } from '@nestjs/jwt';
import { Issuer } from '@/infra/jwt/enums/issue.enum';

type Offset = `${number}${'s' | 'm' | 'h' | 'd'}` | number;

export type SignJwtOptions<T extends object | Buffer = any> = {
  expiresIn?: Offset;
  issuer?: Issuer;
  subject?: string;
} & {
  secret: string;
  payload?: T;
};

export type VerifyJwtOptions = {
  token: string;
  secret: string;
  issuer?: Issuer;
  subject?: string;
};

export type JwtPayload<T extends object | Buffer = any> = {
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
} & T;

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: DefaultJwtService) {}

  async sign<T extends object | Buffer>(
    options: SignJwtOptions<T>,
  ): Promise<string> {
    return this.jwtService.sign(options.payload ?? {}, {
      issuer: options.issuer,
      subject: options.subject,
      expiresIn: options.expiresIn,
      secret: options.secret,
    });
  }

  async verify<T extends object>(
    options: VerifyJwtOptions,
  ): Promise<JwtPayload<T>> {
    return this.jwtService.verify<T>(options.token, {
      secret: options.secret,
      issuer: options.issuer,
      subject: options.subject,
    });
  }
}

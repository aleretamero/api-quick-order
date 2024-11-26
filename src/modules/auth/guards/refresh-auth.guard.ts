import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Request } from 'express';
import { JwtService } from '@/infra/jwt/jwt.service';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { EnvService } from '@/infra/env/env.service';
import { Issuer } from '@/infra/jwt/enums/issue.enum';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly i18nService: I18nService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    const payload = token
      ? await this.jwtService
          .verify({
            token,
            secret: this.envService.JWT_REFRESH_TOKEN_SECRET,
            issuer: Issuer.REFRESH_TOKEN,
          })
          .catch(() => null)
      : null;

    const user = payload
      ? await this.prismaService.user.findUnique({
          where: { id: payload.sub },
        })
      : null;

    if (!user) {
      throw new UnauthorizedException(this.i18nService.t('auth.invalid_token'));
    }

    request.user = user;
    request.accessToken = token;

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    return request.headers['x-refresh-token']?.toString();
  }
}

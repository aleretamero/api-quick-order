import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Request } from 'express';
import { JwtService } from '@/infra/jwt/jwt.service';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { EnvService } from '@/infra/env/env.service';
import { Issuer } from '@/infra/jwt/enums/issue.enum';
import { IS_PUBLIC_KEY } from '@/common/decorators/is-public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly i18nService: I18nService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const payload = token
      ? await this.jwtService
          .verify({
            token,
            secret: this.envService.JWT_ACCESS_TOKEN_SECRET,
            issuer: Issuer.ACCESS_TOKEN,
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
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

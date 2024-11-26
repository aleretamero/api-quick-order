import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { I18nService } from '@/infra/i18n/i18n-service';
import { Role } from '@/modules/user/enums/role.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.some(
      (requiredRole) => requiredRole === user.role,
    );

    if (!hasRole) {
      throw new ForbiddenException(
        this.i18nService.t('auth.forbidden_for_role', { role: user.role }),
      );
    } else {
      return true;
    }
  }
}

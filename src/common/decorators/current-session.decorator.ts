import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { Session } from '@prisma/client';

export const CurrentSession = createParamDecorator(
  (filter: keyof Session | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.session) {
      throw new InternalServerErrorException(
        request.i18nService.t('auth.session.not_found'),
      );
    }

    if (filter) {
      return request.session[filter];
    }

    return request.session;
  },
);

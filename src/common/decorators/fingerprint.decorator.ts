import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Fingerprint = createParamDecorator(
  (props: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.headers['x-fingerprint'];
  },
);

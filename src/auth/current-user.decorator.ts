import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import type { Request } from 'express';

type RequestWithLocalUser = Request & { localUserId?: string };

/**
 * Returns the local `User.id` UUID of the currently authenticated user.
 *
 * Relies on `ResolveUserInterceptor` having run first to populate
 * `request.localUserId`. If that didn't happen — e.g. the decorator is
 * used on a `@Public()` route, or the interceptor is no longer registered
 * globally — we throw so the bug is loud instead of silently passing
 * `undefined` into a query.
 */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithLocalUser>();
    if (!request.localUserId) {
      throw new InternalServerErrorException(
        '@CurrentUserId() used on a request that has no resolved local user. ' +
          'Make sure ResolveUserInterceptor runs and the route is authenticated.',
      );
    }
    return request.localUserId;
  },
);

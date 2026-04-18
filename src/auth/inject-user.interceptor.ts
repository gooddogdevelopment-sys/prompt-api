import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import type { Request } from 'express';
import { UsersService } from '../users/users.service';

type AuthenticatedRequest = Request & {
  auth?: { sub: string };
  localUserId?: string;
};

/**
 * Resolves the authenticated Clerk user to the local `User.id` UUID
 * and stashes it on `request.localUserId` so downstream handlers (and the
 * `@CurrentUserId()` param decorator) can read it without hitting the DB.
 *
 * Skips silently when there's no `auth.sub` on the request (e.g. public
 * routes like the Clerk webhook) so it is safe to register globally.
 */
@Injectable()
export class ResolveUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sub = request.auth?.sub;

    // Public route
    if (!sub) return next.handle();

    return from(this.usersService.findByProviderUserId(sub)).pipe(
      switchMap((user) => {
        request.localUserId = user.id;
        return next.handle();
      }),
    );
  }
}

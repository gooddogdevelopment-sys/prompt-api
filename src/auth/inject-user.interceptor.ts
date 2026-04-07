import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';

type AuthenticatedRequest = Request & { auth?: { sub: string } };

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (['POST', 'PUT'].includes(request.method) && request.auth?.sub) {
      request.body = { ...request.body, userId: request.auth.sub };
    }

    return next.handle();
  }
}

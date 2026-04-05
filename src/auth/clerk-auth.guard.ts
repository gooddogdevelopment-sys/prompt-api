import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { verifyToken } from '@clerk/backend';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => Reflector.createDecorator<boolean>();

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      (request as Request & { auth: typeof payload }).auth = payload;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[ClerkAuthGuard] JWT verification failed:', message);
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? (token ?? null) : null;
  }
}

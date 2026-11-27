import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC, REQUIRE_AUTH } from './auth.decorators.js';
import { AuthService } from './auth.service.js';

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export type AuthRequest = Request & { adminUsername?: string };

/** Áp dụng toàn API: khách chỉ được đọc, ghi phải đăng nhập */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride(IS_PUBLIC, targets)) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const required = this.reflector.getAllAndOverride(REQUIRE_AUTH, targets);
    if (!required && READ_METHODS.has(request.method)) return true;

    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Bạn cần đăng nhập để thực hiện việc này',
      );
    }
    request.adminUsername = await this.auth.verify(token);
    return true;
  }
}

import { Body, Controller, Get, HttpCode, Ip, Post, Req } from '@nestjs/common';
import { Public, RequireAuth } from './auth.decorators.js';
import type { AuthRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginLimiter } from './login-limiter.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly limiter: LoginLimiter,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Ip() ip: string) {
    this.limiter.consume(ip);
    const result = await this.auth.login(dto.username, dto.password);
    this.limiter.reset(ip);
    return result;
  }

  @RequireAuth()
  @Get('me')
  me(@Req() request: AuthRequest) {
    return { username: request.adminUsername };
  }
}

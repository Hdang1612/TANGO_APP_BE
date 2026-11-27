import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getAuthConfig } from './auth.config.js';
import { verifyPassword } from './password.js';

const TOKEN_LIFETIME = '7d';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(username: string, password: string) {
    const config = getAuthConfig();
    // Luôn kiểm tra mật khẩu để thời gian phản hồi không lộ tên đúng hay sai
    const passwordOk = await verifyPassword(password, config.passwordHash);
    if (!passwordOk || username !== config.username) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }

    const token = await this.jwt.signAsync(
      { sub: username },
      {
        secret: config.secret,
        algorithm: 'HS256',
        expiresIn: TOKEN_LIFETIME,
      },
    );
    return { token, username };
  }

  /** Trả về tên quản lý nếu token hợp lệ */
  async verify(token: string): Promise<string> {
    const config = getAuthConfig();
    const payload = await this.jwt
      .verifyAsync<{ sub?: string }>(token, {
        secret: config.secret,
        algorithms: ['HS256'],
      })
      .catch(() => null);

    if (payload?.sub !== config.username) {
      throw new UnauthorizedException(
        'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
      );
    }
    return config.username;
  }
}

import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { isPasswordHash } from './password.js';

const MIN_SECRET_LENGTH = 32;
const logger = new Logger('AuthConfig');

/**
 * Đọc lúc có request (Prisma nạp .env khi khởi tạo).
 * Thiếu hoặc yếu thì từ chối, không dùng giá trị mặc định.
 */
export function getAuthConfig() {
  const username = process.env.ADMIN_USERNAME ?? '';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? '';
  const secret = process.env.JWT_SECRET ?? '';

  const invalid = [
    !username && 'ADMIN_USERNAME',
    !isPasswordHash(passwordHash) && 'ADMIN_PASSWORD_HASH',
    secret.length < MIN_SECRET_LENGTH &&
      `JWT_SECRET (ít nhất ${MIN_SECRET_LENGTH} ký tự)`,
  ].filter(Boolean);

  if (invalid.length > 0) {
    logger.error(`Thiếu hoặc sai biến môi trường: ${invalid.join(', ')}`);
    throw new ServiceUnavailableException('Máy chủ chưa cấu hình đăng nhập');
  }

  return { username, passwordHash, secret };
}

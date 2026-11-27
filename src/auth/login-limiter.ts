import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
// Chặn cả trường hợp giả mạo IP để dò mật khẩu
const MAX_TOTAL = 50;

/** Đếm trong bộ nhớ, khởi động lại server là mất */
@Injectable()
export class LoginLimiter {
  private attempts: { ip: string; at: number }[] = [];

  /** Tính cả lần đang thử, để gửi song song cũng không vượt được giới hạn */
  consume(ip: string) {
    const now = Date.now();
    this.attempts = this.attempts.filter((item) => now - item.at < WINDOW_MS);

    const fromIp = this.attempts.filter((item) => item.ip === ip).length;
    if (fromIp >= MAX_PER_IP || this.attempts.length >= MAX_TOTAL) {
      throw new HttpException(
        'Đăng nhập sai quá nhiều lần, hãy thử lại sau 15 phút',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    this.attempts.push({ ip, at: now });
  }

  reset(ip: string) {
    this.attempts = this.attempts.filter((item) => item.ip !== ip);
  }
}

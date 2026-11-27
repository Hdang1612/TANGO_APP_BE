import { scrypt, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

/** Mã băm có dạng "scrypt:<salt hex>:<hash hex>", tạo bằng `npm run hash-password` */
export function isPasswordHash(value: string): boolean {
  return /^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/.test(value);
}

export function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [, salt, hash] = stored.split(':');
  return new Promise((resolve, reject) => {
    scrypt(password, Buffer.from(salt, 'hex'), KEY_LENGTH, (error, key) => {
      if (error) reject(error);
      else resolve(timingSafeEqual(key, Buffer.from(hash, 'hex')));
    });
  });
}

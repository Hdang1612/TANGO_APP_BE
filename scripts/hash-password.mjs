// Tạo giá trị cho ADMIN_PASSWORD_HASH. Mật khẩu không được lưu hay in ra.
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';

const MIN_LENGTH = 10;
let muted = false;

const output = new Writable({
  write(chunk, encoding, callback) {
    if (!muted) process.stderr.write(chunk, encoding);
    callback();
  },
});
const terminal = Boolean(process.stdin.isTTY);
const readline = createInterface({ input: process.stdin, output, terminal });
const lines = readline[Symbol.asyncIterator]();

async function ask(label) {
  process.stderr.write(label);
  muted = true;
  const { value = '' } = await lines.next();
  muted = false;
  process.stderr.write('\n');
  return value;
}

const password = await ask('Mật khẩu quản lý: ');
const repeated = terminal ? await ask('Nhập lại: ') : password;
readline.close();

if (password !== repeated) {
  console.error('Hai lần nhập không khớp.');
  process.exit(1);
}
if (password.length < MIN_LENGTH) {
  console.error(`Mật khẩu cần ít nhất ${MIN_LENGTH} ký tự.`);
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`scrypt:${salt.toString('hex')}:${hash.toString('hex')}`);

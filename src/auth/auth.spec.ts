import { execFileSync } from 'node:child_process';
import {
  Controller,
  Delete,
  Get,
  INestApplication,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthModule } from './auth.module.js';

// Controller giả: không nạp PrismaModule nên không đụng database
@Controller('things')
class ThingsController {
  @Get() read() {
    return 'ok';
  }
  @Post() create() {
    return 'ok';
  }
  @Put() replace() {
    return 'ok';
  }
  @Patch() update() {
    return 'ok';
  }
  @Delete() remove() {
    return 'ok';
  }
}

const PASSWORD = 'mat-khau-chi-de-test';
const SECRET = 'test-secret-chi-dung-trong-test-0123456789';
const WRITES = ['post', 'put', 'patch', 'delete'] as const;

describe('Đăng nhập và phân quyền', () => {
  let app: INestApplication;
  let passwordHash: string;
  const original = { ...process.env };

  const http = () => request(app.getHttpServer());
  const login = (username = 'admin', password = PASSWORD) =>
    http().post('/auth/login').send({ username, password });
  const sign = (sub: string, secret = SECRET, expiresIn = 60) =>
    new JwtService().sign({ sub }, { secret, expiresIn });

  beforeAll(() => {
    // Dùng đúng script người dùng chạy, để chắc hai bên khớp nhau
    passwordHash = execFileSync('node', ['scripts/hash-password.mjs'], {
      input: `${PASSWORD}\n`,
      stdio: 'pipe',
    })
      .toString()
      .trim();
  });

  beforeEach(async () => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD_HASH = passwordHash;
    process.env.JWT_SECRET = SECRET;
    const module = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [ThingsController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    process.env = { ...original };
  });

  it('khách đọc được nhưng không ghi được', async () => {
    await http().get('/things').expect(200);
    await http().head('/things').expect(200);
    for (const method of WRITES) await http()[method]('/things').expect(401);
  });

  it('đăng nhập đúng thì ghi được', async () => {
    const { body } = await login().expect(200);
    const header = `Bearer ${body.token}`;
    for (const method of WRITES) {
      const response = await http()[method]('/things').set({
        Authorization: header,
      });
      expect(response.status).toBeLessThan(300);
    }
    await http()
      .get('/auth/me')
      .set({ Authorization: header })
      .expect(200, { username: 'admin' });
  });

  it('sai tên hoặc mật khẩu thì không cấp token', async () => {
    await login('admin', 'sai-mat-khau').expect(401);
    await login('khac').expect(401);
    await http().post('/auth/login').send({}).expect(400);
  });

  it('từ chối token giả, hết hạn, sai người', async () => {
    const tokens = [
      'rac',
      sign('admin', `${SECRET}-khac`),
      sign('admin', SECRET, -10),
      sign('khac'),
    ];
    for (const token of tokens) {
      await http()
        .post('/things')
        .set({ Authorization: `Bearer ${token}` })
        .expect(401);
    }
    await http().get('/auth/me').expect(401);
  });

  it('khóa sau 5 lần sai, kể cả khi lần sau nhập đúng', async () => {
    for (let i = 0; i < 5; i++) await login('admin', 'sai').expect(401);
    await login().expect(429);
  });

  it('đăng nhập đúng thì xóa bộ đếm', async () => {
    for (let i = 0; i < 4; i++) await login('admin', 'sai').expect(401);
    await login().expect(200);
    await login('admin', 'sai').expect(401);
  });

  it.each(['ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH', 'JWT_SECRET'])(
    'thiếu %s thì không ai ghi được',
    async (name) => {
      delete process.env[name];
      await login().expect(503);
      await http()
        .post('/things')
        .set({ Authorization: `Bearer ${sign('admin')}` })
        .expect(503);
      await http().get('/things').expect(200);
    },
  );

  it('JWT_SECRET quá ngắn bị coi là chưa cấu hình', async () => {
    process.env.JWT_SECRET = 'ngan';
    await login().expect(503);
  });
});

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'auth:public';
export const REQUIRE_AUTH = 'auth:required';

/** Cho phép gọi không cần đăng nhập, kể cả POST */
export const Public = () => SetMetadata(IS_PUBLIC, true);

/** Bắt đăng nhập kể cả khi là GET */
export const RequireAuth = () => SetMetadata(REQUIRE_AUTH, true);

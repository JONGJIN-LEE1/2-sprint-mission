import { object, string, size } from 'superstruct';

export const SignupStruct = object({
  email: size(string(), 1, 255),
  nickname: size(string(), 1, 50),
  password: size(string(), 6, 255), // 최소 6자 이상
});

export const LoginStruct = object({
  email: size(string(), 1, 255),
  password: size(string(), 1, 255),
});

// Refresh Token 구조체 추가
export const RefreshTokenStruct = object({
  refreshToken: string(),
});

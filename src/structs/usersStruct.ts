import { object, string, nonempty, coerce, refine, nullable, Infer } from 'superstruct';
import { PageParamsStruct } from './commonStructs';

// 유저 정보 수정
export const UpdateUserBodyStruct = object({
  nickname: coerce(nonempty(string()), string(), (value) => value.trim()),
  image: nullable(string()),
});

// 비밀번호 변경
export const ChangePasswordBodyStruct = object({
  currentPassword: nonempty(string()),
  newPassword: refine(nonempty(string()), 'PasswordLength', (value) => value.length >= 8),
});

// 유저의 상품 목록 조회
export const GetUserProductsParamsStruct = PageParamsStruct;

// 타입 export 추가
export type UpdateUserBody = Infer<typeof UpdateUserBodyStruct>;
export type ChangePasswordBody = Infer<typeof ChangePasswordBodyStruct>;
export type GetUserProductsParams = Infer<typeof GetUserProductsParamsStruct>;

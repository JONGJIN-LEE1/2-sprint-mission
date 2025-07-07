import { nonempty, object, partial, string, Infer } from 'superstruct';
import { CursorParamsStruct } from './commonStructs.js';

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
});

export const GetCommentListParamsStruct = CursorParamsStruct;

export const UpdateCommentBodyStruct = partial(CreateCommentBodyStruct);

// 타입 export 추가
export type CreateCommentBody = Infer<typeof CreateCommentBodyStruct>;
export type GetCommentListParams = Infer<typeof GetCommentListParamsStruct>;
export type UpdateCommentBody = Infer<typeof UpdateCommentBodyStruct>;

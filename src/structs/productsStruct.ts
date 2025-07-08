import { coerce, partial, object, string, min, nonempty, array, integer, Infer } from 'superstruct';
import { PageParamsStruct } from './commonStructs';

export const CreateProductBodyStruct = object({
  name: coerce(nonempty(string()), string(), (value) => value.trim()),
  description: nonempty(string()),
  price: min(integer(), 0),
  tags: array(nonempty(string())),
  images: array(nonempty(string())),
});

export const GetProductListParamsStruct = PageParamsStruct;

export const UpdateProductBodyStruct = partial(CreateProductBodyStruct);

// 타입 export 추가
export type CreateProductBody = Infer<typeof CreateProductBodyStruct>;
export type GetProductListParams = Infer<typeof GetProductListParamsStruct>;
export type UpdateProductBody = Infer<typeof UpdateProductBodyStruct>;

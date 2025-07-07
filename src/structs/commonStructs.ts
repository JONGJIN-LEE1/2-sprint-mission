import {
  coerce,
  integer,
  object,
  string,
  defaulted,
  optional,
  enums,
  nonempty,
  Infer,
} from 'superstruct';

/** Convert string to integer then validate it */
const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const IdParamsStruct = object({
  id: integerString,
});

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(nonempty(string())),
});

export const CursorParamsStruct = object({
  cursor: defaulted(integerString, 0),
  limit: defaulted(integerString, 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(nonempty(string())),
});

// 타입 export 추가
export type IdParams = Infer<typeof IdParamsStruct>;
export type PageParams = Infer<typeof PageParamsStruct>;
export type CursorParams = Infer<typeof CursorParamsStruct>;

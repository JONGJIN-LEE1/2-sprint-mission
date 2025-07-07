import { Request, Response, NextFunction } from 'express';

// withAsync 함수의 타입을 올바르게 지정합니다.
// 이 함수는 'handler'라는 함수를 인자로 받고,
// (req, res, next)를 인자로 받는 'async' 함수를 반환합니다.
export function withAsync(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any | void>,
) {
  // 반환되는 async 함수의 타입도 정확히 지정합니다.
  // 이 async 함수는 아무것도 반환하지 않으므로 Promise<void>를 반환합니다.
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (e: unknown) {
      // catch 절의 e는 unknown 타입이 기본이므로 명시적으로 unknown을 사용하거나, 필요시 Error 타입으로 단언할 수 있습니다.
      next(e);
    }
  };
}

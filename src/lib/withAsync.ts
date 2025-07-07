import { Request, Response, NextFunction } from 'express';

// withAsync 함수를 제네릭으로 개선하여 다양한 Request 타입을 지원합니다.
export function withAsync<TRequest extends Request = Request>(
  handler: (req: TRequest, res: Response, next: NextFunction) => Promise<any | void>,
) {
  // 반환되는 async 함수의 타입도 정확히 지정합니다.
  return async (req: TRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (e: unknown) {
      // catch 절의 e는 unknown 타입이 기본이므로 명시적으로 unknown을 사용합니다.
      next(e);
    }
  };
}

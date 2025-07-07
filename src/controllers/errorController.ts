import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

// Prisma 에러 타입 (필요시 더 정확한 타입으로 교체)
interface PrismaError extends Error {
  code?: string;
}

// ✅ 타입 명시 + 반환 타입 void
export const defaultNotFoundHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).send({ message: 'Not found' });
};

// ✅ 타입 명시 + 반환 타입 void
export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
    return;
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).send({ message: 'Invalid JSON' });
    return;
  }

  if ('code' in err && err.code) {
    console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
};

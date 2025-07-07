import { Request, Response, NextFunction } from 'express';
import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

// Prisma 에러 타입 (필요시 더 정확한 타입으로 교체)
interface PrismaError extends Error {
  code?: string;
}

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(
  err: Error | PrismaError | SyntaxError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  /** Prisma error codes */
  if ('code' in err && err.code) {
    console.error(err);
    return res.status(500).send({ message: 'Failed to process data' });
  }

  /** Application error */
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}

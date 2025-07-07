import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../lib/prismaClient.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// JWT 페이로드 타입 정의
interface JwtPayload {
  id: number;
  iat?: number;
  exp?: number;
}

// 인증된 사용자 타입 정의
export interface AuthenticatedUser {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
}

// Request 인터페이스 확장
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new BadRequestError('인증 토큰이 필요합니다.');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 사용자 정보 조회
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, nickname: true, image: true },
    });

    if (!user) {
      throw new BadRequestError('유효하지 않은 토큰입니다.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new BadRequestError('유효하지 않은 토큰입니다.'));
    } else {
      next(error);
    }
  }
};

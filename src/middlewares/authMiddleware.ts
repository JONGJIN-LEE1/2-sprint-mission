import jwt from 'jsonwebtoken';
import { prismaClient } from '../lib/prismaClient.ts';
import BadRequestError from '../lib/errors/BadRequestError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new BadRequestError('인증 토큰이 필요합니다.');
    }

    const decoded = jwt.verify(token, JWT_SECRET);

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
    if (error instanceof jwt.tsonWebTokenError) {
      next(new BadRequestError('유효하지 않은 토큰입니다.'));
    } else {
      next(error);
    }
  }
};

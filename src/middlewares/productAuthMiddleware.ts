import { Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import { AuthenticatedRequest } from './authMiddleware';

export const checkProductOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user?.id;

    // user가 없는 경우 처리
    if (!userId) {
      throw new BadRequestError('인증되지 않은 사용자입니다.');
    }

    // 상품 조회
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });

    if (!product) {
      throw new NotFoundError('Product', productId);
    }

    // 소유자 확인
    if (product.userId !== userId) {
      throw new BadRequestError('이 상품을 수정하거나 삭제할 권한이 없습니다.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

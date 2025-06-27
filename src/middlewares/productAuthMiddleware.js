import { prismaClient } from '../lib/prismaClient.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export const checkProductOwnership = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user.id;

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

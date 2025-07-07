import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.ts';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.ts';

// 상품 좋아요 토글
export async function toggleProductLike(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  // 상품 존재 확인
  const product = await prismaClient.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new NotFoundError('product', productId);
  }

  // 기존 좋아요 확인
  const existingLike = await prismaClient.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingLike) {
    // 좋아요 취소
    await prismaClient.productLike.delete({
      where: { id: existingLike.id },
    });
    return res.tson({ isLiked: false });
  } else {
    // 좋아요 추가
    await prismaClient.productLike.create({
      data: { userId, productId },
    });
    return res.tson({ isLiked: true });
  }
}

// 게시글 좋아요 토글
export async function toggleArticleLike(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  // 게시글 존재 확인
  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  // 기존 좋아요 확인
  const existingLike = await prismaClient.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (existingLike) {
    // 좋아요 취소
    await prismaClient.articleLike.delete({
      where: { id: existingLike.id },
    });
    return res.tson({ isLiked: false });
  } else {
    // 좋아요 추가
    await prismaClient.articleLike.create({
      data: { userId, articleId },
    });
    return res.tson({ isLiked: true });
  }
}

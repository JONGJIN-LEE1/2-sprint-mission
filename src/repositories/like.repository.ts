import { prismaClient } from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

export class LikeRepository {
  // Product Like methods
  async findProductLike(userId: number, productId: number) {
    return await prismaClient.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async createProductLike(data: Prisma.ProductLikeCreateInput) {
    return await prismaClient.productLike.create({
      data,
    });
  }

  async deleteProductLike(id: number) {
    return await prismaClient.productLike.delete({
      where: { id },
    });
  }

  async countProductLikes(productId: number) {
    return await prismaClient.productLike.count({
      where: { productId },
    });
  }

  // Article Like methods
  async findArticleLike(userId: number, articleId: number) {
    return await prismaClient.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }

  async createArticleLike(data: Prisma.ArticleLikeCreateInput) {
    return await prismaClient.articleLike.create({
      data,
    });
  }

  async deleteArticleLike(id: number) {
    return await prismaClient.articleLike.delete({
      where: { id },
    });
  }

  async countArticleLikes(articleId: number) {
    return await prismaClient.articleLike.count({
      where: { articleId },
    });
  }

  // Check existence methods (for validation)
  async checkProductExists(productId: number) {
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    return !!product;
  }

  async checkArticleExists(articleId: number) {
    const article = await prismaClient.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });
    return !!article;
  }
}

export const likeRepository = new LikeRepository();

import { likeRepository } from '../repositories/like.repository';
import NotFoundError from '../lib/errors/NotFoundError';
import { LikeToggleResponseDto } from '../dtos/like.dto';

export class LikeService {
  async toggleProductLike(userId: number, productId: number): Promise<LikeToggleResponseDto> {
    // Check if product exists
    const productExists = await likeRepository.checkProductExists(productId);
    if (!productExists) {
      throw new NotFoundError('product', productId);
    }

    // Check existing like
    const existingLike = await likeRepository.findProductLike(userId, productId);

    if (existingLike) {
      // Unlike: delete the like
      await likeRepository.deleteProductLike(existingLike.id);
      return { isLiked: false };
    } else {
      // Like: create new like
      await likeRepository.createProductLike({
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      });
      return { isLiked: true };
    }
  }

  async toggleArticleLike(userId: number, articleId: number): Promise<LikeToggleResponseDto> {
    // Check if article exists
    const articleExists = await likeRepository.checkArticleExists(articleId);
    if (!articleExists) {
      throw new NotFoundError('article', articleId);
    }

    // Check existing like
    const existingLike = await likeRepository.findArticleLike(userId, articleId);

    if (existingLike) {
      // Unlike: delete the like
      await likeRepository.deleteArticleLike(existingLike.id);
      return { isLiked: false };
    } else {
      // Like: create new like
      await likeRepository.createArticleLike({
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
      });
      return { isLiked: true };
    }
  }

  // Additional methods for getting like counts (useful for other services)
  async getProductLikeCount(productId: number): Promise<number> {
    return await likeRepository.countProductLikes(productId);
  }

  async getArticleLikeCount(articleId: number): Promise<number> {
    return await likeRepository.countArticleLikes(articleId);
  }

  // Check if user liked a specific item
  async hasUserLikedProduct(userId: number, productId: number): Promise<boolean> {
    const like = await likeRepository.findProductLike(userId, productId);
    return !!like;
  }

  async hasUserLikedArticle(userId: number, articleId: number): Promise<boolean> {
    const like = await likeRepository.findArticleLike(userId, articleId);
    return !!like;
  }
}

export const likeService = new LikeService();

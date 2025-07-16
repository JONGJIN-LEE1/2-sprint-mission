import { Response } from 'express';
import { create } from 'superstruct';
import { likeService } from '../services/like.service';
import { IdParamsStruct } from '../structs/commonStructs';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// 상품 좋아요 토글
export async function toggleProductLike(req: AuthenticatedRequest, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user!.id;

  const result = await likeService.toggleProductLike(userId, productId);

  return res.json(result);
}

// 게시글 좋아요 토글
export async function toggleArticleLike(req: AuthenticatedRequest, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user!.id;

  const result = await likeService.toggleArticleLike(userId, articleId);

  return res.json(result);
}

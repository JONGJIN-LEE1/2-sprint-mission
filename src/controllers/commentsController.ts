import { Response } from 'express';
import { create } from 'superstruct';
import { commentService } from '../services/comment.service.js';
import { CreateCommentBodyStruct, UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export async function createComment(req: AuthenticatedRequest, res: Response) {
  const data = create(req.body, CreateCommentBodyStruct);
  const userId = req.user!.id;

  // articleId나 productId를 query parameter로 받음
  const articleId = req.query.articleId ? parseInt(req.query.articleId as string) : undefined;
  const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;

  if (!articleId && !productId) {
    throw new Error('articleId 또는 productId가 필요합니다.');
  }

  const comment = await commentService.createComment({
    content: data.content,
    userId: userId,
    articleId: articleId,
    productId: productId,
  });

  return res.status(201).json(comment);
}

export async function updateComment(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);

  const updatedComment = await commentService.updateComment(id, data);

  return res.json(updatedComment);
}

export async function deleteComment(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  await commentService.deleteComment(id);

  return res.status(204).send();
}

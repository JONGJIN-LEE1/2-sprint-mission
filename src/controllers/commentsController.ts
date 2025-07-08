import { Response } from 'express';
import { create } from 'superstruct';
import { commentService } from '../services/comment.service';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

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

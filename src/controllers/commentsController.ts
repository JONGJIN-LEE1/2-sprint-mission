import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.ts';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.ts';
import { IdParamsStruct } from '../structs/commonStructs.ts';

export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
    include: { user: { select: { id: true, nickname: true, image: true } } },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send();
}

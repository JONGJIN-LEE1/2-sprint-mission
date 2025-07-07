import { prismaClient } from '../lib/prismaClient.ts';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export const checkCommentOwnership = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;

    // 댓글 조회
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      throw new NotFoundError('Comment', commentId);
    }

    // 소유자 확인
    if (comment.userId !== userId) {
      throw new BadRequestError('이 댓글을 수정하거나 삭제할 권한이 없습니다.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

import { Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import { AuthenticatedRequest } from './authMiddleware';

export const checkCommentOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user?.id;

    // user가 없는 경우 처리
    if (!userId) {
      throw new BadRequestError('인증되지 않은 사용자입니다.');
    }

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

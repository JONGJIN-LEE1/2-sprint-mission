import { Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import { AuthenticatedRequest } from './authMiddleware';

export const checkArticleOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const articleId = parseInt(req.params.id);
    const userId = req.user?.id;

    // user가 없는 경우 처리
    if (!userId) {
      throw new BadRequestError('인증되지 않은 사용자입니다.');
    }

    // 게시글 조회
    const article = await prismaClient.article.findUnique({
      where: { id: articleId },
      select: { userId: true },
    });

    if (!article) {
      throw new NotFoundError('Article', articleId);
    }

    // 소유자 확인
    if (article.userId !== userId) {
      throw new BadRequestError('이 게시글을 수정하거나 삭제할 권한이 없습니다.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

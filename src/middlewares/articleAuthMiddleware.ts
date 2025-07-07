import { prismaClient } from '../lib/prismaClient.ts';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export const checkArticleOwnership = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id);
    const userId = req.user.id;

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

import express from 'express';
import { withAsync } from '../lib/withAsync.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { checkArticleOwnership } from '../middlewares/articleAuthMiddleware.ts';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from '../controllers/articlesController.ts';

const articlesRouter = express.Router();

// 공개 라우트 (인증 불필요)
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

// 인증 필요한 라우트
articlesRouter.post('/', authenticateToken, withAsync(createArticle));

// 소유자 확인 필요한 라우트
articlesRouter.patch(
  '/:id',
  authenticateToken,
  withAsync(checkArticleOwnership),
  withAsync(updateArticle),
);
articlesRouter.delete(
  '/:id',
  authenticateToken,
  withAsync(checkArticleOwnership),
  withAsync(deleteArticle),
);

// 댓글 작성도 인증 필요
articlesRouter.post('/:id/comments', authenticateToken, withAsync(createComment));

export default articlesRouter;

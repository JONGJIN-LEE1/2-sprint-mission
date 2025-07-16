import express from 'express';
import { withAsync } from '../lib/withAsync';
import { authenticateToken } from '../middlewares/authMiddleware';
import { toggleProductLike, toggleArticleLike } from '../controllers/likesController';

const likesRouter = express.Router();

// 모든 좋아요 기능은 인증 필요
likesRouter.use(authenticateToken);

// 상품 좋아요 토글
likesRouter.post('/products/:id', withAsync(toggleProductLike));

// 게시글 좋아요 토글
likesRouter.post('/articles/:id', withAsync(toggleArticleLike));

export default likesRouter;

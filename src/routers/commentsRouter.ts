import express from 'express';
import { withAsync } from '../lib/withAsync.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { checkCommentOwnership } from '../middlewares/commentAuthMiddleware.ts';
import { updateComment, deleteComment } from '../controllers/commentsController.ts';

const commentsRouter = express.Router();

// 소유자 확인이 필요한 라우트
commentsRouter.patch(
  '/:id',
  authenticateToken,
  withAsync(checkCommentOwnership),
  withAsync(updateComment),
);
commentsRouter.delete(
  '/:id',
  authenticateToken,
  withAsync(checkCommentOwnership),
  withAsync(deleteComment),
);

export default commentsRouter;

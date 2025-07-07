import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { checkCommentOwnership } from '../middlewares/commentAuthMiddleware.js';
import { updateComment, deleteComment } from '../controllers/commentsController.js';

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

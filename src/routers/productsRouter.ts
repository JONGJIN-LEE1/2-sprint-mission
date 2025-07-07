import express from 'express';
import { withAsync } from '../lib/withAsync.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { checkProductOwnership } from '../middlewares/productAuthMiddleware.ts';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from '../controllers/productsController.ts';

const productsRouter = express.Router();

// 공개 라우트 (인증 불필요)
productsRouter.get('/', withAsync(getProductList));
productsRouter.get('/:id', withAsync(getProduct));
productsRouter.get('/:id/comments', withAsync(getCommentList));

// 보호된 라우트 (인증 필요)
productsRouter.post('/', authenticateToken, withAsync(createProduct));

// 소유자 확인이 필요한 라우트
productsRouter.patch(
  '/:id',
  authenticateToken,
  withAsync(checkProductOwnership),
  withAsync(updateProduct),
);
productsRouter.delete(
  '/:id',
  authenticateToken,
  withAsync(checkProductOwnership),
  withAsync(deleteProduct),
);

// 댓글 작성도 인증이 필요
productsRouter.post('/:id/comments', authenticateToken, withAsync(createComment));

export default productsRouter;

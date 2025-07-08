import express from 'express';
import { withAsync } from '../lib/withAsync';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getMyProducts,
  getMyLikedProducts, // 추가
} from '../controllers/usersController';

const usersRouter = express.Router();

// 모든 라우트는 인증이 필요함
usersRouter.use(authenticateToken);

// 자신의 정보 조회
usersRouter.get('/me', withAsync(getMyProfile));

// 자신의 정보 수정
usersRouter.patch('/me', withAsync(updateMyProfile));

// 비밀번호 변경
usersRouter.patch('/me/password', withAsync(changePassword));

// 자신이 등록한 상품 목록 조회
usersRouter.get('/me/products', withAsync(getMyProducts));

// 좋아요한 상품 목록 조회
usersRouter.get('/me/liked-products', withAsync(getMyLikedProducts));

export default usersRouter;

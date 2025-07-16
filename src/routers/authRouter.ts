import express from 'express';
import { signup, login, refreshToken, logout } from '../controllers/authController';
import { withAsync } from '../lib/withAsync';

const authRouter = express.Router();

authRouter.post('/signup', withAsync(signup));
authRouter.post('/login', withAsync(login));
authRouter.post('/refresh', withAsync(refreshToken)); // 추가
authRouter.post('/logout', withAsync(logout)); // 추가

export default authRouter;

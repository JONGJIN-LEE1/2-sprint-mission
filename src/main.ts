import express from 'express';
import cors from 'cors';
import path from 'path';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants.js';
import articlesRouter from './routers/articlesRouter.js';
import productsRouter from './routers/productsRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import imagesRouter from './routers/imagesRouter.js';
import authRouter from './routers/authRouter.js';
import usersRouter from './routers/usersRouter.js';
import likesRouter from './routers/likesRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.js';

const app = express();

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 정적 파일 서빙
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

// 라우터 등록
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/likes', likesRouter);

// 404 핸들러
app.use(defaultNotFoundHandler);

// 글로벌 에러 핸들러
app.use(globalErrorHandler);

// 서버 시작
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

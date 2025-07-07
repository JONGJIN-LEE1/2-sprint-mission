import express from 'express';
import cors from 'cors';
import path from 'path';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants.ts';
import articlesRouter from './routers/articlesRouter.ts';
import productsRouter from './routers/productsRouter.ts';
import commentsRouter from './routers/commentsRouter.ts';
import imagesRouter from './routers/imagesRouter.ts';
import authRouter from './routers/authRouter.ts'; // 추가
import usersRouter from './routers/usersRouter.ts'; // 추가
import likesRouter from './routers/likesRouter.ts'; // 추가

import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter); // 추가
app.use('/users', usersRouter); // 추가
app.use('/likes', likesRouter); // 추가

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

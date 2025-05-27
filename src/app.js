const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/product.routes');
const uploadRoutes = require('./routes/upload.routes');
const articleRoutes = require('./routes/article.routes');
const commentRoutes = require('./routes/comment.routes');
const path = require('path');

const app = express();

require('dotenv').config();

app.use(cors({
  origin: process.env.CORS_ORIGIN, // 허용할 출처
  credentials: true,               // 쿠키/인증 헤더 허용 시 true
}));
app.use(morgan('dev'));
app.use(express.json());

// 라우트
app.use('/products', productRoutes);
app.use('/upload', uploadRoutes);
app.use('/articles', articleRoutes);
app.use('/comments', commentRoutes);

// 정적 파일 제공
app.use('/uploads', express.static('uploads'));

// 에러 처리
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
// src/routes/article.routes.js (수정된 내용)
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { validateArticle } = require('../middlewares/validate');
const commentRoutes = require('./comment.routes'); 
const commentController = require('../controllers/comment.controller'); 

router
  .route('/')
  .post(validateArticle, articleController.createArticle)
  .get(articleController.getArticleList);

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

// 게시글에 대한 댓글 라우트 추가 
router.post('/:articleId/comments', validateComment, commentController.createArticleComment);
router.get('/:articleId/comments', commentController.getArticleComments);

module.exports = router;
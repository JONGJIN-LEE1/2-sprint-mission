const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { validateComment } = require('../middlewares/validate');

// 게시글 댓글

router
  .route('/articles/:articleId')
  .post(validateComment, commentController.createArticleComment)
  .get(commentController.getArticleComments);

// 상품 댓글

router
  .route('/products/:productId')
  .post(validateComment, commentController.createProductComment)
  .get(commentController.getProductComments);

// 공통 댓글 수정/삭제

router
  .route('/:id')
  .patch(validateComment, commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
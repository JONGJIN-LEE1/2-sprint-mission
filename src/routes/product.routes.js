// src/routes/product.routes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { validateProduct } = require('../middlewares/validate');
const commentRoutes = require('./comment.routes'); 
const commentController = require('../controllers/comment.controller'); 


const { validateComment } = require('../middlewares/validate'); 

router
  .route('/')
  .post(validateProduct, productController.createProduct)
  .get(productController.getProductList);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

// 상품에 대한 댓글 라우트
router.post('/:productId/comments', validateComment, commentController.createProductComment); // 여기가 문제의 21번째 줄입니다.
router.get('/:productId/comments', commentController.getProductComments);

module.exports = router;
// src/routes/product.routes.js (수정된 내용)
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { validateProduct } = require('../middlewares/validate');
const commentRoutes = require('./comment.routes'); 
const commentController = require('../controllers/comment.controller'); 

router
  .route('/')
  .post(validateProduct, productController.createProduct)
  .get(productController.getProductList);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

// 상품에 대한 댓글 라우트 추가 
router.post('/:productId/comments', validateComment, commentController.createProductComment);
router.get('/:productId/comments', commentController.getProductComments);



module.exports = router;
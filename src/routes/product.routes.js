const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { validateProduct } = require('../middlewares/validate');

router
  .route('/')
  .post(validateProduct, productController.createProduct)
  .get(productController.getProductList); //목록 조회

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
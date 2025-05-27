const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { validateArticle } = require('../middlewares/validate');

router
  .route('/')
  .post(validateArticle, articleController.createArticle)
  .get(articleController.getArticles);

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(validateArticle, articleController.updateArticle)
  .delete(articleController.deleteArticle);

module.exports = router;
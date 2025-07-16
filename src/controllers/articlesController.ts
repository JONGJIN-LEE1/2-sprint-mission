import { Response } from 'express';
import { create } from 'superstruct';
import { articleService } from '../services/article.service';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export async function createArticle(req: AuthenticatedRequest, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const userId = req.user!.id;

  const article = await articleService.createArticle(userId, data);

  return res.status(201).json(article);
}

export async function getArticle(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.id;

  const article = await articleService.getArticle(id, userId);

  return res.json(article);
}

export async function updateArticle(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await articleService.updateArticle(id, data);

  return res.json(article);
}

export async function deleteArticle(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  await articleService.deleteArticle(id);

  return res.status(204).send();
}

export async function getArticleList(req: AuthenticatedRequest, res: Response) {
  const queryParams = create(req.query, GetArticleListParamsStruct);

  const result = await articleService.getArticleList(queryParams);

  return res.json(result);
}

export async function createComment(req: AuthenticatedRequest, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const data = create(req.body, CreateCommentBodyStruct);
  const userId = req.user!.id;

  const comment = await articleService.createComment(articleId, userId, data);

  return res.status(201).json(comment);
}

export async function getCommentList(req: AuthenticatedRequest, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const queryParams = create(req.query, GetCommentListParamsStruct);

  const result = await articleService.getCommentList(articleId, queryParams);

  return res.json(result);
}

import { Response } from 'express';
import { create } from 'superstruct';
import { productService } from '../services/product.service';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  const data = create(req.body, CreateProductBodyStruct);
  const userId = req.user!.id;

  const product = await productService.createProduct(userId, data);

  res.status(201).json(product);
}

export async function getProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.id;

  const product = await productService.getProduct(id, userId);

  return res.json(product);
}

export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);

  const product = await productService.updateProduct(id, data);

  return res.json(product);
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  await productService.deleteProduct(id);

  return res.status(204).send();
}

export async function getProductList(req: AuthenticatedRequest, res: Response) {
  const queryParams = create(req.query, GetProductListParamsStruct);

  const result = await productService.getProductList(queryParams);

  return res.json(result);
}

export async function createComment(req: AuthenticatedRequest, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const data = create(req.body, CreateCommentBodyStruct);
  const userId = req.user!.id;

  const comment = await productService.createComment(productId, userId, data);

  return res.status(201).json(comment);
}

export async function getCommentList(req: AuthenticatedRequest, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const queryParams = create(req.query, GetCommentListParamsStruct);

  const result = await productService.getCommentList(productId, queryParams);

  return res.json(result);
}

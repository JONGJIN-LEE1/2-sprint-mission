import { Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);

  const product = await prismaClient.product.create({
    data: {
      name,
      description,
      price,
      tags,
      images,
      userId: req.user!.id, // 로그인한 사용자 ID 추가
    },
    include: { user: { select: { id: true, nickname: true, image: true } } },
  });

  res.status(201).send(product);
}

// getProduct 함수 수정
export async function getProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.id; // 로그인하지 않은 경우도 고려

  const product = await prismaClient.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!product) {
    throw new NotFoundError('product', id);
  }

  // isLiked 확인
  let isLiked = false;
  if (userId) {
    const like = await prismaClient.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: id,
        },
      },
    });
    isLiked = !!like;
  }

  return res.send({
    ...product,
    likeCount: product._count.likes,
    isLiked,
  });
}

export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
    include: { user: { select: { id: true, nickname: true, image: true } } },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req: AuthenticatedRequest, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? { OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }] }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
    include: { user: { select: { id: true, nickname: true, image: true } } },
  });

  return res.send({ list: products, totalCount });
}

export async function createComment(req: AuthenticatedRequest, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const comment = await prismaClient.comment.create({
    data: {
      productId,
      content,
      userId: req.user!.id, // 추가
    },
    include: { user: { select: { id: true, nickname: true, image: true } } },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: AuthenticatedRequest, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    include: {
      // 추가
      user: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({ list: comments, nextCursor });
}

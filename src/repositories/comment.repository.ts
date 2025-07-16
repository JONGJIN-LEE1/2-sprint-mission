import { prismaClient } from '../lib/prismaClient.js';
import { Prisma } from '@prisma/client';

export class CommentRepository {
  private readonly commentInclude = {
    user: {
      select: {
        id: true,
        nickname: true,
        image: true,
      },
    },
  };

  async create(data: Prisma.CommentCreateInput) {
    return await prismaClient.comment.create({
      data,
      include: this.commentInclude,
    });
  }

  async findById(id: number) {
    return await prismaClient.comment.findUnique({
      where: { id },
      include: this.commentInclude,
    });
  }

  async update(id: number, data: Prisma.CommentUpdateInput) {
    return await prismaClient.comment.update({
      where: { id },
      data,
      include: this.commentInclude,
    });
  }

  async delete(id: number) {
    return await prismaClient.comment.delete({
      where: { id },
    });
  }

  async findMany(params: {
    cursor?: { id: number } | undefined;
    take?: number;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }) {
    return await prismaClient.comment.findMany({
      ...params,
      include: this.commentInclude,
    });
  }

  // 존재 여부 확인 메서드들
  async checkArticleExists(articleId: number): Promise<boolean> {
    const article = await prismaClient.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });
    return !!article;
  }

  async checkProductExists(productId: number): Promise<boolean> {
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    return !!product;
  }
}

export const commentRepository = new CommentRepository();

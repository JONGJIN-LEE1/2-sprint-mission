import { prismaClient } from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

export class ArticleRepository {
  private readonly articleInclude = {
    user: {
      select: {
        id: true,
        nickname: true,
        image: true,
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
  };

  async create(data: Prisma.ArticleCreateInput) {
    return await prismaClient.article.create({
      data,
      include: this.articleInclude,
    });
  }

  async findById(id: number) {
    return await prismaClient.article.findUnique({
      where: { id },
      include: this.articleInclude,
    });
  }

  async findByIdSimple(id: number) {
    return await prismaClient.article.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.ArticleUpdateInput) {
    return await prismaClient.article.update({
      where: { id },
      data,
      include: this.articleInclude,
    });
  }

  async delete(id: number) {
    return await prismaClient.article.delete({
      where: { id },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
  }) {
    return await prismaClient.article.findMany({
      ...params,
      include: this.articleInclude,
    });
  }

  async count(where?: Prisma.ArticleWhereInput) {
    return await prismaClient.article.count({ where });
  }

  async checkUserLiked(userId: number, articleId: number) {
    const like = await prismaClient.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return !!like;
  }
}

export const articleRepository = new ArticleRepository();

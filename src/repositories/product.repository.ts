import { prismaClient } from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

export class ProductRepository {
  private readonly productInclude = {
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

  async create(data: Prisma.ProductCreateInput) {
    return await prismaClient.product.create({
      data,
      include: this.productInclude,
    });
  }

  async findById(id: number) {
    return await prismaClient.product.findUnique({
      where: { id },
      include: this.productInclude,
    });
  }

  async findByIdSimple(id: number) {
    return await prismaClient.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await prismaClient.product.update({
      where: { id },
      data,
      include: this.productInclude,
    });
  }

  async delete(id: number) {
    return await prismaClient.product.delete({
      where: { id },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    return await prismaClient.product.findMany({
      ...params,
      include: this.productInclude,
    });
  }

  async count(where?: Prisma.ProductWhereInput) {
    return await prismaClient.product.count({ where });
  }

  async checkUserLiked(userId: number, productId: number) {
    const like = await prismaClient.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!like;
  }
}

export const productRepository = new ProductRepository();

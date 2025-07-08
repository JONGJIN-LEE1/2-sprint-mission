import { prismaClient } from '../lib/prismaClient.js';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return await prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await prismaClient.user.create({
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return await prismaClient.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(id: number, hashedPassword: string) {
    return await prismaClient.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async findByIdWithPassword(id: number) {
    return await prismaClient.user.findUnique({
      where: { id },
    });
  }

  async findByEmailWithPassword(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }

  // Product related methods
  async findUserProducts(params: {
    userId: number;
    skip: number;
    take: number;
    orderBy: any;
    keyword?: string;
  }) {
    const where = {
      userId: params.userId,
      name: params.keyword ? { contains: params.keyword } : undefined,
    };

    return await prismaClient.product.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
      where,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  async countUserProducts(userId: number, keyword?: string) {
    const where = {
      userId,
      name: keyword ? { contains: keyword } : undefined,
    };

    return await prismaClient.product.count({ where });
  }

  async findLikedProducts(params: { userId: number; skip: number; take: number; orderBy: any }) {
    const where = {
      likes: {
        some: {
          userId: params.userId,
        },
      },
    };

    return await prismaClient.product.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
      where,
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
  }

  async countLikedProducts(userId: number) {
    const where = {
      likes: {
        some: {
          userId,
        },
      },
    };

    return await prismaClient.product.count({ where });
  }
}

export const userRepository = new UserRepository();

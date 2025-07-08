import { prismaClient } from '../lib/prismaClient';
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
}

export const commentRepository = new CommentRepository();

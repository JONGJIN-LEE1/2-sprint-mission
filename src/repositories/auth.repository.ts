import { prismaClient } from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return await prismaClient.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(token: string) {
    return await prismaClient.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string) {
    return await prismaClient.refreshToken.deleteMany({
      where: { token },
    });
  }

  async deleteUserRefreshTokens(userId: number) {
    return await prismaClient.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredRefreshTokens() {
    return await prismaClient.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

export const authRepository = new AuthRepository();

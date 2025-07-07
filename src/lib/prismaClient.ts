import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();
export const prisma = prismaClient;

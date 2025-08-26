import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// 테스트 환경 변수 설정
dotenv.config({ path: '.env.test' });

// 테스트용 Prisma Client
export const prisma = new PrismaClient();

// 각 테스트 전에 데이터베이스 정리
beforeEach(async () => {
  // 트랜잭션으로 모든 테이블 초기화
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.like.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.article.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

// 모든 테스트 완료 후 연결 종료
afterAll(async () => {
  await prisma.$disconnect();
});

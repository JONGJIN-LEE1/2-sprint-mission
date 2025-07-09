import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. 비밀번호 해시
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  // 2. 유저 생성
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      nickname: '관리자',
      image: null,
    },
  });

  // 3. 게시글 생성
  const article = await prisma.article.create({
    data: {
      title: '첫 번째 게시글',
      content: '시드 파일로 생성된 게시글입니다.',
      image: null,
      userId: user.id,
    },
  });

  // 4. 상품 생성
  const product = await prisma.product.create({
    data: {
      name: '게이밍 키보드',
      description: '기계식 키보드로 반응 속도가 빠릅니다.',
      price: 89000,
      tags: ['전자기기', '키보드'],
      images: ['https://example.com/keyboard.jpg'],
      userId: user.id,
    },
  });

  // 5. 댓글 생성 (게시글 + 상품)
  await prisma.comment.createMany({
    data: [
      {
        content: '좋은 글이네요!',
        articleId: article.id,
        userId: user.id,
      },
      {
        content: '이 제품 정말 좋아 보여요.',
        productId: product.id,
        userId: user.id,
      },
    ],
  });

  // 6. 좋아요 생성 (게시글 + 상품)
  await prisma.articleLike.create({
    data: {
      articleId: article.id,
      userId: user.id,
    },
  });

  await prisma.productLike.create({
    data: {
      productId: product.id,
      userId: user.id,
    },
  });

  console.log('✅ 시드 데이터 삽입 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 삽입 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

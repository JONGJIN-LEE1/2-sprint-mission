import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.ts';
import BadRequestError from '../lib/errors/BadRequestError.js';
import {
  UpdateUserBodyStruct,
  ChangePasswordBodyStruct,
  GetUserProductsParamsStruct,
} from '../structs/usersStruct.ts';

// 자신의 정보 조회
export async function getMyProfile(req, res) {
  const userId = req.user.id;

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      // password는 제외
    },
  });

  return res.send(user);
}

// 자신의 정보 수정
export async function updateMyProfile(req, res) {
  const userId = req.user.id;
  const { nickname, image } = create(req.body, UpdateUserBodyStruct);

  const updatedUser = await prismaClient.user.update({
    where: { id: userId },
    data: { nickname, image },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.send(updatedUser);
}

// 비밀번호 변경
export async function changePassword(req, res) {
  const userId = req.user.id;
  const { currentPassword, newPassword } = create(req.body, ChangePasswordBodyStruct);

  // 현재 비밀번호 확인
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');
  }

  // 새 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 비밀번호 업데이트
  await prismaClient.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return res.send({ message: '비밀번호가 성공적으로 변경되었습니다.' });
}

// 자신이 등록한 상품 목록 조회
export async function getMyProducts(req, res) {
  const userId = req.user.id;
  const { page, pageSize, orderBy, keyword } = create(req.query, GetUserProductsParamsStruct);

  const where = {
    userId,
    name: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { price: 'asc' },
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

  return res.send({
    list: products,
    totalCount,
  });
}

// 좋아요한 상품 목록 조회
export async function getMyLikedProducts(req, res) {
  const userId = req.user.id;
  const { page, pageSize, orderBy } = create(req.query, GetUserProductsParamsStruct);

  const where = {
    likes: {
      some: {
        userId,
      },
    },
  };

  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { price: 'asc' },
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

  // 각 상품에 likeCount 추가
  const productsWithLikeCount = products.map((product) => ({
    ...product,
    likeCount: product._count.likes,
    _count: undefined,
  }));

  return res.send({
    list: productsWithLikeCount,
    totalCount,
  });
}

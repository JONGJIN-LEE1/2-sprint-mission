import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { assert } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import { SignupStruct, LoginStruct, RefreshTokenStruct } from '../structs/authStructs.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export const signup = async (req, res, next) => {
  try {
    // 요청 데이터 검증
    assert(req.body, SignupStruct);

    const { email, nickname, password } = req.body;

    // 이메일 중복 확인
    const existingUser = await prismaClient.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new BadRequestError('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 사용자 생성
    const user = await prismaClient.user.create({
      data: { email, nickname, password: hashedPassword },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // 요청 데이터 검증
    assert(req.body, LoginStruct);

    const { email, password } = req.body;

    // 사용자 조회
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // Access Token 생성 (짧은 만료 시간)
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '15m', // 15분
    });

    // Refresh Token 생성 (긴 만료 시간)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30일

    // Refresh Token DB에 저장
    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, nickname: user.nickname, image: user.image },
    });
  } catch (error) {
    next(error);
  }
};

// Token 갱신 함수 추가
export const refreshToken = async (req, res, next) => {
  try {
    assert(req.body, RefreshTokenStruct);

    const { refreshToken } = req.body;

    // Refresh Token 확인
    const storedToken = await prismaClient.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new BadRequestError('유효하지 않은 Refresh Token입니다.');
    }

    // 새로운 Access Token 생성
    const accessToken = jwt.sign(
      { id: storedToken.user.id, email: storedToken.user.email },
      JWT_SECRET,
      { expiresIn: '15m' },
    );

    res.json({
      accessToken,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        nickname: storedToken.user.nickname,
        image: storedToken.user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 로그아웃 함수 추가
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Refresh Token 삭제
      await prismaClient.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.json({ message: '로그아웃되었습니다.' });
  } catch (error) {
    next(error);
  }
};

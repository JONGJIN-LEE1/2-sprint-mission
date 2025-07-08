import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userRepository } from '../repositories/user.repository';
import { authRepository } from '../repositories/auth.repository';
import BadRequestError from '../lib/errors/BadRequestError';
import {
  SignupDto,
  LoginDto,
  RefreshTokenDto,
  UserResponseDto,
  AuthResponseDto,
  TokenPayload,
} from '../dtos/auth.dto';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly SALT_ROUNDS = 10;
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m';
  private readonly REFRESH_TOKEN_EXPIRES_DAYS = 30;

  async signup(dto: SignupDto): Promise<UserResponseDto> {
    const { email, nickname, password } = dto;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('이미 사용 중인 이메일입니다.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      email,
      nickname,
      password: hashedPassword,
    });

    return this.toUserResponseDto(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = dto;

    // Find user with password
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: this.toUserResponseDto(user),
    };
  }

  async refreshAccessToken(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = dto;

    // Find and validate refresh token
    const storedToken = await authRepository.findRefreshToken(refreshToken);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new BadRequestError('유효하지 않은 Refresh Token입니다.');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken({
      id: storedToken.user.id,
      email: storedToken.user.email,
    });

    return {
      accessToken,
      user: this.toUserResponseDto(storedToken.user),
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await authRepository.deleteRefreshToken(refreshToken);
    }
  }

  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_DAYS);

    await authRepository.createRefreshToken({
      token,
      user: {
        connect: { id: userId },
      },
      expiresAt,
    });

    return token;
  }

  private toUserResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();

import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  UserProductsQueryDto,
  UserProfileDto,
  UserProductsResponseDto,
  PasswordChangeResponseDto,
  ProductWithLikeCountDto,
} from '../dtos/user.dto.js';

export class UserService {
  private readonly SALT_ROUNDS = 10;

  async getMyProfile(userId: number): Promise<UserProfileDto> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new BadRequestError('사용자를 찾을 수 없습니다.');
    }

    return this.toUserProfileDto(user);
  }

  async updateMyProfile(userId: number, dto: UpdateProfileDto): Promise<UserProfileDto> {
    const updatedUser = await userRepository.update(userId, {
      nickname: dto.nickname,
      image: dto.image,
    });

    return this.toUserProfileDto(updatedUser);
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<PasswordChangeResponseDto> {
    const { currentPassword, newPassword } = dto;

    // Get user with password
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new BadRequestError('사용자를 찾을 수 없습니다.');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Update password
    await userRepository.updatePassword(userId, hashedPassword);

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  async getMyProducts(userId: number, dto: UserProductsQueryDto): Promise<UserProductsResponseDto> {
    const { page, pageSize, orderBy, keyword } = dto;

    const skip = (page - 1) * pageSize;
    const orderByClause =
      orderBy === 'recent' ? { createdAt: 'desc' as const } : { price: 'asc' as const };

    const [products, totalCount] = await Promise.all([
      userRepository.findUserProducts({
        userId,
        skip,
        take: pageSize,
        orderBy: orderByClause,
        keyword,
      }),
      userRepository.countUserProducts(userId, keyword),
    ]);

    return {
      list: products.map((product) => this.toProductDto(product)),
      totalCount,
    };
  }

  async getMyLikedProducts(
    userId: number,
    dto: UserProductsQueryDto,
  ): Promise<UserProductsResponseDto> {
    const { page, pageSize, orderBy } = dto;

    const skip = (page - 1) * pageSize;
    const orderByClause =
      orderBy === 'recent' ? { createdAt: 'desc' as const } : { price: 'asc' as const };

    const [products, totalCount] = await Promise.all([
      userRepository.findLikedProducts({
        userId,
        skip,
        take: pageSize,
        orderBy: orderByClause,
      }),
      userRepository.countLikedProducts(userId),
    ]);

    return {
      list: products.map((product) => this.toProductWithLikeCountDto(product)),
      totalCount,
    };
  }

  private toUserProfileDto(user: any): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private toProductDto(product: any): ProductWithLikeCountDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images,
      user: {
        id: product.user.id,
        nickname: product.user.nickname,
        image: product.user.image,
      },
      userId: product.userId,
      likeCount: 0, // My products don't need like count
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private toProductWithLikeCountDto(product: any): ProductWithLikeCountDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images,
      user: {
        id: product.user.id,
        nickname: product.user.nickname,
        image: product.user.image,
      },
      userId: product.userId,
      likeCount: product._count?.likes || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

export const userService = new UserService();

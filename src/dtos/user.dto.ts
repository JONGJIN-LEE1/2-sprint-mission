// DTOs for User
export interface UpdateProfileDto {
  nickname: string;
  image: string | null;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserProductsQueryDto {
  page: number;
  pageSize: number;
  orderBy?: string;
  keyword?: string;
}

export interface UserProfileDto {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithLikeCountDto {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  user: {
    id: number;
    nickname: string;
    image: string | null;
  };
  userId: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProductsResponseDto {
  list: ProductWithLikeCountDto[];
  totalCount: number;
}

export interface PasswordChangeResponseDto {
  message: string;
}

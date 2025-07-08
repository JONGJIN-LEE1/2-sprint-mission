// DTOs for Like
export interface LikeToggleResponseDto {
  isLiked: boolean;
  likeCount?: number;
}

export interface LikeStatusDto {
  userId: number;
  targetId: number;
  targetType: 'product' | 'article';
}

export interface CreateLikeDto {
  userId: number;
  targetId: number;
}

export interface LikeInfoDto {
  id: number;
  userId: number;
  targetId: number;
  createdAt: Date;
}

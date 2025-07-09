// DTOs for Comment
export interface CreateCommentDto {
  content: string;
}

// 서비스 레이어에서 사용할 확장된 DTO
export interface CreateCommentServiceDto extends CreateCommentDto {
  userId: number;
  articleId?: number;
  productId?: number;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface CommentUserDto {
  id: number;
  nickname: string;
  image: string | null;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  user: CommentUserDto;
  userId: number | null;
  articleId: number | null;
  productId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentListQueryDto {
  cursor: number;
  limit: number;
}

export interface CommentListResponseDto {
  list: CommentResponseDto[];
  nextCursor: number | null;
}

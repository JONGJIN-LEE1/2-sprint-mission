// DTOs for Comment
export interface CreateCommentDto {
  content: string;
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

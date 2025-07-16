// DTOs for Article
export interface CreateArticleDto {
  title: string;
  content: string;
  image: string | null;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  image?: string | null;
}

export interface ArticleListQueryDto {
  page: number;
  pageSize: number;
  orderBy?: string;
  keyword?: string;
}

export interface ArticleUserDto {
  id: number;
  nickname: string;
  image: string | null;
}

export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  image: string | null;
  user: ArticleUserDto;
  userId: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleListResponseDto {
  list: ArticleResponseDto[];
  totalCount: number;
}

// DTOs for Comment
export interface CreateCommentDto {
  content: string;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  user: ArticleUserDto;
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

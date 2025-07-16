import { articleRepository } from '../repositories/article.repository';
import { commentRepository } from '../repositories/comment.repository';
import NotFoundError from '../lib/errors/NotFoundError';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleListQueryDto,
  ArticleResponseDto,
  ArticleListResponseDto,
  CreateCommentDto,
  CommentResponseDto,
  CommentListQueryDto,
  CommentListResponseDto,
} from '../dtos/article.dto';

export class ArticleService {
  async createArticle(userId: number, dto: CreateArticleDto): Promise<ArticleResponseDto> {
    const article = await articleRepository.create({
      ...dto,
      user: {
        connect: { id: userId },
      },
    });

    return this.toArticleResponseDto(article, false);
  }

  async getArticle(id: number, userId?: number): Promise<ArticleResponseDto> {
    const article = await articleRepository.findById(id);

    if (!article) {
      throw new NotFoundError('article', id);
    }

    // Check if user liked the article
    let isLiked = false;
    if (userId) {
      isLiked = await articleRepository.checkUserLiked(userId, id);
    }

    return this.toArticleResponseDto(article, isLiked);
  }

  async updateArticle(id: number, dto: UpdateArticleDto): Promise<ArticleResponseDto> {
    const article = await articleRepository.update(id, dto);
    return this.toArticleResponseDto(article, false);
  }

  async deleteArticle(id: number): Promise<void> {
    await articleRepository.delete(id);
  }

  async getArticleList(dto: ArticleListQueryDto): Promise<ArticleListResponseDto> {
    const { page, pageSize, orderBy, keyword } = dto;

    const where = keyword ? { title: { contains: keyword } } : undefined;

    const orderByClause =
      orderBy === 'recent' ? { createdAt: 'desc' as const } : { id: 'asc' as const };

    const [articles, totalCount] = await Promise.all([
      articleRepository.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: orderByClause,
      }),
      articleRepository.count(where),
    ]);

    return {
      list: articles.map((article) => this.toArticleResponseDto(article, false)),
      totalCount,
    };
  }

  async createComment(
    articleId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    // Check if article exists
    const article = await articleRepository.findByIdSimple(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const comment = await commentRepository.create({
      content: dto.content,
      article: {
        connect: { id: articleId },
      },
      user: {
        connect: { id: userId },
      },
    });

    return this.toCommentResponseDto(comment);
  }

  async getCommentList(
    articleId: number,
    dto: CommentListQueryDto,
  ): Promise<CommentListResponseDto> {
    const { cursor, limit } = dto;

    // Check if article exists
    const article = await articleRepository.findByIdSimple(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const commentsWithCursor = await commentRepository.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      where: { articleId },
      orderBy: { createdAt: 'desc' },
    });

    const comments = commentsWithCursor.slice(0, limit);
    const lastComment = commentsWithCursor[commentsWithCursor.length - 1];
    const nextCursor = commentsWithCursor.length > limit ? lastComment?.id : null;

    return {
      list: comments.map((comment: any) => this.toCommentResponseDto(comment)),
      nextCursor,
    };
  }

  private toArticleResponseDto(article: any, isLiked: boolean): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      image: article.image,
      user: {
        id: article.user.id,
        nickname: article.user.nickname,
        image: article.user.image,
      },
      userId: article.userId,
      likeCount: article._count?.likes || 0,
      isLiked,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  private toCommentResponseDto(comment: any): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.user.id,
        nickname: comment.user.nickname,
        image: comment.user.image,
      },
      userId: comment.userId,
      articleId: comment.articleId,
      productId: comment.productId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}

export const articleService = new ArticleService();

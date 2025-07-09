import { commentRepository } from '../repositories/comment.repository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from '../dtos/comment.dto.js';

// 서비스에서 사용할 추가 파라미터 인터페이스
interface CreateCommentParams {
  content: string;
  userId: number;
  articleId?: number;
  productId?: number;
}

export class CommentService {
  async createComment(params: CreateCommentParams): Promise<CommentResponseDto> {
    // Validate content exists
    if (!params.content) {
      throw new BadRequestError('댓글 내용을 입력해주세요.');
    }

    // Validate that either articleId or productId is provided
    if (!params.articleId && !params.productId) {
      throw new BadRequestError('articleId 또는 productId가 필요합니다.');
    }

    // Validate that both articleId and productId are not provided at the same time
    if (params.articleId && params.productId) {
      throw new BadRequestError('articleId와 productId는 동시에 제공할 수 없습니다.');
    }

    // Check if article or product exists
    if (params.articleId) {
      const articleExists = await commentRepository.checkArticleExists(params.articleId);
      if (!articleExists) {
        throw new NotFoundError('article', params.articleId);
      }
    }

    if (params.productId) {
      const productExists = await commentRepository.checkProductExists(params.productId);
      if (!productExists) {
        throw new NotFoundError('product', params.productId);
      }
    }

    const newComment = await commentRepository.create({
      content: params.content,
      user: { connect: { id: params.userId } },
      ...(params.articleId && { article: { connect: { id: params.articleId } } }),
      ...(params.productId && { product: { connect: { id: params.productId } } }),
    });

    return this.toCommentResponseDto(newComment);
  }

  async updateComment(id: number, dto: UpdateCommentDto): Promise<CommentResponseDto> {
    // Validate content exists
    if (!dto.content) {
      throw new BadRequestError('댓글 내용을 입력해주세요.');
    }

    // Check if comment exists
    const existingComment = await commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    const updatedComment = await commentRepository.update(id, {
      content: dto.content,
    });

    return this.toCommentResponseDto(updatedComment);
  }

  async deleteComment(id: number): Promise<void> {
    // Check if comment exists
    const existingComment = await commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    await commentRepository.delete(id);
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

export const commentService = new CommentService();

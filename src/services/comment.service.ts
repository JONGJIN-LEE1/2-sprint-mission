import { commentRepository } from '../repositories/comment.repository';
import NotFoundError from '../lib/errors/NotFoundError';
import BadRequestError from '../lib/errors/BadRequestError';
import { UpdateCommentDto, CommentResponseDto } from '../dtos/comment.dto';

export class CommentService {
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

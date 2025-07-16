import { productRepository } from '../repositories/product.repository';
import { commentRepository } from '../repositories/comment.repository';
import NotFoundError from '../lib/errors/NotFoundError';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductListQueryDto,
  ProductResponseDto,
  ProductListResponseDto,
} from '../dtos/product.dto';
import {
  CreateCommentDto,
  CommentResponseDto,
  CommentListQueryDto,
  CommentListResponseDto,
} from '../dtos/comment.dto';

export class ProductService {
  async createProduct(userId: number, dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await productRepository.create({
      ...dto,
      user: {
        connect: { id: userId },
      },
    });

    return this.toProductResponseDto(product, false);
  }

  async getProduct(id: number, userId?: number): Promise<ProductResponseDto> {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError('product', id);
    }

    // Check if user liked the product
    let isLiked = false;
    if (userId) {
      isLiked = await productRepository.checkUserLiked(userId, id);
    }

    return this.toProductResponseDto(product, isLiked);
  }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    // Check if product exists
    const existingProduct = await productRepository.findByIdSimple(id);
    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    const product = await productRepository.update(id, dto);
    return this.toProductResponseDto(product, false);
  }

  async deleteProduct(id: number): Promise<void> {
    // Check if product exists
    const existingProduct = await productRepository.findByIdSimple(id);
    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    await productRepository.delete(id);
  }

  async getProductList(dto: ProductListQueryDto): Promise<ProductListResponseDto> {
    const { page, pageSize, orderBy, keyword } = dto;

    const where = keyword
      ? {
          OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
        }
      : undefined;

    const orderByClause = orderBy === 'recent' ? { id: 'desc' as const } : { id: 'asc' as const };

    const [products, totalCount] = await Promise.all([
      productRepository.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: orderByClause,
      }),
      productRepository.count(where),
    ]);

    return {
      list: products.map((product) => this.toProductResponseDto(product, false)),
      totalCount,
    };
  }

  async createComment(
    productId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    // Check if product exists
    const product = await productRepository.findByIdSimple(productId);
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    const comment = await commentRepository.create({
      content: dto.content,
      product: {
        connect: { id: productId },
      },
      user: {
        connect: { id: userId },
      },
    });

    return this.toCommentResponseDto(comment);
  }

  async getCommentList(
    productId: number,
    dto: CommentListQueryDto,
  ): Promise<CommentListResponseDto> {
    const { cursor, limit } = dto;

    // Check if product exists
    const product = await productRepository.findByIdSimple(productId);
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    const commentsWithCursor = await commentRepository.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    const comments = commentsWithCursor.slice(0, limit);
    const lastComment = commentsWithCursor[commentsWithCursor.length - 1];
    const nextCursor = commentsWithCursor.length > limit ? lastComment?.id : null;

    return {
      list: comments.map((comment) => this.toCommentResponseDto(comment)),
      nextCursor,
    };
  }

  private toProductResponseDto(product: any, isLiked: boolean): ProductResponseDto {
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
      isLiked,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
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

export const productService = new ProductService();

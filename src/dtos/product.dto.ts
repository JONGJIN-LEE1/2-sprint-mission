// DTOs for Product
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}

export interface ProductListQueryDto {
  page: number;
  pageSize: number;
  orderBy?: string;
  keyword?: string;
}

export interface ProductUserDto {
  id: number;
  nickname: string;
  image: string | null;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  user: ProductUserDto;
  userId: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListResponseDto {
  list: ProductResponseDto[];
  totalCount: number;
}

// DTOs for Image
export interface UploadedFileDto {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface ImageUploadResponseDto {
  url: string;
}

export interface ImageUploadOptions {
  allowedMimeTypes: string[];
  maxFileSize: number;
  uploadPath: string;
}

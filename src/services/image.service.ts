import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { UploadedFileDto, ImageUploadResponseDto } from '../dtos/image.dto';

export class ImageService {
  private readonly ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
  private readonly FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
  private readonly UPLOAD_PATH = PUBLIC_PATH;

  // Multer configuration
  private createMulterStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.UPLOAD_PATH);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    });
  }

  private createFileFilter() {
    return (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        const err = new BadRequestError('Only png, jpeg, and jpg files are allowed');
        return cb(err as any);
      }
      cb(null, true);
    };
  }

  // Create multer upload instance
  createUploadMiddleware() {
    return multer({
      storage: this.createMulterStorage(),
      limits: {
        fileSize: this.FILE_SIZE_LIMIT,
      },
      fileFilter: this.createFileFilter(),
    });
  }

  // Process uploaded image and return URL
  async processUploadedImage(
    file: Express.Multer.File | undefined,
    host: string | undefined,
  ): Promise<ImageUploadResponseDto> {
    if (!file) {
      throw new BadRequestError('No file uploaded');
    }

    if (!host) {
      throw new BadRequestError('Host header is missing');
    }

    // Validate file after upload (double-check)
    this.validateFile(file);

    // Generate URL
    const url = this.generateImageUrl(host, file.filename);

    return { url };
  }

  private validateFile(file: Express.Multer.File): void {
    // Additional validation if needed
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestError('Invalid file type');
    }

    if (file.size > this.FILE_SIZE_LIMIT) {
      throw new BadRequestError('File size exceeds limit');
    }
  }

  private generateImageUrl(host: string, filename: string): string {
    // Use path.posix for URL paths (always forward slashes)
    const urlPath = path.posix.join(STATIC_PATH, filename);
    return `http://${host}${urlPath}`;
  }

  // Get allowed file extensions for display
  getAllowedExtensions(): string[] {
    return this.ALLOWED_MIME_TYPES.map((type) => {
      switch (type) {
        case 'image/png':
          return '.png';
        case 'image/jpeg':
        case 'image/jpg':
          return '.jpg, .jpeg';
        default:
          return '';
      }
    }).filter((ext) => ext);
  }

  // Get file size limit in MB
  getFileSizeLimitMB(): number {
    return this.FILE_SIZE_LIMIT / (1024 * 1024);
  }
}

export const imageService = new ImageService();

import { Request, Response } from 'express';
import { imageService } from '../services/image.service';

// Multer Request 타입 확장
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Create multer upload middleware
export const upload = imageService.createUploadMiddleware();

export async function uploadImage(req: MulterRequest, res: Response) {
  const host = req.get('host');

  const result = await imageService.processUploadedImage(req.file, host);

  return res.json(result);
}

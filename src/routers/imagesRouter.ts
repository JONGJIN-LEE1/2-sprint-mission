import express from 'express';
import { withAsync } from '../lib/withAsync.ts';
import { upload, uploadImage } from '../controllers/imagesController.ts';

const imagesRouter = express.Router();

imagesRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

export default imagesRouter;

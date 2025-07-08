import { Response } from 'express';
import { create } from 'superstruct';
import { userService } from '../services/user.service.js';
import {
  UpdateUserBodyStruct,
  ChangePasswordBodyStruct,
  GetUserProductsParamsStruct,
} from '../structs/usersStruct.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// 자신의 정보 조회
export async function getMyProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const profile = await userService.getMyProfile(userId);

  return res.json(profile);
}

// 자신의 정보 수정
export async function updateMyProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;
  const data = create(req.body, UpdateUserBodyStruct);

  const updatedProfile = await userService.updateMyProfile(userId, data);

  return res.json(updatedProfile);
}

// 비밀번호 변경
export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;
  const data = create(req.body, ChangePasswordBodyStruct);

  const result = await userService.changePassword(userId, data);

  return res.json(result);
}

// 자신이 등록한 상품 목록 조회
export async function getMyProducts(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;
  const queryParams = create(req.query, GetUserProductsParamsStruct);

  const result = await userService.getMyProducts(userId, queryParams);

  return res.json(result);
}

// 좋아요한 상품 목록 조회
export async function getMyLikedProducts(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;
  const queryParams = create(req.query, GetUserProductsParamsStruct);

  const result = await userService.getMyLikedProducts(userId, queryParams);

  return res.json(result);
}

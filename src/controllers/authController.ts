import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { authService } from '../services/auth.service';
import { SignupStruct, LoginStruct, RefreshTokenStruct } from '../structs/authStructs';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request data
    assert(req.body, SignupStruct);

    const user = await authService.signup(req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request data
    assert(req.body, LoginStruct);

    const authResponse = await authService.login(req.body);

    res.json(authResponse);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request data
    assert(req.body, RefreshTokenStruct);

    const authResponse = await authService.refreshAccessToken(req.body);

    res.json(authResponse);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    res.json({ message: '로그아웃되었습니다.' });
  } catch (error) {
    next(error);
  }
};

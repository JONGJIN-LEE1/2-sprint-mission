// DTOs for Authentication
export interface SignupDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: UserResponseDto;
}

export interface TokenPayload {
  id: number;
  email: string;
}

export interface LogoutDto {
  refreshToken?: string;
}

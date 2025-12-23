export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
}

export interface LoginRequest { username: string; password: string; }
export interface RegisterRequest { username: string; email: string; password: string; fullName?: string; }

export interface JwtResponse { token: string; type: string; refreshToken?: string; id: number; username: string; email: string; expiresAt: string; }

export interface ApiResponse<T> { success: boolean; message: string; data: T; timestamp: string; }


export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  role: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  id: number;
  username: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
  username: string;
  role: string;
}


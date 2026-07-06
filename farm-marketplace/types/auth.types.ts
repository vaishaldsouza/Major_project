export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface LoginFormData {
  email: string;
  password: string;
  role: UserRole | null;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: UserRole;
      name: string;
    };
    token: string;
  };
}
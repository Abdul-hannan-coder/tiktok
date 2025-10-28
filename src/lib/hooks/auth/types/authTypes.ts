/**
 * Authentication types
 */

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AuthError {
  message: string;
  code?: string | number;
  details?: unknown;
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignupPayload {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: AsyncStatus;
  error: AuthError | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: 'REQUEST_SIGNUP' }
  | { type: 'SUCCESS_SIGNUP'; payload: AuthResponse }
  | { type: 'FAIL_SIGNUP'; payload: AuthError }
  | { type: 'REQUEST_LOGIN' }
  | { type: 'SUCCESS_LOGIN'; payload: AuthResponse }
  | { type: 'FAIL_LOGIN'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } }
  | { type: 'RESET' };

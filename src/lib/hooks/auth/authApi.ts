/**
 * Authentication API client
 */

import type {
  AuthResponse,
  SignupPayload,
  LoginPayload,
  AuthError,
} from './types/authTypes';

export interface AuthApiConfig {
  baseUrl: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const ct = res.headers.get('content-type') || '';
  const parse = async () =>
    ct.includes('application/json') ? res.json() : res.text();

  if (!res.ok) {
    const body = await parse() as { message?: string; detail?: string; [key: string]: unknown };
    throw {
      message: body?.message ?? body?.detail ?? res.statusText,
      code: res.status,
      details: body,
    } as AuthError;
  }

  return (await parse()) as T;
}

export function createAuthApi(config: AuthApiConfig) {
  const { baseUrl } = config;

  return {
    /**
     * Sign up a new user
     */
    async signup(payload: SignupPayload): Promise<AuthResponse> {
      return request<AuthResponse>(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    },

    /**
     * Log in an existing user
     */
    async login(payload: LoginPayload): Promise<AuthResponse> {
      return request<AuthResponse>(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    },
  };
}

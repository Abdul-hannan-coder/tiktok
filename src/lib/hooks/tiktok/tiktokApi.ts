/**
 * TikTok API client
 */

import type {
  TikTokTokenData,
  TikTokOAuthData,
  TikTokError,
} from './types/tiktokTypes';

export interface TikTokApiConfig {
  baseUrl: string;
  getToken: () => string | undefined;
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
    } as TikTokError;
  }

  return (await parse()) as T;
}

export function createTikTokApi(config: TikTokApiConfig) {
  const { baseUrl, getToken } = config;

  return {
    /**
     * Check if user has a connected TikTok account
     */
    async checkToken(): Promise<TikTokTokenData> {
      const token = getToken();
      if (!token) {
        throw {
          message: 'No authentication token available',
          code: 401,
        } as TikTokError;
      }

      const response = await request<{
        success: boolean;
        message: string;
        data: TikTokTokenData;
      }>(`${baseUrl}/tiktok/get-token`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    /**
     * Create TikTok OAuth URL for authentication
     */
    async createOAuth(): Promise<TikTokOAuthData> {
      const token = getToken();
      if (!token) {
        throw {
          message: 'No authentication token available',
          code: 401,
        } as TikTokError;
      }

      const response = await request<{
        success: boolean;
        message: string;
        data: TikTokOAuthData;
      }>(`${baseUrl}/tiktok/create-token`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: '',
      });

      return response.data;
    },
  };
}

/**
 * TikTok Profile API client
 */

import type { TikTokProfile, TikTokProfileError } from './types/tiktokProfileTypes';

export interface TikTokProfileApiConfig {
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
    } as TikTokProfileError;
  }

  return (await parse()) as T;
}

export function createTikTokProfileApi(config: TikTokProfileApiConfig) {
  const { baseUrl, getToken } = config;

  return {
    /**
     * Get TikTok user profile
     */
    async getProfile(refresh = false): Promise<{
      profile: TikTokProfile;
      lastUpdated?: string;
      source?: string;
    }> {
      const token = getToken();
      if (!token) {
        throw {
          message: 'No authentication token available',
          code: 401,
        } as TikTokProfileError;
      }

      const response = await request<{
        success: boolean;
        message: string;
        data: {
          success: boolean;
          message: string;
          data: TikTokProfile;
          source?: string;
          last_updated?: string;
        };
      }>(`${baseUrl}/tiktok/user-profile/?refresh=${refresh}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        profile: response.data.data,
        lastUpdated: response.data.last_updated,
        source: response.data.source,
      };
    },
  };
}

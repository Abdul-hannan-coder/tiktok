/**
 * TikTok Post API Client
 * Handles photo posts, draft video URL uploads, and draft video file uploads
 */

import type {
  PhotoPostRequest,
  PhotoPostResponse,
  DraftVideoUrlRequest,
  DraftVideoResponse,
  TikTokPostError,
} from './types/tiktokPostTypes';

export interface TikTokPostApiConfig {
  baseUrl: string;
  getToken: () => string | undefined;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const ct = res.headers.get('content-type') || '';
  const parse = async () =>
    ct.includes('application/json') ? res.json() : res.text();

  if (!res.ok) {
    const body = (await parse()) as {
      message?: string;
      detail?: string;
      [key: string]: unknown;
    };
    throw {
      message: body?.message ?? body?.detail ?? res.statusText,
      code: res.status,
      details: body,
    } as TikTokPostError;
  }

  return (await parse()) as T;
}

export function createTikTokPostApi(config: TikTokPostApiConfig) {
  const { baseUrl, getToken } = config;

  return {
    /**
     * Post photos/images directly to TikTok
     */
    async postPhotos(payload: PhotoPostRequest): Promise<PhotoPostResponse> {
      const token = getToken();
      if (!token) {
        throw {
          message: 'No authentication token available',
          code: 401,
        } as TikTokPostError;
      }

      return await request<PhotoPostResponse>(
        `${baseUrl}/tiktok/photo/direct/post`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    },

    /**
     * Upload draft video from URL to TikTok inbox
     */
    async uploadDraftVideoUrl(
      payload: DraftVideoUrlRequest
    ): Promise<DraftVideoResponse> {
      const token = getToken();
      if (!token) {
        throw {
          message: 'No authentication token available',
          code: 401,
        } as TikTokPostError;
      }

      const body = new URLSearchParams();
      body.set('video_url', payload.video_url);
      body.set('title', payload.title);

      return await request<DraftVideoResponse>(
        `${baseUrl}/tiktok/draft-post/upload-url`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
          body: body.toString(),
        }
      );
    },

    /**
     * Upload draft video file to TikTok inbox
     */
    async uploadDraftVideoFile(
      file: File,
      title: string,
      onProgress?: (percent: number) => void
    ): Promise<DraftVideoResponse> {
      const token = getToken();
      if (!token) {
        throw {
          message: 'No authentication token available',
          code: 401,
        } as TikTokPostError;
      }

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('title', title);

      // Note: Native fetch does not support upload progress
      // onProgress is a placeholder for future XHR implementation if needed
      if (onProgress) {
        onProgress(0);
      }

      const result = await request<DraftVideoResponse>(
        `${baseUrl}/tiktok/draft-post/upload`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
            // Content-Type is automatically set by FormData
          },
          body: formData,
        }
      );

      if (onProgress) {
        onProgress(100);
      }

      return result;
    },
  };
}

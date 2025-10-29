/**
 * TikTok Post Hook
 * React hook for posting photos and uploading draft videos to TikTok
 */

'use client';

import { useReducer, useMemo, useCallback } from 'react';
import { createTikTokPostApi } from './tiktokPostApi';
import {
  initialTikTokPostState,
  tiktokPostReducer,
} from './Reducers/tiktokPostReducer';
import type {
  PhotoPostRequest,
  DraftVideoUrlRequest,
  TikTokPostError,
} from './types/tiktokPostTypes';

export interface TikTokPostOptions {
  baseUrl?: string;
  getToken?: () => string | undefined;
}

/**
 * Custom hook for TikTok posting operations
 * Provides methods to post photos and upload draft videos
 */
export function useTikTokPost(options?: TikTokPostOptions) {
  const baseUrl =
    options?.baseUrl ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'https://backend.postsiva.com';

  const getToken =
    options?.getToken ??
    (() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('token') ?? undefined;
      }
      return undefined;
    });

  const [state, dispatch] = useReducer(
    tiktokPostReducer,
    initialTikTokPostState
  );

  const api = useMemo(
    () => createTikTokPostApi({ baseUrl, getToken }),
    [baseUrl, getToken]
  );

  /**
   * Post photos/images directly to TikTok
   */
  const postPhotos = useCallback(
    async (payload: PhotoPostRequest) => {
      dispatch({ type: 'REQUEST_PHOTO_POST', payload: undefined });
      try {
        const result = await api.postPhotos(payload);
        dispatch({ type: 'SUCCESS_PHOTO_POST', payload: result });
        return result;
      } catch (error) {
        dispatch({
          type: 'FAIL_PHOTO_POST',
          payload: error as TikTokPostError,
        });
        throw error;
      }
    },
    [api]
  );

  /**
   * Upload draft video from URL to TikTok inbox
   */
  const uploadDraftVideoUrl = useCallback(
    async (payload: DraftVideoUrlRequest) => {
      dispatch({ type: 'REQUEST_DRAFT_VIDEO_URL', payload: undefined });
      try {
        const result = await api.uploadDraftVideoUrl(payload);
        dispatch({ type: 'SUCCESS_DRAFT_VIDEO_URL', payload: result });
        return result;
      } catch (error) {
        dispatch({
          type: 'FAIL_DRAFT_VIDEO_URL',
          payload: error as TikTokPostError,
        });
        throw error;
      }
    },
    [api]
  );

  /**
   * Upload draft video file to TikTok inbox
   */
  const uploadDraftVideoFile = useCallback(
    async (
      file: File,
      title: string,
      onProgress?: (percent: number) => void
    ) => {
      dispatch({ type: 'REQUEST_DRAFT_VIDEO_FILE', payload: undefined });
      try {
        const progressHandler = (percent: number) => {
          dispatch({ type: 'PROGRESS_DRAFT_VIDEO_FILE', payload: percent });
          if (onProgress) {
            onProgress(percent);
          }
        };

        const result = await api.uploadDraftVideoFile(
          file,
          title,
          progressHandler
        );
        dispatch({ type: 'SUCCESS_DRAFT_VIDEO_FILE', payload: result });
        return result;
      } catch (error) {
        dispatch({
          type: 'FAIL_DRAFT_VIDEO_FILE',
          payload: error as TikTokPostError,
        });
        throw error;
      }
    },
    [api]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Memoize actions object to prevent infinite loops
  const actions = useMemo(
    () => ({
      postPhotos,
      uploadDraftVideoUrl,
      uploadDraftVideoFile,
      reset,
    }),
    [postPhotos, uploadDraftVideoUrl, uploadDraftVideoFile, reset]
  );

  return { state, actions };
}

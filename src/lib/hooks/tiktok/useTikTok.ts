/**
 * TikTok integration hook
 */

import { useReducer, useCallback, useMemo } from 'react';
import { tiktokReducer, initialTikTokState } from './Reducers/tiktokReducer';
import { createTikTokApi } from './tiktokApi';
import appConfig from '../../config/appConfig';

export interface TikTokOptions {
  baseUrl?: string;
  getToken: () => string | undefined;
}

export function useTikTok(options: TikTokOptions) {
  const {
    baseUrl = appConfig.API_BASE_URL,
    getToken,
  } = options;

  const [state, dispatch] = useReducer(tiktokReducer, initialTikTokState);

  const api = useMemo(
    () => createTikTokApi({ baseUrl, getToken }),
    [baseUrl, getToken]
  );

  /**
   * Check if user has a connected TikTok account
   */
  const checkToken = useCallback(async () => {
    dispatch({ type: 'REQUEST_CHECK_TOKEN' });
    try {
      const tokenData = await api.checkToken();
      dispatch({ type: 'SUCCESS_CHECK_TOKEN', payload: tokenData });
      return tokenData;
    } catch (err) {
      const error = err as { message?: string; code?: string | number; details?: unknown };
      dispatch({
        type: 'FAIL_CHECK_TOKEN',
        payload: {
          message: error.message || 'Failed to check TikTok connection',
          code: error.code,
          details: error.details,
        },
      });
      throw error;
    }
  }, [api]);

  /**
   * Create OAuth URL and initiate TikTok authentication
   */
  const createOAuth = useCallback(async () => {
    dispatch({ type: 'REQUEST_CREATE_OAUTH' });
    try {
      const oauthData = await api.createOAuth();
      dispatch({ type: 'SUCCESS_CREATE_OAUTH', payload: oauthData });
      return oauthData;
    } catch (err) {
      const error = err as { message?: string; code?: string | number; details?: unknown };
      dispatch({
        type: 'FAIL_CREATE_OAUTH',
        payload: {
          message: error.message || 'Failed to start TikTok OAuth',
          code: error.code,
          details: error.details,
        },
      });
      throw error;
    }
  }, [api]);

  /**
   * Reset TikTok state
   */
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      checkToken,
      createOAuth,
    },
    reset,
  };
}

export default useTikTok;

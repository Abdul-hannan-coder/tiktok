/**
 * TikTok Profile hook
 */

import { useReducer, useCallback, useMemo } from 'react';
import { tiktokProfileReducer, initialTikTokProfileState } from './Reducers/tiktokProfileReducer';
import { createTikTokProfileApi } from './tiktokProfileApi';
import appConfig from '../../config/appConfig';

export interface TikTokProfileOptions {
  baseUrl?: string;
  getToken: () => string | undefined;
}

export function useTikTokProfile(options: TikTokProfileOptions) {
  const {
    baseUrl = appConfig.API_BASE_URL,
    getToken,
  } = options;

  const [state, dispatch] = useReducer(tiktokProfileReducer, initialTikTokProfileState);

  const api = useMemo(
    () => createTikTokProfileApi({ baseUrl, getToken }),
    [baseUrl, getToken]
  );

  /**
   * Load TikTok profile
   */
  const loadProfile = useCallback(async (refresh = false) => {
    dispatch({ type: 'REQUEST_PROFILE' });
    try {
      const { profile, lastUpdated, source } = await api.getProfile(refresh);
      dispatch({
        type: 'SUCCESS_PROFILE',
        payload: { profile, lastUpdated, source },
      });
      return profile;
    } catch (err) {
      const error = err as { message?: string; code?: string | number; details?: unknown };
      dispatch({
        type: 'FAIL_PROFILE',
        payload: {
          message: error.message || 'Failed to load TikTok profile',
          code: error.code,
          details: error.details,
        },
      });
      throw error;
    }
  }, [api]);

  /**
   * Reset profile state
   */
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Memoize actions object to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    loadProfile,
  }), [loadProfile]);

  return {
    state,
    actions,
    reset,
  };
}

export default useTikTokProfile;

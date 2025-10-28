/**
 * TikTok Profile reducer
 */

import type { TikTokProfileState, TikTokProfileAction } from '../types/tiktokProfileTypes';

export const initialTikTokProfileState: TikTokProfileState = {
  status: 'idle',
  error: null,
  profile: null,
  lastUpdated: undefined,
  source: undefined,
};

export function tiktokProfileReducer(
  state: TikTokProfileState,
  action: TikTokProfileAction
): TikTokProfileState {
  switch (action.type) {
    case 'REQUEST_PROFILE':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'SUCCESS_PROFILE':
      return {
        ...state,
        status: 'success',
        profile: action.payload.profile,
        lastUpdated: action.payload.lastUpdated,
        source: action.payload.source,
        error: null,
      };

    case 'FAIL_PROFILE':
      return {
        ...state,
        status: 'error',
        error: action.payload,
        profile: null,
      };

    case 'RESET':
      return initialTikTokProfileState;

    default:
      return state;
  }
}

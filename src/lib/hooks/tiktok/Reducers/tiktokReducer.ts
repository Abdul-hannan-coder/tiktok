/**
 * TikTok reducer
 */

import type { TikTokState, TikTokAction } from '../types/tiktokTypes';

export const initialTikTokState: TikTokState = {
  status: 'idle',
  error: null,
  tokenData: null,
  oauthData: null,
  isConnected: false,
};

export function tiktokReducer(state: TikTokState, action: TikTokAction): TikTokState {
  switch (action.type) {
    case 'REQUEST_CHECK_TOKEN':
    case 'REQUEST_CREATE_OAUTH':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'SUCCESS_CHECK_TOKEN':
      return {
        ...state,
        status: 'success',
        tokenData: action.payload,
        isConnected: !!action.payload.access_token,
        error: null,
      };

    case 'FAIL_CHECK_TOKEN':
      return {
        ...state,
        status: 'error',
        error: action.payload,
        tokenData: null,
        isConnected: false,
      };

    case 'SUCCESS_CREATE_OAUTH':
      return {
        ...state,
        status: 'success',
        oauthData: action.payload,
        error: null,
      };

    case 'FAIL_CREATE_OAUTH':
      return {
        ...state,
        status: 'error',
        error: action.payload,
        oauthData: null,
      };

    case 'RESET':
      return initialTikTokState;

    default:
      return state;
  }
}

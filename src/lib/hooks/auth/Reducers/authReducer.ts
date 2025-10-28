/**
 * Authentication reducer
 */

import type { AuthState, AuthAction } from '../types/authTypes';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'REQUEST_SIGNUP':
    case 'REQUEST_LOGIN':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'SUCCESS_SIGNUP':
    case 'SUCCESS_LOGIN':
      return {
        ...state,
        status: 'success',
        error: null,
        user: action.payload.user,
        token: action.payload.access_token,
        isAuthenticated: true,
      };

    case 'FAIL_SIGNUP':
    case 'FAIL_LOGIN':
      return {
        ...state,
        status: 'error',
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        status: 'success',
      };

    case 'LOGOUT':
      return {
        ...initialAuthState,
        status: 'success',
      };

    case 'RESET':
      return initialAuthState;

    default:
      return state;
  }
}

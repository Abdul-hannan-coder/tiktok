/**
 * Authentication hook
 */

import { useReducer, useCallback, useMemo, useEffect } from 'react';
import { authReducer, initialAuthState } from './Reducers/authReducer';
import { createAuthApi } from './authApi';
import type { SignupPayload, LoginPayload, User } from './types/authTypes';
import appConfig from '../../config/appConfig';

export interface AuthOptions {
  baseUrl?: string;
  autoRestore?: boolean;
}

export function useAuth(options: AuthOptions = {}) {
  const {
    baseUrl = appConfig.API_BASE_URL,
    autoRestore = true,
  } = options;

  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const api = useMemo(
    () => createAuthApi({ baseUrl }),
    [baseUrl]
  );

  /**
   * Save session to localStorage
   */
  const saveSession = useCallback((token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(appConfig.AUTH_TOKEN_KEY, token);
      localStorage.setItem(appConfig.AUTH_USER_KEY, JSON.stringify(user));
    }
  }, []);

  /**
   * Clear session from localStorage
   */
  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(appConfig.AUTH_TOKEN_KEY);
      localStorage.removeItem(appConfig.AUTH_USER_KEY);
    }
  }, []);

  /**
   * Restore session from localStorage
   */
  const restoreSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(appConfig.AUTH_TOKEN_KEY);
      const userStr = localStorage.getItem(appConfig.AUTH_USER_KEY);

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          dispatch({ type: 'RESTORE_SESSION', payload: { token, user } });
        } catch (err) {
          // Invalid stored data, clear it
          clearSession();
        }
      }
    }
  }, [clearSession]);

  /**
   * Auto-restore session on mount
   */
  useEffect(() => {
    if (autoRestore) {
      restoreSession();
    }
  }, [autoRestore, restoreSession]);

  /**
   * Sign up a new user
   */
  const signup = useCallback(
    async (payload: SignupPayload) => {
      dispatch({ type: 'REQUEST_SIGNUP' });
      try {
        const response = await api.signup(payload);
        dispatch({ type: 'SUCCESS_SIGNUP', payload: response });
        saveSession(response.access_token, response.user);
      } catch (err) {
        const error = err as { message?: string; code?: string | number; details?: unknown };
        dispatch({
          type: 'FAIL_SIGNUP',
          payload: {
            message: error.message || 'Signup failed',
            code: error.code,
            details: error.details,
          },
        });
        throw error;
      }
    },
    [api, saveSession]
  );

  /**
   * Log in an existing user
   */
  const login = useCallback(
    async (payload: LoginPayload) => {
      dispatch({ type: 'REQUEST_LOGIN' });
      try {
        const response = await api.login(payload);
        dispatch({ type: 'SUCCESS_LOGIN', payload: response });
        saveSession(response.access_token, response.user);
      } catch (err) {
        const error = err as { message?: string; code?: string | number; details?: unknown };
        dispatch({
          type: 'FAIL_LOGIN',
          payload: {
            message: error.message || 'Login failed',
            code: error.code,
            details: error.details,
          },
        });
        throw error;
      }
    },
    [api, saveSession]
  );

  /**
   * Log out the current user
   */
  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'LOGOUT' });
  }, [clearSession]);

  /**
   * Reset auth state
   */
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  /**
   * Get token for authenticated requests
   */
  const getToken = useCallback(() => {
    return state.token || undefined;
  }, [state.token]);

  return {
    state,
    actions: {
      signup,
      login,
      logout,
      restoreSession,
    },
    getToken,
    reset,
  };
}

export default useAuth;

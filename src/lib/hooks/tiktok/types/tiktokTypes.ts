/**
 * TikTok integration types
 */

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TikTokError {
  message: string;
  code?: string | number;
  details?: unknown;
}

export interface TikTokTokenData {
  user_id: string;
  token_type: string;
  access_token: string;
  scope: string;
  tiktok_user_id: string | null;
  refresh_expires_in: number;
  created_at: string;
  id: number;
  refresh_token: string;
  expires_in: number;
  expires_at: string;
  open_id: string;
  test_user_id: string | null;
  updated_at: string;
}

export interface TikTokOAuthData {
  success: boolean;
  message: string;
  user_id: string;
  auth_url: string;
  instructions: string;
}

export interface TikTokState {
  status: AsyncStatus;
  error: TikTokError | null;
  tokenData: TikTokTokenData | null;
  oauthData: TikTokOAuthData | null;
  isConnected: boolean;
}

export type TikTokAction =
  | { type: 'REQUEST_CHECK_TOKEN' }
  | { type: 'SUCCESS_CHECK_TOKEN'; payload: TikTokTokenData }
  | { type: 'FAIL_CHECK_TOKEN'; payload: TikTokError }
  | { type: 'REQUEST_CREATE_OAUTH' }
  | { type: 'SUCCESS_CREATE_OAUTH'; payload: TikTokOAuthData }
  | { type: 'FAIL_CREATE_OAUTH'; payload: TikTokError }
  | { type: 'RESET' };

/**
 * TikTok Profile types
 */

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TikTokProfileError {
  message: string;
  code?: string | number;
  details?: unknown;
}

export interface TikTokProfile {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_large_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  username: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokProfileState {
  status: AsyncStatus;
  error: TikTokProfileError | null;
  profile: TikTokProfile | null;
  lastUpdated?: string;
  source?: string;
}

export type TikTokProfileAction =
  | { type: 'REQUEST_PROFILE' }
  | { type: 'SUCCESS_PROFILE'; payload: { profile: TikTokProfile; lastUpdated?: string; source?: string } }
  | { type: 'FAIL_PROFILE'; payload: TikTokProfileError }
  | { type: 'RESET' };

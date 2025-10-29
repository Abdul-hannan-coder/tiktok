/**
 * TikTok Posting Feature Types
 * Handles photo posts, draft video URL uploads, and draft video file uploads
 */

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TikTokPostError {
  message: string;
  code?: string | number;
  details?: unknown;
}

/**
 * Privacy levels for TikTok posts
 */
export type PrivacyLevel =
  | 'SELF_ONLY'
  | 'MUTUAL_FOLLOW_FRIENDS'
  | 'FOLLOWER_OF_CREATOR'
  | 'PUBLIC_TO_EVERYONE';

/**
 * Request payload for posting photos/images to TikTok
 */
export interface PhotoPostRequest {
  photo_urls: string[];
  cover_index: number;
  title: string;
  description: string;
  privacy_level: PrivacyLevel;
  disable_comment: boolean;
  auto_add_music: boolean;
  brand_content_toggle: boolean;
  brand_organic_toggle: boolean;
}

/**
 * Response from photo post endpoint
 */
export interface PhotoPostResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Request payload for uploading draft video from URL
 */
export interface DraftVideoUrlRequest {
  video_url: string;
  title: string;
}

/**
 * Request payload for uploading draft video file
 */
export interface DraftVideoFileRequest {
  file: File;
  title: string;
}

/**
 * File information from upload
 */
export interface UploadFileInfo {
  filename: string;
  file_size: number;
  content_type: string;
  chunk_size: number;
  total_chunks: number;
  upload_completed: boolean;
}

/**
 * Response from draft video upload endpoints
 */
export interface DraftVideoResponse {
  success: boolean;
  message: string;
  data?: {
    data?: {
      publish_id?: string;
      upload_url?: string;
    };
    error?: {
      code?: string;
      message?: string;
      log_id?: string;
    };
    upload_status?: string;
    file_info?: UploadFileInfo;
    instructions?: string;
  };
}

/**
 * State for the TikTok posting hook
 */
export interface TikTokPostState {
  status: AsyncStatus;
  error: TikTokPostError | null;
  photoPostResult: PhotoPostResponse | null;
  draftVideoUrlResult: DraftVideoResponse | null;
  draftVideoFileResult: DraftVideoResponse | null;
  uploadProgress: number | null;
}

export type PhotoPostPayload = PhotoPostRequest;
export type DraftVideoUrlPayload = DraftVideoUrlRequest;
export type DraftVideoFilePayload = DraftVideoFileRequest;

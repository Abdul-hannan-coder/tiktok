/**
 * TikTok Post Reducer
 * Manages state for photo posts and draft video uploads
 */

import type {
  TikTokPostState,
  TikTokPostError,
  PhotoPostResponse,
  DraftVideoResponse,
} from '../types/tiktokPostTypes';

export type TikTokPostAction =
  | { type: 'REQUEST_PHOTO_POST'; payload: undefined }
  | { type: 'SUCCESS_PHOTO_POST'; payload: PhotoPostResponse }
  | { type: 'FAIL_PHOTO_POST'; payload: TikTokPostError }
  | { type: 'REQUEST_DRAFT_VIDEO_URL'; payload: undefined }
  | { type: 'SUCCESS_DRAFT_VIDEO_URL'; payload: DraftVideoResponse }
  | { type: 'FAIL_DRAFT_VIDEO_URL'; payload: TikTokPostError }
  | { type: 'REQUEST_DRAFT_VIDEO_FILE'; payload: undefined }
  | { type: 'PROGRESS_DRAFT_VIDEO_FILE'; payload: number }
  | { type: 'SUCCESS_DRAFT_VIDEO_FILE'; payload: DraftVideoResponse }
  | { type: 'FAIL_DRAFT_VIDEO_FILE'; payload: TikTokPostError }
  | { type: 'RESET' };

export const initialTikTokPostState: TikTokPostState = {
  status: 'idle',
  error: null,
  photoPostResult: null,
  draftVideoUrlResult: null,
  draftVideoFileResult: null,
  uploadProgress: null,
};

export function tiktokPostReducer(
  state: TikTokPostState,
  action: TikTokPostAction
): TikTokPostState {
  switch (action.type) {
    case 'REQUEST_PHOTO_POST':
      return {
        ...state,
        status: 'loading',
        error: null,
        photoPostResult: null,
      };
    case 'SUCCESS_PHOTO_POST':
      return {
        ...state,
        status: 'success',
        photoPostResult: action.payload,
        error: null,
      };
    case 'FAIL_PHOTO_POST':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'REQUEST_DRAFT_VIDEO_URL':
      return {
        ...state,
        status: 'loading',
        error: null,
        draftVideoUrlResult: null,
      };
    case 'SUCCESS_DRAFT_VIDEO_URL':
      return {
        ...state,
        status: 'success',
        draftVideoUrlResult: action.payload,
        error: null,
      };
    case 'FAIL_DRAFT_VIDEO_URL':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'REQUEST_DRAFT_VIDEO_FILE':
      return {
        ...state,
        status: 'loading',
        error: null,
        draftVideoFileResult: null,
        uploadProgress: 0,
      };
    case 'PROGRESS_DRAFT_VIDEO_FILE':
      return {
        ...state,
        uploadProgress: action.payload,
      };
    case 'SUCCESS_DRAFT_VIDEO_FILE':
      return {
        ...state,
        status: 'success',
        draftVideoFileResult: action.payload,
        error: null,
        uploadProgress: 100,
      };
    case 'FAIL_DRAFT_VIDEO_FILE':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'RESET':
      return initialTikTokPostState;
    default:
      return state;
  }
}

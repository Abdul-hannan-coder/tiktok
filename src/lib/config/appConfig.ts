/**
 * Application-wide configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';

export const appConfig = {
  API_BASE_URL,
  AUTH_TOKEN_KEY: 'auth_token',
  AUTH_USER_KEY: 'auth_user',
} as const;

export default appConfig;

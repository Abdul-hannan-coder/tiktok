# TikTok OAuth Popup Implementation

## Overview
TikTok OAuth now opens in a popup window instead of redirecting the entire page. After successful authentication, the user is automatically redirected to the dashboard which displays their real TikTok profile statistics.

## Files Modified/Created

### 1. `/src/app/auth/callback/page.tsx` (NEW)
**Purpose:** Handles the OAuth callback from TikTok and communicates with the parent window.

**Key Features:**
- Receives OAuth response from TikTok
- Sends message to parent window (popup opener) with success/error status
- Automatically closes popup after 1 second
- Fallback redirect if not opened as popup

**Implementation:**
```typescript
window.opener.postMessage({
  type: 'TIKTOK_OAUTH_CALLBACK',
  success: success === 'true',
  error: error || null,
  message: message || null,
}, window.location.origin)
```

### 2. `/src/app/auth/connect/page.tsx` (MODIFIED)
**Purpose:** Initiates TikTok OAuth in a popup window.

**Key Changes:**
- Opens OAuth URL in popup window (600x700px, centered)
- Listens for messages from popup via `window.addEventListener('message', ...)`
- Shows success message and redirects to dashboard on success
- Shows error message on failure
- Handles popup blocking detection
- Detects manual popup closure

**Popup Configuration:**
```javascript
const width = 600
const height = 700
const left = window.screen.width / 2 - width / 2
const top = window.screen.height / 2 - height / 2

window.open(
  oauthData.auth_url,
  'TikTok OAuth',
  `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
)
```

### 3. `/src/app/dashboard/page.tsx` (MODIFIED)
**Purpose:** Display real TikTok profile statistics from the API.

**Key Changes:**
- Integrated `useTikTokProfile` hook
- Loads profile on mount (cached data by default)
- Displays real TikTok stats:
  - Followers count
  - Following count
  - Video count
  - Likes count
- Shows profile avatar, display name, username, bio
- Refresh button to fetch live data from TikTok API
- Data source badge (📦 Cached / 🔄 Live)
- Last updated timestamp
- Link to TikTok profile
- Loading states
- Error handling with retry option

**Profile Data Displayed:**
```typescript
- profile.avatar_url_100 (profile picture)
- profile.display_name (name)
- profile.username (@username)
- profile.bio_description (bio)
- profile.is_verified (verified badge)
- profile.follower_count
- profile.following_count
- profile.video_count
- profile.likes_count
- profile.profile_deep_link (link to TikTok)
```

## User Flow

### OAuth Flow
1. User clicks "Connect with TikTok" on `/auth/connect`
2. Backend generates OAuth URL
3. OAuth URL opens in centered popup window (600x700px)
4. User authenticates with TikTok in popup
5. TikTok redirects to `/auth/callback?success=true` (or with error)
6. Callback page sends message to parent window
7. Parent window receives message
8. Success message shown for 2 seconds
9. User redirected to `/dashboard`
10. Popup closes automatically

### Dashboard Flow
1. Dashboard loads with protected route (AuthGuard)
2. Automatically fetches TikTok profile (cached data)
3. Displays profile stats in 4 cards:
   - Followers (with Users icon)
   - Following (with Users icon)
   - Videos (with Video icon)
   - Likes (with Heart icon)
4. User can click "Refresh" to get live data from TikTok
5. Data source badge shows whether data is cached or live
6. Last updated timestamp shown

## Security Features

### Message Validation
```typescript
// Verify origin for security
if (event.origin !== window.location.origin) {
  return
}
```

### Popup Blocking Detection
```typescript
if (!popup || popup.closed) {
  setErrorMessage('Popup was blocked. Please allow popups for this site.')
}
```

### Manual Closure Detection
```typescript
const checkPopupClosed = setInterval(() => {
  if (popup && popup.closed) {
    clearInterval(checkPopupClosed)
    window.removeEventListener('message', handleMessage)
  }
}, 500)
```

## API Integration

### TikTok Profile API
**Endpoint:** `/tiktok/user-profile`
**Query Parameter:** `refresh` (boolean)
- `refresh=false` - Returns cached data from database (faster)
- `refresh=true` - Fetches live data from TikTok API (slower, most current)

**Response Structure:**
```json
{
  "profile": {
    "open_id": "string",
    "union_id": "string",
    "avatar_url": "string",
    "avatar_url_100": "string",
    "avatar_large_url": "string",
    "display_name": "string",
    "bio_description": "string",
    "profile_deep_link": "string",
    "is_verified": boolean,
    "username": "string",
    "follower_count": number,
    "following_count": number,
    "likes_count": number,
    "video_count": number
  },
  "last_updated": "ISO timestamp",
  "source": "database" | "tiktok_api"
}
```

## UI/UX Features

### Loading States
- Skeleton loading for profile section
- Animated spinner on refresh button
- Disabled buttons during loading
- Progress bar during OAuth process

### Error Handling
- Error alerts with retry buttons
- Fallback UI when no profile data
- Clear error messages
- Popup blocking warnings

### Visual Feedback
- Success/error alerts with icons
- Animated transitions
- Gradient backgrounds
- Shadow effects
- Badge for data source
- Loading animations

### Number Formatting
Large numbers are formatted for readability:
- 1,234 → 1.2K
- 1,234,567 → 1.2M

## Testing Checklist

- [ ] OAuth popup opens correctly
- [ ] OAuth popup centers on screen
- [ ] User can authenticate with TikTok
- [ ] Success message appears after OAuth
- [ ] User redirects to dashboard after success
- [ ] Dashboard loads TikTok profile data
- [ ] All stats display correctly
- [ ] Refresh button fetches live data
- [ ] Data source badge updates correctly
- [ ] Error handling works for failed requests
- [ ] Popup blocking is detected
- [ ] Manual popup closure is handled
- [ ] Profile link opens TikTok profile
- [ ] Loading states work properly
- [ ] Number formatting works (K, M)

## Backend Requirements

### OAuth Callback Endpoint
The backend OAuth redirect URL must be set to:
```
https://yourdomain.com/auth/callback
```

And should return query parameters:
- `success=true` (on success)
- `success=false&error=...&message=...` (on failure)

### CORS Configuration
Ensure backend allows:
- POST requests to `/tiktok/create-token`
- GET requests to `/tiktok/user-profile`
- GET requests to `/tiktok/get-token`

## Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://backend.postsiva.com
```

## Dependencies Used
- React hooks (useState, useEffect, useCallback)
- Next.js (useRouter, useSearchParams)
- Lucide React (icons)
- Custom hooks (useAuthContext, useTikTok, useTikTokProfile)
- Shadcn/ui components (Button, Card, Badge)

## Notes
- Popup dimensions: 600x700px for optimal TikTok OAuth UX
- Message communication used for cross-window data transfer
- AuthGuard protects dashboard route
- Profile data cached in database for performance
- Live refresh available on demand

# 🚀 Quick Start: TikTok Posting Hook

## Import the Hook

```typescript
import { useTikTokPost } from '@/lib/hooks/tiktok/useTikTokPost';
import type { PrivacyLevel } from '@/lib/hooks/tiktok/types/tiktokPostTypes';
```

---

## Basic Usage

```typescript
function MyComponent() {
  const { state, actions } = useTikTokPost();

  // state.status: 'idle' | 'loading' | 'success' | 'error'
  // state.error: Error object or null
  // state.uploadProgress: 0-100 (for file uploads)
  // state.photoPostResult: Result from photo post
  // state.draftVideoUrlResult: Result from URL upload
  // state.draftVideoFileResult: Result from file upload
}
```

---

## 1️⃣ Post Photos (Carousel)

```typescript
const handlePostPhotos = async () => {
  try {
    const result = await actions.postPhotos({
      photo_urls: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
      ],
      cover_index: 0,                           // Which photo is the cover (0-based)
      title: 'My Carousel',
      description: 'Check this out! 🔥',
      privacy_level: 'PUBLIC_TO_EVERYONE',      // or SELF_ONLY, MUTUAL_FOLLOW_FRIENDS, FOLLOWER_OF_CREATOR
      disable_comment: false,
      auto_add_music: true,
      brand_content_toggle: false,
      brand_organic_toggle: false,
    });
    
    console.log('Success:', result.message);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

---

## 2️⃣ Upload Video from URL

```typescript
const handleVideoUrl = async () => {
  try {
    const result = await actions.uploadDraftVideoUrl({
      video_url: 'https://example.com/video.mp4',
      title: 'My Video',
    });
    
    console.log('Success:', result.message);
    console.log('Publish ID:', result.data?.data?.publish_id);
    console.log('Instructions:', result.data?.instructions);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

---

## 3️⃣ Upload Video File

```typescript
const handleVideoFile = async (file: File) => {
  try {
    const result = await actions.uploadDraftVideoFile(
      file,
      'My Video',
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      }
    );
    
    console.log('Success:', result.message);
    console.log('File info:', result.data?.file_info);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

---

## 🎨 UI Examples

### Loading State
```typescript
{state.status === 'loading' && (
  <div className="flex items-center gap-2">
    <Spinner />
    <span>Uploading...</span>
  </div>
)}
```

### Progress Bar (File Upload)
```typescript
{state.status === 'loading' && state.uploadProgress !== null && (
  <div>
    <Progress value={state.uploadProgress} />
    <p>{state.uploadProgress}% uploaded</p>
  </div>
)}
```

### Success Message
```typescript
{state.status === 'success' && state.photoPostResult && (
  <div className="bg-green-50 p-4 rounded">
    <p className="text-green-800">{state.photoPostResult.message}</p>
  </div>
)}
```

### Error Message
```typescript
{state.error && (
  <div className="bg-red-50 p-4 rounded">
    <p className="text-red-800">{state.error.message}</p>
  </div>
)}
```

### Reset State
```typescript
<Button onClick={() => actions.reset()}>
  Clear and Start Over
</Button>
```

---

## 🔐 Authentication

The hook automatically uses the token from `localStorage.getItem('token')`.

If you need custom token handling:

```typescript
const { state, actions } = useTikTokPost({
  getToken: () => myCustomTokenGetter(),
});
```

---

## 📝 Privacy Levels

```typescript
'SELF_ONLY'                  // Only you
'MUTUAL_FOLLOW_FRIENDS'      // Friends
'FOLLOWER_OF_CREATOR'        // Followers
'PUBLIC_TO_EVERYONE'         // Public
```

---

## ⚠️ Common Pitfalls

### 1. File Validation
```typescript
// Check file type
if (!file.type.startsWith('video/')) {
  alert('Please select a video file');
  return;
}

// Check file size (max 500MB)
if (file.size > 500 * 1024 * 1024) {
  alert('File too large');
  return;
}
```

### 2. Form Validation
```typescript
if (!title || title.trim().length === 0) {
  alert('Please enter a title');
  return;
}

if (photo_urls.length === 0) {
  alert('Please add at least one photo');
  return;
}
```

### 3. Error Handling
```typescript
try {
  await actions.postPhotos(payload);
} catch (error) {
  // Always check state.error for details
  console.log('Error:', state.error?.message);
  console.log('Code:', state.error?.code);
  console.log('Details:', state.error?.details);
}
```

---

## 🎯 Next Steps

1. **For Image/Text Upload Page:**
   - Open `/dashboard/upload/image-text/page.tsx`
   - Add `const { state, actions } = useTikTokPost()`
   - Replace placeholder with `actions.postPhotos()`

2. **For Video/Text Upload Page:**
   - Open `/dashboard/upload/video-text/page.tsx`
   - Add `const { state, actions } = useTikTokPost()`
   - Add file input handler
   - Use `actions.uploadDraftVideoFile()`

3. **Add UI Components:**
   - File dropzone
   - Image preview
   - Progress indicators
   - Success/error toasts

---

## 📚 Full Documentation

See `TIKTOK_POSTING_FEATURE.md` for:
- Complete API reference
- Detailed usage examples
- Architecture explanation
- Testing guidelines

---

**Ready to integrate!** 🎉

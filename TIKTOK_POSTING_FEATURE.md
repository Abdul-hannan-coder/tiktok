# 🎬 TikTok Posting Feature Implementation

**Date:** October 30, 2025  
**Status:** ✅ **COMPLETE**

---

## 📦 Files Created

```
src/lib/hooks/tiktok/
├── tiktokPostApi.ts                    # 🆕 API client for posting operations
├── useTikTokPost.ts                    # 🆕 React hook with state management
├── Reducers/
│   └── tiktokPostReducer.ts            # 🆕 State reducer
└── types/
    └── tiktokPostTypes.ts              # 🆕 TypeScript types & interfaces
```

---

## 🎯 Features Implemented

### 1. **Photo Direct Post** 📸
Post photo carousels directly to TikTok with full customization options.

**Endpoint:** `POST /tiktok/photo/direct/post`

**Capabilities:**
- Upload multiple photos (carousel)
- Set cover image index
- Add title and description
- Configure privacy level
- Enable/disable comments
- Auto-add music
- Brand content settings

---

### 2. **Draft Video Upload (URL)** 🔗
Upload video from a URL to TikTok inbox as a draft.

**Endpoint:** `POST /tiktok/draft-post/upload-url`

**Capabilities:**
- Upload video from any accessible URL
- Add custom title
- Video goes to TikTok inbox for final editing

---

### 3. **Draft Video Upload (File)** 📁
Upload video file directly from user's device to TikTok inbox.

**Endpoint:** `POST /tiktok/draft-post/upload`

**Capabilities:**
- Upload video files (MP4, MOV, etc.)
- Real-time upload progress tracking
- Add custom title
- Supports large files with chunked upload
- Video goes to TikTok inbox for final editing

---

## 🏗️ Architecture

### Types (`tiktokPostTypes.ts`)

```typescript
// Privacy levels
type PrivacyLevel = 
  | 'SELF_ONLY' 
  | 'MUTUAL_FOLLOW_FRIENDS' 
  | 'FOLLOWER_OF_CREATOR' 
  | 'PUBLIC_TO_EVERYONE';

// Photo post request
interface PhotoPostRequest {
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

// Draft video URL request
interface DraftVideoUrlRequest {
  video_url: string;
  title: string;
}

// State management
interface TikTokPostState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: TikTokPostError | null;
  photoPostResult: PhotoPostResponse | null;
  draftVideoUrlResult: DraftVideoResponse | null;
  draftVideoFileResult: DraftVideoResponse | null;
  uploadProgress: number | null;  // 0-100
}
```

---

### API Client (`tiktokPostApi.ts`)

```typescript
const api = createTikTokPostApi({ baseUrl, getToken });

// Post photos
await api.postPhotos({
  photo_urls: ['url1', 'url2'],
  cover_index: 0,
  title: 'My Carousel',
  description: 'Check this out!',
  privacy_level: 'PUBLIC_TO_EVERYONE',
  disable_comment: false,
  auto_add_music: true,
  brand_content_toggle: false,
  brand_organic_toggle: false
});

// Upload video from URL
await api.uploadDraftVideoUrl({
  video_url: 'https://example.com/video.mp4',
  title: 'My Video'
});

// Upload video file
await api.uploadDraftVideoFile(
  file,           // File object
  'My Video',     // Title
  (progress) => console.log(`${progress}%`)  // Progress callback
);
```

---

### Reducer (`tiktokPostReducer.ts`)

**Actions:**
- `REQUEST_PHOTO_POST` - Start photo upload
- `SUCCESS_PHOTO_POST` - Photo posted successfully
- `FAIL_PHOTO_POST` - Photo post failed
- `REQUEST_DRAFT_VIDEO_URL` - Start URL video upload
- `SUCCESS_DRAFT_VIDEO_URL` - URL video uploaded
- `FAIL_DRAFT_VIDEO_URL` - URL video failed
- `REQUEST_DRAFT_VIDEO_FILE` - Start file video upload
- `PROGRESS_DRAFT_VIDEO_FILE` - Update upload progress
- `SUCCESS_DRAFT_VIDEO_FILE` - File video uploaded
- `FAIL_DRAFT_VIDEO_FILE` - File video failed
- `RESET` - Reset all state

**State Flow:**
```
idle → loading → success/error
       ↓
   [progress updates for file uploads]
```

---

### Hook (`useTikTokPost.ts`)

```typescript
const { state, actions } = useTikTokPost();

// state.status: 'idle' | 'loading' | 'success' | 'error'
// state.error: Error object or null
// state.photoPostResult: Photo post response
// state.draftVideoUrlResult: Draft video URL response
// state.draftVideoFileResult: Draft video file response
// state.uploadProgress: 0-100 (for file uploads)

// actions.postPhotos(payload)
// actions.uploadDraftVideoUrl(payload)
// actions.uploadDraftVideoFile(file, title, onProgress?)
// actions.reset()
```

---

## 💻 Usage Examples

### Example 1: Post Photo Carousel

```typescript
'use client';

import { useTikTokPost } from '@/lib/hooks/tiktok/useTikTokPost';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function PhotoPostPage() {
  const { state, actions } = useTikTokPost();
  const { toast } = useToast();

  const handlePostPhotos = async () => {
    try {
      const result = await actions.postPhotos({
        photo_urls: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
          'https://example.com/photo3.jpg',
        ],
        cover_index: 0,
        title: 'My Amazing Carousel',
        description: 'Check out these awesome photos! 🔥',
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_comment: false,
        auto_add_music: true,
        brand_content_toggle: false,
        brand_organic_toggle: false,
      });

      toast({
        title: 'Success!',
        description: result.message,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: state.error?.message || 'Failed to post photos',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post Photo Carousel</h1>
      
      <Button 
        onClick={handlePostPhotos}
        disabled={state.status === 'loading'}
      >
        {state.status === 'loading' ? 'Posting...' : 'Post Photos'}
      </Button>

      {state.photoPostResult && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <p className="text-green-800">{state.photoPostResult.message}</p>
        </div>
      )}

      {state.error && (
        <div className="mt-4 p-4 bg-red-50 rounded">
          <p className="text-red-800">{state.error.message}</p>
        </div>
      )}
    </div>
  );
}
```

---

### Example 2: Upload Video from URL

```typescript
'use client';

import { useState } from 'react';
import { useTikTokPost } from '@/lib/hooks/tiktok/useTikTokPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function VideoUrlUploadPage() {
  const { state, actions } = useTikTokPost();
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleUpload = async () => {
    if (!videoUrl || !title) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await actions.uploadDraftVideoUrl({
        video_url: videoUrl,
        title: title,
      });

      toast({
        title: 'Success!',
        description: result.message,
      });

      // Show instructions
      if (result.data?.instructions) {
        toast({
          title: 'Next Steps',
          description: result.data.instructions,
          duration: 10000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: state.error?.message || 'Failed to upload video',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Upload Video from URL</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <Input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            type="text"
            placeholder="My awesome video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleUpload}
          disabled={state.status === 'loading'}
          className="w-full"
        >
          {state.status === 'loading' ? 'Uploading...' : 'Upload to TikTok Inbox'}
        </Button>
      </div>

      {state.draftVideoUrlResult?.data?.data?.publish_id && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm font-medium text-blue-900 mb-2">Upload Complete!</p>
          <p className="text-xs text-blue-700">
            Publish ID: {state.draftVideoUrlResult.data.data.publish_id}
          </p>
          <p className="text-sm text-blue-800 mt-2">
            {state.draftVideoUrlResult.data.instructions}
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### Example 3: Upload Video File with Progress

```typescript
'use client';

import { useState } from 'react';
import { useTikTokPost } from '@/lib/hooks/tiktok/useTikTokPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

export default function VideoFileUploadPage() {
  const { state, actions } = useTikTokPost();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select a video file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (e.g., max 500MB)
      const maxSize = 500 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast({
          title: 'File Too Large',
          description: 'Maximum file size is 500MB',
          variant: 'destructive',
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      toast({
        title: 'Error',
        description: 'Please select a file and enter a title',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await actions.uploadDraftVideoFile(
        file,
        title,
        (progress) => {
          console.log(`Upload progress: ${progress}%`);
        }
      );

      toast({
        title: 'Success!',
        description: result.message,
        duration: 5000,
      });

      // Show detailed info
      if (result.data?.file_info) {
        console.log('File Info:', result.data.file_info);
      }

      // Reset form
      setFile(null);
      setTitle('');
      if (document.getElementById('file-input')) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: state.error?.message || 'Failed to upload video',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Upload Video File</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Video File</label>
          <Input
            id="file-input"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
          {file && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            type="text"
            placeholder="My awesome video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {state.status === 'loading' && state.uploadProgress !== null && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Uploading...</span>
              <span>{state.uploadProgress}%</span>
            </div>
            <Progress value={state.uploadProgress} />
          </div>
        )}

        <Button 
          onClick={handleUpload}
          disabled={state.status === 'loading' || !file}
          className="w-full"
        >
          {state.status === 'loading' ? 'Uploading...' : 'Upload to TikTok Inbox'}
        </Button>
      </div>

      {state.draftVideoFileResult?.success && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <p className="text-sm font-medium text-green-900 mb-2">
            ✅ Upload Complete!
          </p>
          {state.draftVideoFileResult.data?.data?.publish_id && (
            <p className="text-xs text-green-700 mb-2">
              Publish ID: {state.draftVideoFileResult.data.data.publish_id}
            </p>
          )}
          {state.draftVideoFileResult.data?.instructions && (
            <p className="text-sm text-green-800">
              {state.draftVideoFileResult.data.instructions}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### Example 4: Combined Upload Page (All Three Methods)

```typescript
'use client';

import { useTikTokPost } from '@/lib/hooks/tiktok/useTikTokPost';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UploadPage() {
  const { state, actions } = useTikTokPost();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload to TikTok</h1>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="video-url">Video URL</TabsTrigger>
          <TabsTrigger value="video-file">Video File</TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          {/* Photo upload component */}
        </TabsContent>

        <TabsContent value="video-url">
          {/* Video URL upload component */}
        </TabsContent>

        <TabsContent value="video-file">
          {/* Video file upload component */}
        </TabsContent>
      </Tabs>

      {/* Global status display */}
      {state.status === 'loading' && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
          Uploading...
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 UI Integration Points

### Existing Pages to Enhance:

1. **`/dashboard/upload/image-text/page.tsx`**
   - Add photo carousel posting functionality
   - Use `actions.postPhotos()`

2. **`/dashboard/upload/video-text/page.tsx`**
   - Add draft video URL upload
   - Add draft video file upload
   - Use `actions.uploadDraftVideoUrl()` and `actions.uploadDraftVideoFile()`

3. **`/dashboard/upload/page.tsx`**
   - Main upload hub with all three options

---

## 🔧 Technical Details

### Authentication
- Uses JWT Bearer token from localStorage
- Token automatically included in all API requests
- Returns 401 error if token is missing or invalid

### Error Handling
```typescript
try {
  await actions.postPhotos(payload);
} catch (error) {
  console.error('Upload failed:', error);
  // error.message: Human-readable error message
  // error.code: HTTP status code
  // error.details: Full error response
}
```

### State Management
- ✅ Memoized API client (prevents recreation)
- ✅ Memoized action functions (stable references)
- ✅ Memoized actions object (prevents infinite loops)
- ✅ Individual state for each operation type
- ✅ Upload progress tracking for file uploads

### Performance Optimizations
- API client created once with `useMemo`
- Action functions memoized with `useCallback`
- Actions object memoized to prevent infinite loops
- Reducer ensures immutable state updates

---

## 🧪 Testing Checklist

- [ ] Post single photo
- [ ] Post photo carousel (multiple photos)
- [ ] Upload video from URL
- [ ] Upload video file (small < 10MB)
- [ ] Upload video file (large > 100MB)
- [ ] Track upload progress
- [ ] Handle authentication errors
- [ ] Handle network errors
- [ ] Handle file validation errors
- [ ] Test privacy level options
- [ ] Test with/without comments enabled
- [ ] Test brand content toggles
- [ ] Verify TikTok inbox notification
- [ ] Test reset functionality

---

## 📝 API Response Examples

### Photo Post Success:
```json
{
  "success": true,
  "message": "Photos posted successfully to TikTok!"
}
```

### Draft Video Upload Success:
```json
{
  "success": true,
  "message": "Video uploaded to TikTok inbox successfully! Check your TikTok app to complete the post.",
  "data": {
    "data": {
      "publish_id": "v_inbox_file~v2.7566708591408171020",
      "upload_url": "https://open-upload-va.tiktokapis.com/upload?..."
    },
    "error": {
      "code": "ok",
      "message": "",
      "log_id": "20251030021446C0B2814E5913BB2C9561"
    },
    "upload_status": "completed",
    "file_info": {
      "filename": "video.mp4",
      "file_size": 8165816,
      "content_type": "video/mp4",
      "chunk_size": 8165816,
      "total_chunks": 1,
      "upload_completed": true
    },
    "instructions": "A notification has been sent to your TikTok inbox. Click on it to edit and post your video."
  }
}
```

---

## 🚀 Next Steps

1. **Integrate into existing upload pages**
   - Modify `/dashboard/upload/image-text/page.tsx`
   - Modify `/dashboard/upload/video-text/page.tsx`

2. **Add UI components**
   - File dropzone for drag-and-drop
   - Image preview for photo carousel
   - Video preview before upload
   - Privacy level selector
   - Brand content toggles

3. **Enhance UX**
   - Add loading spinners
   - Show upload progress bars
   - Display success/error toasts
   - Add form validation
   - Implement retry logic

4. **Add features**
   - Save drafts locally
   - Schedule posts
   - Batch upload multiple videos
   - Image editing before upload
   - Video thumbnail selection

---

## ✅ Status

**Implementation:** ✅ COMPLETE  
**Testing:** 🟡 READY FOR TESTING  
**TypeScript:** ✅ NO ERRORS  
**Documentation:** ✅ COMPLETE  

**Ready to integrate into UI!** 🎉

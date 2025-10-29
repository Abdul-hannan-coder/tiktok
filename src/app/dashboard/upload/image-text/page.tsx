// "use client"

// import { DashboardLayout } from "@/components/DashboardLayout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { 
//   Image, 
//   FileText, 
//   Calendar,
//   Clock,
//   Upload,
//   ArrowLeft,
//   Send
// } from "lucide-react"
// import Link from "next/link"
// import { useState } from "react"
// import { useTikTokPost } from "@/lib/hooks/tiktok/useTikTokPost"

//   const [formData, setFormData] = useState({
//     text: "",
//     scheduledDate: "",
//     scheduledTime: "",
//     title: "",
//     description: ""
//   })
//   const [selectedImages, setSelectedImages] = useState<File[]>([])
//   const [privacy, setPrivacy] = useState<'SELF_ONLY' | 'PUBLIC_TO_EVERYONE'>('PUBLIC_TO_EVERYONE')
//   const { state, actions } = useTikTokPost()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedImages(Array.from(e.target.files))
//     }
//   }

//   const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setPrivacy(e.target.value as 'SELF_ONLY' | 'PUBLIC_TO_EVERYONE')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (selectedImages.length === 0) {
//       alert('Please select at least one image.')
//       return
//     }
//     try {
//       // Upload images to a CDN or get URLs (simulate with object URLs for now)
//       const photo_urls = selectedImages.map(img => URL.createObjectURL(img))
//       const payload = {
//         photo_urls,
//         cover_index: 0,
//         title: formData.title || 'Untitled',
//         description: formData.description || formData.text,
//         privacy_level: privacy,
//         disable_comment: false,
//         auto_add_music: false,
//         brand_content_toggle: false,
//         brand_organic_toggle: false,
//       }
//       await actions.postPhotos(payload)
//     } catch (error) {
//       // Error handled by hook state
//     }
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="relative overflow-hidden bg-linear-to-br from-black via-gray-900 to-black rounded-2xl p-8">
//           <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
//           <div className="relative z-10">
//             <div className="flex items-center space-x-4 mb-4">
//               <Link href="/dashboard/upload" className="p-2 text-gray-400 hover:text-white transition-colors">
//                 <ArrowLeft className="h-5 w-5" />
//               </Link>
//               <div>
//                 <h1 className="text-3xl font-bold text-white">Create Image + Text Post</h1>
//                 <p className="text-gray-300">Upload images and write engaging captions</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Upload Section */}
//           <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
//             <CardHeader>
//               <CardTitle className="text-white flex items-center space-x-2">
//                 <Image className="h-5 w-5" />
//                 <span>Upload Images</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
//                 <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-300 mb-2">Drag and drop images here</p>
//                 <p className="text-gray-400 text-sm mb-4">or click to browse</p>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileChange}
//                   className="mb-2"
//                 />
//               </div>
              
//               {/* Image Preview */}
//               <div className="mt-6 grid grid-cols-2 gap-4">
//                 {selectedImages.length === 0 ? (
//                   <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center col-span-2">
//                     <Image className="h-8 w-8 text-gray-500" />
//                   </div>
//                 ) : (
//                   selectedImages.map((img, idx) => (
//                     <div key={idx} className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
//                       <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} className="object-cover w-full h-full" />
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Text & Schedule Section */}
//           <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
//             <CardHeader>
//               <CardTitle className="text-white flex items-center space-x-2">
//                 <FileText className="h-5 w-5" />
//                 <span>Post Content</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Title */}
//                 <div>
//                   <Label htmlFor="title" className="text-gray-300">Title</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="mt-1"
//                   />
//                 </div>
//                 {/* Description */}
//                 <div>
//                   <Label htmlFor="description" className="text-gray-300">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1"
//                   />
//                 </div>
//                 {/* Privacy */}
//                 <div>
//                   <Label htmlFor="privacy" className="text-gray-300">Privacy</Label>
//                   <select
//                     id="privacy"
//                     name="privacy"
//                     value={privacy}
//                     onChange={handlePrivacyChange}
//                     className="mt-1 bg-gray-700 text-gray-300 rounded px-2 py-1"
//                   >
//                     <option value="PUBLIC_TO_EVERYONE">Public</option>
//                     <option value="SELF_ONLY">Only Me</option>
//                   </select>
//                 </div>
//                 {/* Submit Button */}
//                 <div className="space-y-2">
//                   <Label htmlFor="text" className="text-gray-300 font-medium">
//                     Post Text
//                   </Label>
//                   <Textarea
//                     id="text"
//                     name="text"
//                     placeholder="Write your post caption here..."
//                     value={formData.text}
//                     onChange={handleInputChange}
//                     className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
//                     required
//                   />
//                   <p className="text-gray-400 text-sm">
//                     {formData.text.length}/280 characters
//                   </p>
//                 </div>

//                 {/* Scheduling */}
//                 <div className="space-y-4">
//                   <Label className="text-gray-300 font-medium flex items-center space-x-2">
//                     <Calendar className="h-4 w-4" />
//                     <span>Schedule Post</span>
//                   </Label>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="scheduledDate" className="text-gray-400 text-sm">
//                         Date
//                       </Label>
//                       <Input
//                         id="scheduledDate"
//                         name="scheduledDate"
//                         type="date"
//                         value={formData.scheduledDate}
//                         onChange={handleInputChange}
//                         className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="scheduledTime" className="text-gray-400 text-sm">
//                         Time
//                       </Label>
//                       <Input
//                         id="scheduledTime"
//                         name="scheduledTime"
//                         type="time"
//                         value={formData.scheduledTime}
//                         onChange={handleInputChange}
//                         className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-4 pt-4">
//                   <Button
//                     type="submit"
//                     className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition-all duration-300"
//                   >
//                     <Send className="h-4 w-4 mr-2" />
//                     Post Now
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white px-6 py-3 rounded-2xl"
//                   >
//                     <Clock className="h-4 w-4 mr-2" />
//                     Schedule
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Preview Section */}
//         <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
//           <CardHeader>
//             <CardTitle className="text-white">Post Preview</CardTitle>
//           </CardHeader>
//                 <Button type="submit" className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#6C63FF]/30" disabled={state.status === 'loading'}>
//                   {state.status === 'loading' ? 'Posting...' : (<><Send className="h-5 w-5 mr-2" />Post Now</>)}
//                 </Button>
//                 {/* Status Messages */}
//                 {state.status === 'success' && state.photoPostResult && (
//                   <div className="bg-green-50 p-4 rounded mt-4">
//                     <p className="text-green-800">{state.photoPostResult.message}</p>
//                   </div>
//                 )}
//                 {state.error && (
//                   <div className="bg-red-50 p-4 rounded mt-4">
//                     <p className="text-red-800">{state.error.message}</p>
//                   </div>
//                 )}




"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Image, 
  FileText, 
  Calendar,
  Clock,
  Upload,
  ArrowLeft,
  Send
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTikTokPost } from "@/lib/hooks/tiktok/useTikTokPost"

// 1. Wrap all logic in a component function
export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    text: "",
    scheduledDate: "",
    scheduledTime: "",
    title: "",
    description: ""
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [privacy, setPrivacy] = useState<'SELF_ONLY' | 'PUBLIC_TO_EVERYONE'>('PUBLIC_TO_EVERYONE')
  const { state, actions } = useTikTokPost()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacy(e.target.value as 'SELF_ONLY' | 'PUBLIC_TO_EVERYONE')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedImages.length === 0) {
      alert('Please select at least one image.')
      return
    }
    try {
      // Upload images to a CDN or get URLs (simulate with object URLs for now)
      const photo_urls = selectedImages.map(img => URL.createObjectURL(img))
      const payload = {
        photo_urls,
        cover_index: 0,
        title: formData.title || 'Untitled',
        description: formData.description || formData.text,
        privacy_level: privacy,
        disable_comment: false,
        auto_add_music: false,
        brand_content_toggle: false,
        brand_organic_toggle: false,
      }
      await actions.postPhotos(payload)
    } catch (error) {
      // Error handled by hook state
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-black via-gray-900 to-black rounded-2xl p-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Create Image + Text Post</h1>
                <p className="text-gray-300">Upload images and write engaging captions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Upload Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop images here</p>
                <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mb-2"
                />
              </div>
              
              {/* Image Preview */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {selectedImages.length === 0 ? (
                  <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center col-span-2">
                    <Image className="h-8 w-8 text-gray-500" />
                  </div>
                ) : (
                  selectedImages.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Text & Schedule Section */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Post Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                {/* Privacy */}
                <div>
                  <Label htmlFor="privacy" className="text-gray-300">Privacy</Label>
                  <select
                    id="privacy"
                    name="privacy"
                    value={privacy}
                    onChange={handlePrivacyChange}
                    className="mt-1 bg-gray-700 text-gray-300 rounded px-2 py-1"
                  >
                    <option value="PUBLIC_TO_EVERYONE">Public</option>
                    <option value="SELF_ONLY">Only Me</option>
                  </select>
                </div>
                {/* Submit Button */}
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-gray-300 font-medium">
                    Post Text
                  </Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Write your post caption here..."
                    value={formData.text}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                    required
                  />
                  <p className="text-gray-400 text-sm">
                    {formData.text.length}/280 characters
                  </p>
                </div>

                {/* Scheduling */}
                <div className="space-y-4">
                  <Label className="text-gray-300 font-medium flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule Post</span>
                  </Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate" className="text-gray-400 text-sm">
                        Date
                      </Label>
                      <Input
                        id="scheduledDate"
                        name="scheduledDate"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime" className="text-gray-400 text-sm">
                        Time
                      </Label>
                      <Input
                        id="scheduledTime"
                        name="scheduledTime"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Replaced Action Buttons with the version from the broken preview card */}
                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#6C63FF]/30" 
                    disabled={state.status === 'loading'}
                  >
                    {state.status === 'loading' ? 'Posting...' : (<><Send className="h-5 w-5 mr-2" />Post Now</>)}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white px-6 py-3 rounded-2xl"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>

                {/* 3. Moved Status Messages inside the form */}
                {state.status === 'success' && state.photoPostResult && (
                  <div className="bg-green-50 p-4 rounded mt-4">
                    <p className="text-green-800">{state.photoPostResult.message}</p>
                  </div>
                )}
                {state.error && (
                  <div className="bg-red-50 p-4 rounded mt-4">
                    <p className="text-red-800">{state.error.message}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* 4. Removed the broken "Preview Section" Card */}

      </div>
    </DashboardLayout> // 5. Added closing tag
  )
} // 6. Added closing tag
"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Image, 
  FileText, 
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { toast } from "sonner"

export default function ImageTextPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: ""
  })

  // Functionality removed: keep UI only
  const isLoading = false
  const error: string | null = null
  const uploadProgress = 0
  const lastResponse: any = null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.info("Uploads are disabled in this build")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
          <div className="absolute inset-0 bg-linear-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-[#C5C5D2] hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">TikTok Photo Draft Post</h1>
                <p className="text-[#C5C5D2]">Create photo draft posts that go to your TikTok inbox</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Create Draft Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* URL Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-white font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-white placeholder-[#C5C5D2] focus:border-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    Enter a direct link to your image file (JPG, PNG, etc.)
                  </p>
                </div>

                {/* URL Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <div className="aspect-square bg-[#1A103D]/50 rounded-lg overflow-hidden relative">
                      <img
                        src={formData.imageUrl}
                        alt="Image preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                          toast.error("Unable to load image preview. Please check the URL.")
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-white font-medium">Image URL:</p>
                      <p className="text-[#C5C5D2] text-sm break-all bg-[#1A103D]/30 p-2 rounded">
                        {formData.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Uploading...</span>
                    <span className="text-[#C5C5D2] text-sm">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert className="mt-4 border-red-500 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Display */}
              {lastResponse?.success && (
                <Alert className="mt-4 border-green-500 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-300">
                    {lastResponse.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Text & Schedule Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Draft Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter post title..."
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-white placeholder-[#C5C5D2] focus:border-[#6C63FF] focus:ring-[#6C63FF]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Write your post description here..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-white placeholder-[#C5C5D2] focus:border-[#6C63FF] focus:ring-[#6C63FF] min-h-[120px]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.description.length}/280 characters
                  </p>
                </div>

                {/* Draft Info */}
                <div className="bg-[#6C63FF]/10 border border-[#6C63FF]/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-[#6C63FF] mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Draft Post</h4>
                      <p className="text-[#C5C5D2] text-sm">
                        This will be saved as a draft in your TikTok inbox. You can review and edit it before publishing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled
                    className="flex-1 bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6C63FF]/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Draft...
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
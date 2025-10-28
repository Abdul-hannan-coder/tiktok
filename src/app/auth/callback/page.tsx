"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the full URL with all query parameters
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    
    if (window.opener) {
      // Send message to parent window (popup opener)
      window.opener.postMessage(
        {
          type: 'TIKTOK_OAUTH_CALLBACK',
          success: success === 'true',
          error: error || null,
          message: message || null,
        },
        window.location.origin
      )
      
      // Close the popup after sending message
      setTimeout(() => {
        window.close()
      }, 1000)
    } else {
      // Fallback: if not opened as popup, redirect to dashboard
      if (success === 'true') {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/auth/connect?error=' + encodeURIComponent(message || 'OAuth failed')
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#0A012A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Processing...</h3>
        <p className="text-[#C5C5D2]">Please wait while we complete the connection</p>
      </div>
    </div>
  )
}

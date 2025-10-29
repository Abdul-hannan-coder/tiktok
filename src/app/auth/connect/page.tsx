"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/Home-Content/Header"
import { Footer } from "@/components/Home-Content/Footer"
import { ExternalLink, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { useTikTok } from "@/lib/hooks/tiktok/useTikTok"

function ConnectContent() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getToken } = useAuthContext()
  const tiktok = useTikTok({ getToken })

  // Check for error from callback redirect
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setErrorMessage(decodeURIComponent(error))
    }
  }, [searchParams])

  const handleConnectTikTok = async () => {
    setIsConnecting(true)
    setErrorMessage(null)
    
    try {
      // Create OAuth URL
      const oauthData = await tiktok.actions.createOAuth()
      
      if (oauthData && oauthData.auth_url) {
        // Open TikTok OAuth in popup
        const width = 600
        const height = 700
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2
        
        const popup = window.open(
          oauthData.auth_url,
          'TikTok OAuth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
        )

        // Listen for messages from popup
        const handleMessage = (event: MessageEvent) => {
          // Verify origin for security
          if (event.origin !== window.location.origin) {
            return
          }

          if (event.data.type === 'TIKTOK_OAUTH_CALLBACK') {
            window.removeEventListener('message', handleMessage)
            
            if (event.data.success) {
              // Success - show success message and redirect to dashboard
              setShowSuccess(true)
              setIsConnecting(false)
              
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            } else {
              // Error - show error message
              setErrorMessage(event.data.message || 'Failed to connect TikTok account')
              setIsConnecting(false)
            }
          }
        }

        window.addEventListener('message', handleMessage)

        // Check if popup was blocked
        if (!popup || popup.closed) {
          setErrorMessage('Popup was blocked. Please allow popups for this site.')
          setIsConnecting(false)
          window.removeEventListener('message', handleMessage)
        }

        // Check if popup was closed manually
        const checkPopupClosed = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(checkPopupClosed)
            window.removeEventListener('message', handleMessage)
            if (!showSuccess) {
              setIsConnecting(false)
            }
          }
        }, 500)
      }
    } catch (error) {
      console.error("Failed to start TikTok OAuth:", error)
      setErrorMessage('Failed to initiate TikTok connection')
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A012A]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
      </section>

      {/* Connect Section */}
      <section className="py-12 relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/8 via-[#FF2E97]/8 to-[#6C63FF]/8"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <Card className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 ring-0">
              <CardContent className="p-12 text-center">
                {/* Success Alert */}
                {showSuccess && (
                  <div className="bg-[#6C63FF]/10 border border-[#6C63FF]/50 rounded-lg p-3 flex items-start space-x-3 mb-6 text-left">
                    <CheckCircle className="h-5 w-5 text-[#6C63FF] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[#6C63FF] text-sm font-medium">Connected Successfully!</p>
                      <p className="text-[#C5C5D2] text-sm mt-1">Redirecting to dashboard...</p>
                    </div>
                  </div>
                )}

                {/* Error Alert */}
                {(tiktok.state.error || errorMessage) && (
                  <div className="bg-[#FF2E97]/10 border border-[#FF2E97]/50 rounded-lg p-3 flex items-start space-x-3 mb-6 text-left">
                    <AlertCircle className="h-5 w-5 text-[#FF2E97] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[#FF2E97] text-sm font-medium">Connection Failed</p>
                      <p className="text-[#C5C5D2] text-sm mt-1">
                        {errorMessage || tiktok.state.error?.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* TikTok Logo */}
                <div className="w-24 h-24 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="h-12 w-12 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-8">
                  Connect Your TikTok Channel
                </h1>

                {/* Connect Button */}
                <Button
                  onClick={handleConnectTikTok}
                  disabled={isConnecting || tiktok.state.status === 'loading'}
                  className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-4 rounded-2xl transition-all duration-300 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting || tiktok.state.status === 'loading' ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Connect with TikTok
                    </>
                  )}
                </Button>

                {/* Loading Bar */}
                {(isConnecting || tiktok.state.status === 'loading') && (
                  <div className="w-full bg-[#2A1A4D] rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                  </div>
                )}

                {/* Info Text */}
                <p className="text-[#C5C5D2] text-sm">
                  {isConnecting || tiktok.state.status === 'loading'
                    ? "Please wait while we connect your TikTok account..." 
                    : "Connect your TikTok account to start automating your posts"
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A012A]">
        <Header />
        <section className="py-12 relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A]">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Loading...</h3>
              <p className="text-[#C5C5D2]">Please wait</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    }>
      <ConnectContent />
    </Suspense>
  )
}

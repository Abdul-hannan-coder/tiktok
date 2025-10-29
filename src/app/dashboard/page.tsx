"use client"

import { useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { AuthGuard } from "@/components/AuthGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Heart, 
  RefreshCw,
  Video,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import { useTikTokProfile } from "@/lib/hooks/tiktok/useTikTokProfile"

export default function DashboardPage() {
  const { getToken, state: authState } = useAuthContext()
  const { state: profileState, actions } = useTikTokProfile({ getToken })
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Load TikTok profile on mount (from cache) - only once
    if (authState.isAuthenticated && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      actions.loadProfile(false)
    }
  }, [authState.isAuthenticated])
  // Removed 'actions' from dependencies to prevent infinite loop

  const handleRefresh = () => {
    // Refresh from live TikTok API
    actions.loadProfile(true)
  }

  const profile = profileState.profile

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Error Alert */}
          {profileState.error && (
            <div className="bg-[#FF2E97]/10 border border-[#FF2E97]/50 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-[#FF2E97] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[#FF2E97] text-sm font-medium">Failed to load profile</p>
                <p className="text-[#C5C5D2] text-sm mt-1">{profileState.error.message}</p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="bg-[#2A1A4D] border-[#FF2E97]/50 text-[#FF2E97] hover:bg-[#FF2E97]/20"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Welcome Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative z-10">
              {profileState.status === 'loading' && !profile ? (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#2A1A4D] rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-[#2A1A4D] rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-[#2A1A4D] rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              ) : profile ? (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={profile.avatar_url_100} 
                        alt={profile.display_name}
                        className="w-16 h-16 rounded-full border-2 border-[#6C63FF]"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-2xl font-bold text-white">{profile.display_name}</h2>
                          {profile.is_verified && (
                            <CheckCircle className="h-5 w-5 text-[#00F5FF]" />
                          )}
                        </div>
                        <p className="text-[#C5C5D2]">@{profile.username}</p>
                        {profile.bio_description && (
                          <p className="text-[#C5C5D2] text-sm mt-1">{profile.bio_description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Data Source Badge */}
                      <Badge 
                        variant={profileState.source === 'live' ? 'default' : 'secondary'}
                        className={profileState.source === 'live' 
                          ? 'bg-[#6C63FF]/20 text-[#6C63FF] border-[#6C63FF]/50' 
                          : 'bg-[#2A1A4D] text-[#C5C5D2] border-[#3A2A5D]'}
                      >
                        {profileState.source === 'live' ? '🔄 Live' : '📦 Cached'}
                      </Badge>
                      
                      {/* Refresh Button */}
                      <Button
                        onClick={handleRefresh}
                        disabled={profileState.status === 'loading'}
                        variant="outline"
                        size="sm"
                        className="bg-[#2A1A4D] border-[#6C63FF]/50 text-[#6C63FF] hover:bg-[#6C63FF]/20"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${profileState.status === 'loading' ? 'animate-spin' : ''}`} />
                        {profileState.status === 'loading' ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </div>
                  </div>

                  {profileState.lastUpdated && (
                    <p className="text-[#C5C5D2] text-xs mt-2">
                      Last updated: {new Date(profileState.lastUpdated).toLocaleString()}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-[#C5C5D2] mx-auto mb-4" />
                  <p className="text-[#C5C5D2] mb-4">No TikTok profile data available</p>
                  <Button onClick={handleRefresh} className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97]">
                    Load Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#C5C5D2]">Followers</CardTitle>
                  <Users className="h-4 w-4 text-[#6C63FF]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatNumber(profile.follower_count)}</div>
                  <p className="text-xs text-[#C5C5D2]">Total followers</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#C5C5D2]">Following</CardTitle>
                  <Users className="h-4 w-4 text-[#00F5FF]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatNumber(profile.following_count)}</div>
                  <p className="text-xs text-[#C5C5D2]">Accounts following</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#C5C5D2]">Total Videos</CardTitle>
                  <Video className="h-4 w-4 text-[#FF2E97]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatNumber(profile.video_count)}</div>
                  <p className="text-xs text-[#C5C5D2]">All time videos</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#C5C5D2]">Likes</CardTitle>
                  <Heart className="h-4 w-4 text-[#FF2E97]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatNumber(profile.likes_count)}</div>
                  <p className="text-xs text-[#C5C5D2]">Total likes received</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile URL */}
          {profile && profile.profile_deep_link && (
            <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold mb-1">TikTok Profile</h3>
                    <p className="text-[#C5C5D2] text-sm">View your TikTok profile</p>
                  </div>
                  <a
                    href={profile.profile_deep_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] text-white rounded-xl hover:from-[#5A52E6] hover:to-[#E61E87] transition-all"
                  >
                    Visit Profile
                    <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

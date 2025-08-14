"use client"

import { ArrowLeft, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useUserProfile } from "@/hooks"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileSettings } from "@/components/user/ProfileSettings"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useUserProfile()

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex flex-col items-center space-y-4 py-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2 text-center">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error || !user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-6 text-center">
            <div className="space-y-4">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-lg font-semibold">Failed to load profile</h2>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unable to load your profile information'}
              </p>
              <Button onClick={() => navigate('/notes')}>
                Go to Notes
              </Button>
            </div>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/notes')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your account information and preferences
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <ProfileSettings user={user} />
        </div>
      </div>
    </AuthGuard>
  )
}

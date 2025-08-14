"use client"

import { useState, useRef } from "react"
import { Camera, Upload, User2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUpdateProfile } from "@/hooks"
import { toast } from "@/hooks/use-toast"
import type { User } from "@/types"

interface ProfileAvatarProps {
  user: User
  size?: "sm" | "md" | "lg" | "xl"
  editable?: boolean
  className?: string
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-12 w-12", 
  lg: "h-16 w-16",
  xl: "h-24 w-24"
}

export function ProfileAvatar({ user, size = "lg", editable = false, className }: ProfileAvatarProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const updateProfile = useUpdateProfile()

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setShowUploadDialog(true)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // Convert file to base64 for now
      // In a real app, you'd upload to a file service
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        
        await updateProfile.mutateAsync({
          image: base64
        })
        
        toast.success('Profile photo updated successfully')
        setShowUploadDialog(false)
        cleanup()
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to update profile photo')
    }
  }

  const handleRemovePhoto = async () => {
    try {
      await updateProfile.mutateAsync({
        image: null
      })
      toast.success('Profile photo removed')
      setShowUploadDialog(false)
      cleanup()
    } catch (error) {
      console.error('Remove failed:', error)
      toast.error('Failed to remove profile photo')
    }
  }

  const cleanup = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className={`relative inline-block ${className}`}>
        <Avatar className={sizeMap[size]}>
          <AvatarImage 
            src={user.image || undefined} 
            alt={user.name || user.email}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
            <User2 className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} />
          </AvatarFallback>
        </Avatar>

        {editable && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 border-2 border-background shadow-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-3 w-3" />
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={showUploadDialog} onOpenChange={(open) => {
        if (!open) {
          cleanup()
        }
        setShowUploadDialog(open)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo or remove your current one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {previewUrl && (
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={previewUrl} 
                      alt="Preview" 
                      className="object-cover"
                    />
                  </Avatar>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Different Photo
              </Button>

              {(user.image || previewUrl) && (
                <Button
                  onClick={handleRemovePhoto}
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  disabled={updateProfile.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove Photo
                </Button>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
                disabled={updateProfile.isPending}
              >
                Cancel
              </Button>
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? 'Uploading...' : 'Update Photo'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

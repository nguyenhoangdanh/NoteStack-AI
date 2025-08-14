"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, Save, Loader2 } from "lucide-react"
import { useUpdateProfile } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileAvatar } from "./ProfileAvatar"
import { toast } from "@/hooks/use-toast"
import type { User as UserType } from "@/types"

const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .optional()
    .or(z.literal("")),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: UserType
  className?: string
}

export function ProfileForm({ user, className }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updateData = {
        name: data.name || undefined,
      }

      await updateProfile.mutateAsync(updateData)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Profile update failed:', error)
      toast.error('Failed to update profile')
    }
  }

  const hasChanges = form.formState.isDirty

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your profile information and manage your account settings
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b">
          <ProfileAvatar user={user} size="xl" editable />
          <div className="text-center">
            <h3 className="font-semibold text-lg">
              {user.name || 'Anonymous User'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Enter your display name"
                        className="pl-10"
                        disabled={updateProfile.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={user.email}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update your email address.
              </p>
            </div>

            {updateProfile.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {updateProfile.error instanceof Error 
                    ? updateProfile.error.message 
                    : "Failed to update profile. Please try again."
                  }
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={updateProfile.isPending || !hasChanges}
                className="min-w-[120px]"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

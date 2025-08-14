import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import type { User, UpdateUserRequest } from '@/types';

// Query Keys
const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    profile: ['users', 'profile'] as const,
  },
} as const;

// Get User Profile
export function useUserProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.users.profile,
    queryFn: () => userService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Update User Profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest): Promise<User> => 
      userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.users.profile, updatedUser);
      // Also update auth queries if they exist
      queryClient.setQueryData(['auth', 'me'], updatedUser);
    },
  });
}

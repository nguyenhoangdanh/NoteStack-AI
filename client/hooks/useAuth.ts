import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthVerifyResponse,
  User
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
    verify: ['auth', 'verify'] as const,
  },
} as const;

// Get Current User (from auth context)
export function useAuthUser() {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Verify Token
export function useVerifyToken() {
  return useQuery({
    queryKey: QUERY_KEYS.auth.verify,
    queryFn: () => authService.verify(),
    retry: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Register
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest): Promise<AuthResponse> => 
      authService.register(data),
    onSuccess: (response) => {
      // Set user data in cache
      queryClient.setQueryData(QUERY_KEYS.auth.me, response.user);
      queryClient.setQueryData(QUERY_KEYS.auth.verify, {
        valid: true,
        user: response.user,
      });
    },
  });
}

// Login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest): Promise<AuthResponse> => 
      authService.login(data),
    onSuccess: (response) => {
      // Set user data in cache
      queryClient.setQueryData(QUERY_KEYS.auth.me, response.user);
      queryClient.setQueryData(QUERY_KEYS.auth.verify, {
        valid: true,
        user: response.user,
      });
    },
  });
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
      return true;
    },
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.all });
      // Clear all user data
      queryClient.clear();
    },
  });
}

// Utility hooks
export function useAuthToken() {
  return {
    getToken: () => authService.getToken(),
    setToken: (token: string) => authService.setToken(token),
    removeToken: () => authService.removeToken(),
    isAuthenticated: () => authService.isAuthenticated(),
  };
}

export function useGoogleAuth() {
  return {
    getGoogleAuthUrl: () => authService.getGoogleAuthUrl(),
  };
}

// Authentication status
export function useAuthStatus() {
  const { data: user, isLoading, error } = useAuthUser();
  const { data: verification } = useVerifyToken();
  
  return {
    user,
    isAuthenticated: !!user && verification?.valid,
    isLoading,
    error,
  };
}

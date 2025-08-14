import { apiClient } from '@/lib/apiClient';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthVerifyResponse,
  User
} from '@/types';

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.publicPost<AuthResponse>('/auth/register', data);
    if (response.access_token) {
      apiClient.setAuthToken(response.access_token);
    }
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.publicPost<AuthResponse>('/auth/login', data);
    if (response.access_token) {
      apiClient.setAuthToken(response.access_token);
    }
    return response;
  }

  async verify(): Promise<AuthVerifyResponse> {
    return apiClient.get<AuthVerifyResponse>('/auth/verify');
  }

  async getMe(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }

  getGoogleAuthUrl(): string {
    return apiClient.getGoogleAuthUrl();
  }

  // Helper methods for token management
  setToken(token: string): void {
    apiClient.setAuthToken(token);
  }

  getToken(): string | null {
    return apiClient.getAuthToken();
  }

  removeToken(): void {
    apiClient.removeAuthToken();
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  async logout(): Promise<void> {
    apiClient.removeAuthToken();
  }
}

export const authService = new AuthService();

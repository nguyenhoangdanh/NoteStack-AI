import { apiClient } from '@/lib/apiClient';
import type {
  UpdateUserRequest,
  User
} from '@/types';

class UserService {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/users/me');
  }

  async updateProfile(data: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>('/users/me', data);
  }
}

export const userService = new UserService();

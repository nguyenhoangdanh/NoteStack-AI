import { User } from "./auth.type";

// User update request
export interface UpdateUserRequest {
  name?: string;
  image?: string;
}

// API response types
export type GetUserResponse = User;
export type UpdateUserResponse = User;

// Form types
export interface UpdateUserFormData {
  name: string;
  image: string;
}

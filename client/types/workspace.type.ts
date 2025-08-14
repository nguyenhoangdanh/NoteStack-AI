// Base Workspace type
export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateWorkspaceRequest {
  name: string;
}

// API response types
export type GetWorkspacesResponse = Workspace[];
export type GetDefaultWorkspaceResponse = Workspace | null;
export type CreateWorkspaceResponse = Workspace;

// Form types
export interface CreateWorkspaceFormData {
  name: string;
}

import { ApiResponse } from ".";

// Base types
export interface Collaboration {
  id: string;
  noteId?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  note?: {
    id: string;
    title: string;
    updatedAt: string;
    owner: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
  permission: 'READ' | 'WRITE' | 'ADMIN';
  joinedAt?: string;
  lastActive?: string;
  isOnline?: boolean;
  isOwner?: boolean;
  cursor?: {
    line: number;
    column: number;
    selection?: {
      start: number;
      end: number;
    };
  };
}

// Request types
export interface InviteCollaboratorRequest {
  email: string;
  permission: 'read' | 'write' | 'admin';
}

export interface UpdateCollaboratorPermissionRequest {
  permission: 'READ' | 'WRITE' | 'ADMIN';
}

export interface JoinCollaborationRequest {
  socketId: string;
}

export interface LeaveCollaborationRequest {
  socketId: string;
}

export interface UpdateCursorRequest {
  socketId: string;
  cursor: {
    line: number;
    column: number;
    selection?: {
      start: number;
      end: number;
    };
  };
}

export interface GetMyCollaborationsParams {
  permission?: string;
  limit?: number;
}

// API response types
export interface InviteCollaboratorResponse extends ApiResponse {
  collaboration?: Collaboration;
  pendingInvitation?: {
    email: string;
    permission: string;
    noteTitle: string;
  };
}

export interface GetCollaboratorsResponse extends ApiResponse {
  noteId: string;
  collaborators: Collaboration[];
  count: number;
}

export interface GetMyCollaborationsResponse extends ApiResponse {
  collaborations: Collaboration[];
  count: number;
}

export interface GetPermissionResponse extends ApiResponse {
  noteId: string;
  permission: string | null;
  hasAccess: boolean;
}

export interface GetStatsResponse extends ApiResponse {
  stats: {
    ownedNotes: number;
    collaboratedNotes: number;
    totalCollaborators: number;
  };
}

export interface JoinCollaborationResponse extends ApiResponse {
  collaborators: Collaboration[];
}

// Form types
export interface InviteCollaboratorFormData {
  email: string;
  permission: string;
}

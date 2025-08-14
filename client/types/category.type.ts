// Base Category type
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  keywords: string[];
  ownerId: string;
  isAuto: boolean;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
  noteCategories?: Array<{
    note: {
      id: string;
      title: string;
    };
  }>;
  _count?: {
    noteCategories: number;
  };
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  keywords: string[];
  isAuto?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface AutoCategorizeRequest {
  threshold?: number;
}

// Suggestion types
export interface CategorySuggestion {
  name: string;
  confidence: number;
  matchingKeywords?: string[];
  exists: boolean;
  existingCategoryId?: string;
  assigned?: boolean;
  reason?: string;
}

// Note-Category relationship
export interface NoteCategory {
  noteId: string;
  categoryId: string;
  confidence?: number;
  isAuto: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
}

// API response types
export type GetCategoriesResponse = Category[];
export type CreateCategoryResponse = Category;
export type UpdateCategoryResponse = Category;
export type GetCategoryResponse = Category;
export type SuggestCategoriesResponse = CategorySuggestion[];
export type AutoCategorizeResponse = CategorySuggestion[];
export type GetNoteCategoriesResponse = NoteCategory[];

// Form types
export interface CreateCategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  keywords: string;
}

export interface UpdateCategoryFormData extends Partial<CreateCategoryFormData> {}

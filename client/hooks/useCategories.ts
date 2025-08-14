import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services';
import type {
  CreateCategoryRequest,
  AutoCategorizeRequest,
  CategorySuggestion
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  categories: {
    all: ['categories'] as const,
    list: (includeAuto?: boolean) => ['categories', 'list', { includeAuto }] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
    noteCategories: (noteId: string) => ['categories', 'note', noteId] as const,
    suggestions: (content: string) => ['categories', 'suggestions', content] as const,
  },
} as const;

// Get All Categories
export function useCategories(includeAuto: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.categories.list(includeAuto),
    queryFn: () => categoryService.getAll(includeAuto),
  });
}

// Get Single Category
export function useCategory(id: string | null) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.categories.detail(id) : ['categories', 'none'],
    queryFn: () => id ? categoryService.getById(id) : null,
    enabled: !!id,
  });
}

// Create Category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    },
  });
}

// Update Category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateCategoryRequest>) =>
      categoryService.update(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        QUERY_KEYS.categories.detail(updatedCategory.id),
        updatedCategory
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    },
  });
}

// Delete Category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.categories.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    },
  });
}

// Category Suggestions
export function useCategorySuggestions() {
  return useMutation({
    mutationFn: (content: string): Promise<CategorySuggestion[]> =>
      categoryService.suggest(content),
  });
}

// Auto Categorize Note
export function useAutoCategorizeNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data?: AutoCategorizeRequest }) =>
      categoryService.autoCategorizeNote(noteId, data),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories.noteCategories(noteId),
      });
    },
  });
}

// Get Note Categories
export function useNoteCategories(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.categories.noteCategories(noteId) : ['categories', 'note', 'none'],
    queryFn: () => noteId ? categoryService.getNoteCategories(noteId) : [],
    enabled: !!noteId,
  });
}

// Assign Category to Note
export function useAssignCategoryToNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: string; categoryId: string }) =>
      categoryService.assignToNote(noteId, categoryId),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories.noteCategories(noteId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    },
  });
}

// Remove Category from Note
export function useRemoveCategoryFromNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: string; categoryId: string }) =>
      categoryService.removeFromNote(noteId, categoryId),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories.noteCategories(noteId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    },
  });
}

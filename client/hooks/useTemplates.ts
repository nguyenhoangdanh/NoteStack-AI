import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '@/services';
import type { Template, CreateTemplateRequest } from '@/types';

// Query Keys
const QUERY_KEYS = {
  templates: {
    all: ['templates'] as const,
    list: (isPublic?: boolean) => ['templates', 'list', { isPublic }] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
} as const;

// Get Templates
export function useTemplates(isPublic?: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.templates.list(isPublic),
    queryFn: () => templateService.getAll(isPublic),
  });
}

// Get Single Template
export function useTemplate(id: string | null) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.templates.detail(id) : ['templates', 'none'],
    queryFn: () => id ? templateService.getById(id) : null,
    enabled: !!id,
  });
}

// Create Template
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templates.all });
    },
  });
}

// Update Template
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateTemplateRequest>) =>
      templateService.update(id, data),
    onSuccess: (updatedTemplate) => {
      queryClient.setQueryData(
        QUERY_KEYS.templates.detail(updatedTemplate.id),
        updatedTemplate
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templates.all });
    },
  });
}

// Delete Template
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templateService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.templates.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templates.all });
    },
  });
}

// Phase 1 - Core hooks
export * from './useAuth';
export * from './useUsers';
export * from './useWorkspaces';
export * from './useNotes';
export * from './useVectors';
export * from './useChat';
export * from './useSettings';

// Phase 2A - Smart Features hooks
export * from './useCategories';
export * from './useDuplicates';
export * from './useRelations';
export * from './useSummaries';
export * from './useSearch';

// Phase 2B - Collaboration hooks
export * from './useCollaboration';
export * from './useSharing';
export * from './useVersions';
export * from './useTemplates';
export * from './useTags';
export * from './useAttachments';
export * from './useNotifications';
export * from './useActivities';

// UI hooks
export * from './useKeyboardShortcuts';
export * from './use-mobile';
export * from './use-toast';

// Re-export query client and utilities
export { queryClient } from '../lib/query';

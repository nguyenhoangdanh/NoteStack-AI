// Phase 1 - Core Services
export { authService } from './auth.service';
export { userService } from './user.service';
export { workspaceService } from './workspace.service';
export { noteService } from './note.service';
export { vectorService } from './vector.service';
export { chatService } from './chat.service';
export { settingsService } from './settings.service';

// Phase 2A - Smart Features
export { categoryService } from './category.service';
export { duplicateService } from './duplicate.service';
export { relationService } from './relation.service';
export { summaryService } from './summary.service';
export { searchService } from './search.service';

// Phase 2B - Collaboration Features
export { collaborationService } from './collaboration.service';
export { shareService } from './share.service';
export { versionService } from './version.service';
export { templateService } from './template.service';
export { tagService } from './tag.service';
export { attachmentService } from './attachment.service';
export { notificationService } from './notification.service';
export { activityService } from './activity.service';

// Export apiClient for direct use when needed
export { apiClient, ApiClientError } from '@/lib/apiClient';

// Export types
export type { ApiClient } from '@/lib/apiClient';

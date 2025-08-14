import { useMutation } from '@tanstack/react-query';
import { chatService } from '@/services';
import type {
  ChatRequest,
  SuggestRequest,
  ApplySuggestionRequest,
  ChatCompleteResponse,
  SuggestResponse,
  ApplySuggestionResponse,
  StreamResponse
} from '@/types';

// Chat Stream
export function useChatStream() {
  return useMutation({
    mutationFn: (data: ChatRequest): Promise<StreamResponse> =>
      chatService.stream(data),
  });
}

// Chat Complete
export function useChatComplete() {
  return useMutation({
    mutationFn: (data: ChatRequest): Promise<ChatCompleteResponse> =>
      chatService.complete(data),
  });
}

// Generate Suggestion
export function useGenerateSuggestion() {
  return useMutation({
    mutationFn: (data: SuggestRequest): Promise<SuggestResponse> =>
      chatService.suggest(data),
  });
}

// Apply Suggestion
export function useApplySuggestion() {
  return useMutation({
    mutationFn: (data: ApplySuggestionRequest): Promise<ApplySuggestionResponse> =>
      chatService.applySuggestion(data),
  });
}

// Chat Utilities
export function useChat() {
  const streamMutation = useChatStream();
  const completeMutation = useChatComplete();
  const suggestionMutation = useGenerateSuggestion();
  const applySuggestionMutation = useApplySuggestion();

  return {
    // Stream chat
    streamChat: streamMutation.mutate,
    streamChatAsync: streamMutation.mutateAsync,
    isStreamingChat: streamMutation.isPending,
    streamChatError: streamMutation.error,

    // Complete chat
    completeChat: completeMutation.mutate,
    completeChatAsync: completeMutation.mutateAsync,
    isCompletingChat: completeMutation.isPending,
    completeChatError: completeMutation.error,

    // Suggestions
    generateSuggestion: suggestionMutation.mutate,
    generateSuggestionAsync: suggestionMutation.mutateAsync,
    isGeneratingSuggestion: suggestionMutation.isPending,
    suggestionError: suggestionMutation.error,

    // Apply suggestion
    applySuggestion: applySuggestionMutation.mutate,
    applySuggestionAsync: applySuggestionMutation.mutateAsync,
    isApplyingSuggestion: applySuggestionMutation.isPending,
    applySuggestionError: applySuggestionMutation.error,
  };
}

import { apiClient } from '@/lib/apiClient';
import type {
  ChatRequest,
  SuggestRequest,
  ApplySuggestionRequest,
  ChatCompleteResponse,
  SuggestResponse,
  ApplySuggestionResponse,
  StreamResponse
} from '@/types';

class ChatService {
  async stream(data: ChatRequest): Promise<StreamResponse> {
    return apiClient.stream('/chat/stream', data);
  }

  async complete(data: ChatRequest): Promise<ChatCompleteResponse> {
    return apiClient.post<ChatCompleteResponse>('/chat/complete', data);
  }

  async suggest(data: SuggestRequest): Promise<SuggestResponse> {
    return apiClient.post<SuggestResponse>('/chat/suggest', data);
  }

  async applySuggestion(data: ApplySuggestionRequest): Promise<ApplySuggestionResponse> {
    return apiClient.post<ApplySuggestionResponse>('/chat/apply-suggestion', data);
  }
}

export const chatService = new ChatService();

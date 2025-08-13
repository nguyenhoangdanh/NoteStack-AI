import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, Citation } from "../types/api.types";

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  chatOpen: boolean;

  // Current selections
  selectedNoteId: string | null;
  selectedWorkspaceId: string | null;

  // Search and filters
  searchQuery: string;
  selectedTags: string[];

  // Modals and dialogs
  settingsOpen: boolean;
  commandPaletteOpen: boolean;

  // Draft management (for offline support)
  drafts: Record<string, { title: string; content: string; lastSaved: number }>;

  // Theme
  theme: "light" | "dark" | "system";

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setSelectedNoteId: (id: string | null) => void;
  setSelectedWorkspaceId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSettingsOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Draft management
  saveDraft: (noteId: string, title: string, content: string) => void;
  getDraft: (
    noteId: string,
  ) => { title: string; content: string; lastSaved: number } | null;
  deleteDraft: (noteId: string) => void;
  clearOldDrafts: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      chatOpen: false,
      selectedNoteId: null,
      selectedWorkspaceId: null,
      searchQuery: "",
      selectedTags: [],
      settingsOpen: false,
      commandPaletteOpen: false,
      drafts: {},
      theme: "system",

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setChatOpen: (open) => set({ chatOpen: open }),
      setSelectedNoteId: (id) => set({ selectedNoteId: id }),
      setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setTheme: (theme) => set({ theme }),

      // Draft management
      saveDraft: (noteId, title, content) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [noteId]: { title, content, lastSaved: Date.now() },
          },
        })),

      getDraft: (noteId) => get().drafts[noteId] || null,

      deleteDraft: (noteId) =>
        set((state) => {
          const { [noteId]: deleted, ...rest } = state.drafts;
          return { drafts: rest };
        }),

      clearOldDrafts: () =>
        set((state) => {
          const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const filteredDrafts = Object.fromEntries(
            Object.entries(state.drafts).filter(
              ([_, draft]) => draft.lastSaved > oneWeekAgo,
            ),
          );
          return { drafts: filteredDrafts };
        }),
    }),
    {
      name: "ai-notes-ui-store",
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        drafts: state.drafts,
      }),
    },
  ),
);

// Chat state (separate store for better performance)
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  input: string;

  // Actions
  setInput: (input: string) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateLastMessage: (content: string) => void; // Add this method
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  input: "",

  setInput: (input) => set({ input }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0) {
        const lastIndex = messages.length - 1;
        messages[lastIndex] = {
          ...messages[lastIndex],
          content,
        };
      }
      return { messages };
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),
}));

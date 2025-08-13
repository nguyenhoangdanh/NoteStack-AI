import { useEffect } from 'react';
import { useUIStore } from '../lib/store';
import { useCreateNote, useDefaultWorkspace } from '../lib/query';

export function useKeyboardShortcuts() {
  const {
    setCommandPaletteOpen,
    setChatOpen,
    setSettingsOpen,
    setSelectedNoteId,
    selectedNoteId,
    commandPaletteOpen,
    chatOpen,
  } = useUIStore();
  
  const defaultWorkspace = useDefaultWorkspace();
  const createNote = useCreateNote();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, shiftKey, altKey } = event;
      const isModifierPressed = metaKey || ctrlKey;

      // Prevent shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Allow some shortcuts even in input fields
        if (key === 'k' && isModifierPressed) {
          event.preventDefault();
          setCommandPaletteOpen(true);
          return;
        }
        if (key === 'Escape') {
          target.blur();
          return;
        }
        return;
      }

      // Global shortcuts
      switch (key.toLowerCase()) {
        case 'k':
          if (isModifierPressed) {
            event.preventDefault();
            setCommandPaletteOpen(!commandPaletteOpen);
          }
          break;

        case 'n':
          if (isModifierPressed && !shiftKey) {
            event.preventDefault();
            handleCreateNote();
          }
          break;

        case '/':
          if (!isModifierPressed) {
            event.preventDefault();
            setCommandPaletteOpen(true);
          }
          break;

        case 'j':
          if (isModifierPressed) {
            event.preventDefault();
            setChatOpen(!chatOpen);
          }
          break;

        case ',':
          if (isModifierPressed) {
            event.preventDefault();
            setSettingsOpen(true);
          }
          break;

        case 's':
          if (isModifierPressed && shiftKey) {
            event.preventDefault();
            setSettingsOpen(true);
          } else if (isModifierPressed) {
            event.preventDefault();
            // Save current note (handled by NoteEditor)
            const saveEvent = new CustomEvent('save-note');
            window.dispatchEvent(saveEvent);
          }
          break;

        case 'escape':
          event.preventDefault();
          setCommandPaletteOpen(false);
          setSettingsOpen(false);
          break;

        case '?':
          if (shiftKey && !isModifierPressed) {
            event.preventDefault();
            showShortcutsHelp();
          }
          break;

        // Navigation shortcuts
        case 'arrowup':
          if (isModifierPressed) {
            event.preventDefault();
            // Navigate to previous note
            const prevNoteEvent = new CustomEvent('navigate-prev-note');
            window.dispatchEvent(prevNoteEvent);
          }
          break;

        case 'arrowdown':
          if (isModifierPressed) {
            event.preventDefault();
            // Navigate to next note
            const nextNoteEvent = new CustomEvent('navigate-next-note');
            window.dispatchEvent(nextNoteEvent);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    setCommandPaletteOpen,
    setChatOpen,
    setSettingsOpen,
    commandPaletteOpen,
    chatOpen,
    defaultWorkspace,
    createNote,
  ]);

  const handleCreateNote = async () => {
    if (!defaultWorkspace) return;

    try {
      const noteId = await createNote.mutateAsync({
        title: 'Untitled Note',
        content: '',
        tags: [],
        workspaceId: defaultWorkspace._id,
      });
      setSelectedNoteId(noteId);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const showShortcutsHelp = () => {
    // This could open a modal with keyboard shortcuts
    console.log('Keyboard shortcuts help');
  };
}

export const KEYBOARD_SHORTCUTS = [
  { keys: ['⌘', 'K'], description: 'Open command palette' },
  { keys: ['⌘', 'N'], description: 'Create new note' },
  { keys: ['⌘', 'J'], description: 'Toggle chat panel' },
  { keys: ['⌘', ','], description: 'Open settings' },
  { keys: ['⌘', 'S'], description: 'Save current note' },
  { keys: ['⌘', '↑'], description: 'Previous note' },
  { keys: ['⌘', '↓'], description: 'Next note' },
  { keys: ['/'], description: 'Quick search' },
  { keys: ['?'], description: 'Show shortcuts' },
  { keys: ['Esc'], description: 'Close dialogs' },
];

import React, { useState, useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  FileText,
  Plus,
  Search,
  MessageSquare,
  Settings,
  Tag,
  Folder,
} from "lucide-react";
import { useUIStore } from "../lib/store";
import { formatDistanceToNow } from "date-fns";
import { useCreateNote, useDefaultWorkspace, useNotes } from "@/hooks";

export default function CommandPalette() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setSelectedNoteId,
    setChatOpen,
    setSettingsOpen,
    selectedWorkspaceId,
  } = useUIStore();

  const { data: defaultWorkspace } = useDefaultWorkspace();
  const currentWorkspaceId = selectedWorkspaceId || defaultWorkspace?.id;
  const { data: notes } = useNotes(currentWorkspaceId ? { workspaceId: currentWorkspaceId } : undefined);
  const createNote = useCreateNote();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "n" && (e.metaKey || e.ctrlKey) && commandPaletteOpen) {
        e.preventDefault();
        handleCreateNote();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleCreateNote = async () => {
    if (!currentWorkspaceId) return;

    try {
      const note = await createNote.mutateAsync({
        title: searchQuery || "Untitled Note",
        content: "",
        tags: [],
        workspaceId: currentWorkspaceId,
      });
      setSelectedNoteId(note.id);
      setCommandPaletteOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setCommandPaletteOpen(false);
    setSearchQuery("");
  };

  const handleAskQuestion = () => {
    setChatOpen(true);
    setCommandPaletteOpen(false);
    setSearchQuery("");
  };

  const handleOpenSettings = () => {
    setSettingsOpen(true);
    setCommandPaletteOpen(false);
    setSearchQuery("");
  };

  const filteredNotes =
    notes?.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    ) || [];

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput
        placeholder="Type a command or search..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create new note</span>
            <span className="ml-auto text-xs text-muted-foreground">⌘N</span>
          </CommandItem>

          {searchQuery.trim() && (
            <CommandItem onSelect={handleAskQuestion}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Ask my notes: "{searchQuery}"</span>
            </CommandItem>
          )}

          <CommandItem onSelect={handleOpenSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        {/* Recent Notes */}
        {filteredNotes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Notes">
              {filteredNotes.slice(0, 8).map((note) => (
                <CommandItem
                  key={note.id}
                  onSelect={() => handleSelectNote(note.id)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{note.title || "Untitled"}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {note.content.replace(/<[^>]*>/g, "").substring(0, 60)}
                      {note.content.length > 60 && "..."}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">
                    {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

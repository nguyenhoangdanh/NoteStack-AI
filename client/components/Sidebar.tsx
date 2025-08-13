import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Plus,
  Search,
  FileText,
  Tag,
  Settings,
  MessageSquare,
  Folder,
  MoreHorizontal,
  Trash2,
  Edit2,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  useNotes,
  useWorkspaces,
  useDefaultWorkspace,
  useCreateNote,
  useDeleteNote,
} from "../lib/query";
import { useUIStore } from "../lib/store";
import { formatDistanceToNow } from "date-fns";
import SearchBar from "./SearchBar";
import type { Id } from "../../convex/_generated/dataModel";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [filterTag, setFilterTag] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const {
    selectedNoteId,
    selectedWorkspaceId,
    sidebarOpen,
    chatOpen,
    setSelectedNoteId,
    setSelectedWorkspaceId,
    setChatOpen,
    setSettingsOpen,
    setSidebarOpen,
  } = useUIStore();

  const workspaces = useWorkspaces();
  const defaultWorkspace = useDefaultWorkspace();
  const currentWorkspaceId = selectedWorkspaceId || defaultWorkspace?._id;
  const notes = useNotes(currentWorkspaceId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const filteredNotes =
    notes?.filter((note) => !filterTag || note.tags.includes(filterTag)) || [];

  const allTags = Array.from(
    new Set(notes?.flatMap((note) => note.tags) || []),
  ).sort();

  const handleCreateNote = async () => {
    if (!currentWorkspaceId || isCreating) return;

    setIsCreating(true);
    try {
      const noteId = await createNote.mutateAsync({
        title: "Untitled Note",
        content: "",
        tags: [],
        workspaceId: currentWorkspaceId,
      });
      setSelectedNoteId(noteId);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (noteId: Id<"notes">, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote.mutateAsync(noteId);
        if (selectedNoteId === noteId) {
          setSelectedNoteId(null);
        }
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  if (!sidebarOpen) {
    return (
      <div
        className={cn(
          "w-12 border-r bg-background flex flex-col items-center py-4 gap-2",
          className,
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="w-8 h-8 p-0"
        >
          <FileText className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setChatOpen(!chatOpen)}
          className={cn("w-8 h-8 p-0", chatOpen && "bg-accent")}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          className="w-8 h-8 p-0"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-80 border-r bg-background flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">AI Notes</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
              className={cn("h-8 w-8 p-0", chatOpen && "bg-accent")}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <SearchBar placeholder="Search notes..." />

        <Button
          onClick={handleCreateNote}
          disabled={isCreating}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? "Creating..." : "New Note"}
        </Button>
      </div>

      {/* Workspace selector */}
      {workspaces && workspaces.length > 1 && (
        <div className="p-4 border-b">
          <div className="text-sm font-medium mb-2">Workspace</div>
          <div className="space-y-1">
            {workspaces.map((workspace) => (
              <Button
                key={workspace._id}
                variant={
                  selectedWorkspaceId === workspace._id ? "secondary" : "ghost"
                }
                size="sm"
                onClick={() => setSelectedWorkspaceId(workspace._id)}
                className="w-full justify-start"
              >
                <Folder className="w-4 h-4 mr-2" />
                {workspace.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="p-4 border-b">
          <div className="text-sm font-medium mb-2">Filter by Tag</div>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant={filterTag === "" ? "default" : "secondary"}
              className="cursor-pointer text-xs"
              onClick={() => setFilterTag("")}
            >
              All
            </Badge>
            {allTags.slice(0, 10).map((tag) => (
              <Badge
                key={tag}
                variant={filterTag === tag ? "default" : "secondary"}
                className="cursor-pointer text-xs"
                onClick={() => setFilterTag(tag === filterTag ? "" : tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {filterTag ? `No notes tagged "${filterTag}"` : "No notes yet"}
              </p>
              {!filterTag && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleCreateNote}
                  className="mt-2"
                >
                  Create your first note
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => setSelectedNoteId(note._id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer group hover:bg-accent transition-colors",
                    selectedNoteId === note._id && "bg-accent",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {note.title || "Untitled"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {note.content.replace(/<[^>]*>/g, "").substring(0, 80)}
                        {note.content.length > 80 && "..."}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(note.updatedAt, {
                            addSuffix: true,
                          })}
                        </div>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{note.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteNote(note._id, e)}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

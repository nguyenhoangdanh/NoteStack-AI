import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  useNotes,
  useWorkspaces,
  useDefaultWorkspace,
  useCreateNote,
  useUpdateNote,
  useNote,
  useDeleteNote,
} from "../hooks/useApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  FileText,
  MessageSquare,
  Settings,
  Tag,
  Send,
  User,
  Bot,
  Save,
  LogOut,
  Loader2,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../lib/utils";
import ChatPanel from "../components/ChatPanel";
import NoteEditor from "../components/NoteEditor";
import CommandPalette from "../components/CommandPalette";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useUIStore } from "../lib/store";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Notes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();

  // UI Store
  const {
    selectedNoteId,
    sidebarOpen,
    chatOpen,
    selectedWorkspaceId,
    searchQuery,
    setSelectedNoteId,
    setSidebarOpen,
    setChatOpen,
    setSelectedWorkspaceId,
    setSearchQuery,
  } = useUIStore();

  // Local state for note creation
  const [newNoteTitle, setNewNoteTitle] = useState("Untitled Note");

  // Set initial state from URL params
  useEffect(() => {
    if (searchParams.get("chat") === "true" && !chatOpen) {
      setChatOpen(true);
    }
  }, [searchParams, chatOpen, setChatOpen]);

  // API queries
  const { data: workspaces } = useWorkspaces();
  const { data: defaultWorkspace } = useDefaultWorkspace();
  const currentWorkspaceId = selectedWorkspaceId || defaultWorkspace?.id;
  const { data: notes, isLoading: notesLoading } = useNotes(currentWorkspaceId);
  const { data: selectedNote } = useNote(selectedNoteId);

  // Mutations
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Filter notes based on search
  const filteredNotes = (notes || []).filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Select first note by default if none selected
  useEffect(() => {
    if (!selectedNoteId && filteredNotes.length > 0) {
      setSelectedNoteId(filteredNotes[0].id);
    }
  }, [filteredNotes, selectedNoteId, setSelectedNoteId]);

  const handleCreateNote = async () => {
    if (!currentWorkspaceId) return;

    try {
      const note = await createNote.mutateAsync({
        title: newNoteTitle,
        content: `# ${newNoteTitle}\n\nStart writing your note here...`,
        tags: [],
        workspaceId: currentWorkspaceId,
      });
      setSelectedNoteId(note.id);
      setNewNoteTitle("Untitled Note");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote.mutateAsync(noteId);
        if (selectedNoteId === noteId) {
          const remainingNotes = filteredNotes.filter(n => n.id !== noteId);
          setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
        }
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Command Palette */}
      <CommandPalette />

      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            )}
            <h1 className="font-semibold">AI Notes</h1>
            {workspaces && workspaces.length > 1 && (
              <Badge variant="outline" className="text-xs">
                {workspaces.find(w => w.id === currentWorkspaceId)?.name || 'Workspace'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Welcome, {user?.name || user?.email?.split('@')[0] || "User"}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          {sidebarOpen && (
            <>
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="w-full border-r bg-background flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">
                        {workspaces?.find(w => w.id === currentWorkspaceId)?.name || 'Notes'}
                      </h2>
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
                          onClick={() => navigate("/settings")}
                          className="h-8 w-8 p-0"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSidebarOpen(false)}
                          className="h-8 w-8 p-0"
                        >
                          <PanelLeftClose className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="pl-10"
                      />
                    </div>

                    {/* Workspace selector */}
                    {workspaces && workspaces.length > 1 && (
                      <select
                        value={currentWorkspaceId || ''}
                        onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        {workspaces.map((workspace) => (
                          <option key={workspace.id} value={workspace.id}>
                            {workspace.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="flex gap-2">
                      <Input
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Note title..."
                        className="flex-1"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleCreateNote()
                        }
                      />
                      <Button 
                        onClick={handleCreateNote} 
                        size="sm"
                        disabled={createNote.isPending}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes List */}
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {notesLoading ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Loading notes...</p>
                        </div>
                      ) : filteredNotes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            {searchQuery ? "No notes found" : "No notes yet"}
                          </p>
                          {!searchQuery && (
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
                              key={note.id}
                              onClick={() => setSelectedNoteId(note.id)}
                              className={cn(
                                "p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors group relative",
                                selectedNoteId === note.id && "bg-accent",
                              )}
                            >
                              <div className="font-medium text-sm truncate mb-1">
                                {note.title || "Untitled"}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {note.content
                                  .replace(/[#*\n]/g, " ")
                                  .substring(0, 80)}
                                {note.content.length > 80 && "..."}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDeleteNote(note.id, e)}
                                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>

                              {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
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
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{note.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Editor */}
          <ResizablePanel defaultSize={chatOpen ? 45 : 75} minSize={30}>
            <NoteEditor note={selectedNote || null} />
          </ResizablePanel>

          {/* Chat Panel */}
          {chatOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <ChatPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

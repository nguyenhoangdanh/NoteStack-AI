import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable";
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
  Loader2
} from "lucide-react";
import { cn } from "../lib/utils";
import type { Id } from "../../convex/_generated/dataModel";

// Demo fallback data in case Convex isn't fully configured
const demoNotes = [
  {
    _id: "demo1" as Id<"notes">,
    title: "Welcome to AI Notes!",
    content: "# Welcome to AI Notes!\n\nThis is your first note. Start writing your thoughts, ideas, and insights here.\n\n## Features\n- Real-time sync across devices\n- AI-powered search\n- Smart tagging\n- Markdown support\n\nEnjoy your note-taking journey!",
    tags: ["welcome", "getting-started"],
    workspaceId: "demo-workspace" as Id<"workspaces">,
    ownerId: "demo-user" as Id<"users">,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
];

export default function Notes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  
  const [selectedNoteId, setSelectedNoteId] = useState<Id<"notes"> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(searchParams.get("chat") === "true");
  const [searchQuery, setSearchQuery] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("Untitled Note");
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState<string[]>([]);

  // Convex queries and mutations
  const workspaces = useQuery(api.workspaces?.list);
  const defaultWorkspace = useQuery(api.workspaces?.getDefault);
  const notes = useQuery(api.notes?.list, 
    defaultWorkspace ? { workspaceId: defaultWorkspace._id } : "skip"
  );
  const selectedNote = useQuery(api.notes?.get, 
    selectedNoteId ? { id: selectedNoteId } : "skip"
  );
  
  const createNote = useMutation(api.notes?.create);
  const updateNote = useMutation(api.notes?.update);

  // Use demo data if Convex queries fail
  const displayNotes = notes || demoNotes;
  const currentWorkspace = defaultWorkspace || { 
    _id: "demo-workspace" as Id<"workspaces">,
    name: "My Workspace" 
  };

  // Filter notes based on search
  const filteredNotes = displayNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Load note content when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setNoteContent(selectedNote.content);
      setNoteTags(selectedNote.tags);
    } else if (selectedNoteId && displayNotes.length > 0) {
      const demoNote = displayNotes.find(n => n._id === selectedNoteId);
      if (demoNote) {
        setNoteContent(demoNote.content);
        setNoteTags(demoNote.tags);
      }
    }
  }, [selectedNote, selectedNoteId, displayNotes]);

  // Select first note by default
  useEffect(() => {
    if (!selectedNoteId && filteredNotes.length > 0) {
      setSelectedNoteId(filteredNotes[0]._id);
    }
  }, [filteredNotes, selectedNoteId]);

  const handleCreateNote = async () => {
    if (!defaultWorkspace) return;
    
    try {
      const noteId = await createNote({
        title: newNoteTitle,
        content: "# " + newNoteTitle + "\n\nStart writing your note here...",
        tags: [],
        workspaceId: defaultWorkspace._id,
      });
      setSelectedNoteId(noteId);
      setNewNoteTitle("Untitled Note");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNoteId || !selectedNote) return;
    
    try {
      await updateNote({
        id: selectedNoteId,
        content: noteContent,
        tags: noteTags,
      });
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
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

  const currentNote = selectedNote || (selectedNoteId ? displayNotes.find(n => n._id === selectedNoteId) : null);

  return (
    <div className="h-screen flex flex-col bg-background">
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
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Welcome, {user?.name || "User"}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image} />
              <AvatarFallback>
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
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
                      <h2 className="font-semibold">{currentWorkspace.name}</h2>
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
                    
                    <div className="flex gap-2">
                      <Input
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Note title..."
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
                      />
                      <Button onClick={handleCreateNote} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes List */}
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {filteredNotes.length === 0 ? (
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
                              key={note._id}
                              onClick={() => setSelectedNoteId(note._id)}
                              className={cn(
                                "p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                                selectedNoteId === note._id && "bg-accent"
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
                              {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
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
            <div className="h-full flex flex-col">
              {currentNote ? (
                <>
                  {/* Editor Header */}
                  <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold truncate">
                        {currentNote.title}
                      </h2>
                      <Button onClick={handleSaveNote} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {noteTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 overflow-auto">
                    <div className="p-6">
                      <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Start writing your note..."
                        className="w-full h-full min-h-[500px] bg-transparent border-none resize-none focus:outline-none text-sm font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      No note selected
                    </h3>
                    <p>Select a note from the sidebar to start editing.</p>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Chat Panel */}
          {chatOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <Card className="h-full flex flex-col rounded-none border-0 border-l">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Ask My Notes</CardTitle>
                        <CardDescription>
                          AI-powered search (Coming Soon)
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setChatOpen(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">AI Chat Coming Soon</h3>
                      <p className="text-sm">
                        The AI chat feature will be available once you configure your OpenAI API key in the Convex environment.
                      </p>
                    </div>
                  </div>
                </Card>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

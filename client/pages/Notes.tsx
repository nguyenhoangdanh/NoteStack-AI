import React, { useEffect } from 'react';
import { useAuth, useDefaultWorkspace } from '../lib/query';
import { useUIStore } from '../lib/store';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import ChatPanel from '../components/ChatPanel';
import CommandPalette from '../components/CommandPalette';
import { Button } from '../components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNote } from '../lib/query';

export default function Notes() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const defaultWorkspace = useDefaultWorkspace();
  const { selectedNoteId, sidebarOpen, chatOpen, setSidebarOpen, setSelectedWorkspaceId } = useUIStore();
  const note = useNote(selectedNoteId);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Set default workspace when it loads
  useEffect(() => {
    if (defaultWorkspace && !selectedNoteId) {
      setSelectedWorkspaceId(defaultWorkspace._id);
    }
  }, [defaultWorkspace, selectedNoteId, setSelectedWorkspaceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome to AI Notes</h1>
          <p className="text-muted-foreground">
            A smart note-taking app powered by AI
          </p>
          <Button size="lg" onClick={() => window.location.href = '/api/auth/signin/google'}>
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
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
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/auth/signout'}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <ResizablePanel 
            defaultSize={20} 
            minSize={15} 
            maxSize={40}
            className={cn(!sidebarOpen && "hidden")}
          >
            <Sidebar />
          </ResizablePanel>
          
          {sidebarOpen && <ResizableHandle />}
          
          {/* Editor */}
          <ResizablePanel defaultSize={chatOpen ? 50 : 80} minSize={30}>
            <div className="h-full flex flex-col relative">
              {sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-2 left-2 z-10 h-8 w-8 p-0"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
              )}
              <NoteEditor note={note} className="flex-1" />
            </div>
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

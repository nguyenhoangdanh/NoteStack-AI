import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotes } from '@/hooks/useNotes';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import type { Note } from '@/types';
import { cn } from '@/lib/utils';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'React Best Practices',
    content: 'Key principles for writing maintainable React code including component composition, state management patterns, and performance optimization techniques.',
    tags: ['react', 'frontend', 'best-practices'],
    workspaceId: 'workspace-1',
    ownerId: 'user-1',
    isDeleted: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    workspace: { id: 'workspace-1', name: 'Development' }
  },
  {
    id: '2',
    title: 'AI Integration Strategies',
    content: 'Exploring different approaches to integrate AI capabilities into web applications, including API design patterns and user experience considerations.',
    tags: ['ai', 'integration', 'api'],
    workspaceId: 'workspace-2',
    ownerId: 'user-1',
    isDeleted: false,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    workspace: { id: 'workspace-2', name: 'Research' }
  },
  {
    id: '3',
    title: 'TypeScript Advanced Patterns',
    content: 'Advanced TypeScript patterns including conditional types, mapped types, and template literal types for better type safety and developer experience.',
    tags: ['typescript', 'patterns', 'advanced'],
    workspaceId: 'workspace-1',
    ownerId: 'user-1',
    isDeleted: false,
    createdAt: '2024-01-13T11:20:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
    workspace: { id: 'workspace-1', name: 'Development' }
  }
];

interface NotesListProps {
  showCreateButton?: boolean;
  limit?: number;
  workspaceId?: string;
}

export function NotesList({ showCreateButton = true, limit, workspaceId }: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data: notes, isLoading, error } = useNotes({ workspaceId, limit });
  const { data: workspaces } = useWorkspaces();

  // Use actual data if available, otherwise fallback to mock data
  const finalNotes = notes || mockNotes;

  // Filter notes based on search query
  const filteredNotes = finalNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = () => {
    setIsCreating(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Failed to load notes. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {showCreateButton && (
          <Button onClick={handleCreateNote} className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredNotes.length} notes</span>
        {searchQuery && (
          <Badge variant="secondary">
            Filtered by: {searchQuery}
          </Badge>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first note to get started'}
            </p>
            {showCreateButton && !searchQuery && (
              <Button onClick={handleCreateNote} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {(isCreating || editingNote) && (
        <NoteEditor
          note={editingNote}
          isOpen={isCreating || !!editingNote}
          onClose={handleCloseEditor}
          workspaces={workspaces || []}
        />
      )}
    </div>
  );
}

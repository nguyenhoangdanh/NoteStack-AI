import React, { useState, useEffect } from 'react';
import { Note, Workspace, CreateNoteDto, UpdateNoteDto } from '../types/api.types';
import { apiClient } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    SearchIcon,
    TagIcon,
    FileTextIcon,
    CalendarIcon,
    EyeIcon,
    BrainIcon,
    ShareIcon,
    MoreHorizontalIcon
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { NoteEditor } from './NoteEditor';
import { SemanticSearch } from './SemanticSearch';

interface NotesManagerProps {
    notes: Note[];
    selectedWorkspace: Workspace | null;
    onNotesUpdate: (notes: Note[]) => void;
    onWorkspaceChange: (workspace: Workspace) => void;
    workspaces: Workspace[];
}

export function NotesManager({
    notes,
    selectedWorkspace,
    onNotesUpdate,
    onWorkspaceChange,
    workspaces
}: NotesManagerProps) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [view, setView] = useState<'list' | 'grid' | 'editor'>('grid');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // New note form state
    const [newNote, setNewNote] = useState<CreateNoteDto>({
        title: '',
        content: '',
        tags: [],
        workspaceId: selectedWorkspace?.id || ''
    });

    // Edit note form state
    const [editNote, setEditNote] = useState<UpdateNoteDto>({});

    // Tag input state
    const [tagInput, setTagInput] = useState('');

    // Get all unique tags from notes
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    // Filter and sort notes
    const filteredNotes = notes
        .filter(note => {
            const matchesSearch = !searchQuery ||
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => note.tags.includes(tag));

            return matchesSearch && matchesTags;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'updated':
                default:
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });

    // Reset form when workspace changes
    useEffect(() => {
        setNewNote(prev => ({ ...prev, workspaceId: selectedWorkspace?.id || '' }));
    }, [selectedWorkspace]);

    const handleCreateNote = async () => {
        if (!newNote.title || !newNote.content || !selectedWorkspace) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const createdNote = await apiClient.notes.create({
                ...newNote,
                workspaceId: selectedWorkspace.id
            });

            onNotesUpdate([createdNote, ...notes]);
            setIsCreateDialogOpen(false);
            setNewNote({ title: '', content: '', tags: [], workspaceId: selectedWorkspace.id });
            toast.success('Note created successfully!');

            // Auto-process for RAG
            try {
                await apiClient.notes.processForRAG(createdNote.id);
            } catch (error) {
                console.log('Auto-processing for RAG failed:', error);
            }
        } catch (error) {
            console.error('Failed to create note:', error);
            toast.error('Failed to create note');
        }
    };

    const handleUpdateNote = async () => {
        if (!selectedNote) return;

        try {
            const updatedNote = await apiClient.notes.update(selectedNote.id, editNote);
            const updatedNotes = notes.map(note =>
                note.id === selectedNote.id ? updatedNote : note
            );

            onNotesUpdate(updatedNotes);
            setSelectedNote(updatedNote);
            setIsEditDialogOpen(false);
            setEditNote({});
            toast.success('Note updated successfully!');
        } catch (error) {
            console.error('Failed to update note:', error);
            toast.error('Failed to update note');
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await apiClient.notes.delete(noteId);
            const updatedNotes = notes.filter(note => note.id !== noteId);
            onNotesUpdate(updatedNotes);

            if (selectedNote?.id === noteId) {
                setSelectedNote(null);
                setView('grid');
            }

            toast.success('Note deleted successfully');
        } catch (error) {
            console.error('Failed to delete note:', error);
            toast.error('Failed to delete note');
        }
    };

    const addTag = (tag: string) => {
        if (!tag || newNote.tags.includes(tag)) return;
        setNewNote(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        setNewNote(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const openEditor = (note: Note) => {
        setSelectedNote(note);
        setView('editor');
    };

    const openEditDialog = (note: Note) => {
        setSelectedNote(note);
        setEditNote({
            title: note.title,
            content: note.content,
            tags: [...note.tags]
        });
        setIsEditDialogOpen(true);
    };

    if (view === 'editor' && selectedNote) {
        return (
            <NoteEditor
                note={selectedNote}
                onSave={(updatedNote) => {
                    const updatedNotes = notes.map(note =>
                        note.id === updatedNote.id ? updatedNote : note
                    );
                    onNotesUpdate(updatedNotes);
                    setSelectedNote(updatedNote);
                }}
                onClose={() => {
                    setSelectedNote(null);
                    setView('grid');
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="updated">Last Updated</SelectItem>
                            <SelectItem value="created">Date Created</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant={view === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setView('grid')}
                        >
                            Grid
                        </Button>
                        <Button
                            variant={view === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setView('list')}
                        >
                            List
                        </Button>
                    </div>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center space-x-2">
                            <PlusIcon className="h-4 w-4" />
                            <span>New Note</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Note</DialogTitle>
                            <DialogDescription>
                                Create a new note in {selectedWorkspace?.name}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <Input
                                placeholder="Note title"
                                value={newNote.title}
                                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                            />

                            <Textarea
                                placeholder="Write your note content..."
                                value={newNote.content}
                                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                rows={10}
                            />

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder="Add tags"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag(tagInput);
                                            }
                                        }}
                                    />
                                    <Button size="sm" onClick={() => addTag(tagInput)}>
                                        Add
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {newNote.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                                            <span>{tag}</span>
                                            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateNote}>
                                Create Note
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tags filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Filter by tags:</span>
                    {allTags.map(tag => (
                        <Button
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                                setSelectedTags(prev =>
                                    prev.includes(tag)
                                        ? prev.filter(t => t !== tag)
                                        : [...prev, tag]
                                );
                            }}
                        >
                            {tag}
                        </Button>
                    ))}
                    {selectedTags.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTags([])}
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            )}

            {/* Notes display */}
            {filteredNotes.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery || selectedTags.length > 0
                                ? 'No notes match your current filters'
                                : 'Create your first note to get started'
                            }
                        </p>
                        {(!searchQuery && selectedTags.length === 0) && (
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Create Your First Note
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className={view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-4'
                }>
                    {filteredNotes.map(note => (
                        <Card key={note.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle
                                        className="text-lg line-clamp-2 group-hover:text-primary transition-colors"
                                        onClick={() => openEditor(note)}
                                    >
                                        {note.title}
                                    </CardTitle>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                <MoreHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditor(note)}>
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openEditDialog(note)}>
                                                <EditIcon className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { }}>
                                                <ShareIcon className="h-4 w-4 mr-2" />
                                                Share
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { }}>
                                                <BrainIcon className="h-4 w-4 mr-2" />
                                                AI Chat
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => handleDeleteNote(note.id)}
                                            >
                                                <TrashIcon className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent onClick={() => openEditor(note)}>
                                <div className="space-y-3">
                                    <div className="text-sm text-muted-foreground line-clamp-3">
                                        <ReactMarkdown>{note.content.substring(0, 200) + '...'}</ReactMarkdown>
                                    </div>

                                    {note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {note.tags.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {note.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{note.tags.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <FileTextIcon className="h-3 w-3" />
                                            <span>{note.content.split(' ').length} words</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Note Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>
                            Make changes to your note
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Note title"
                            value={editNote.title || ''}
                            onChange={(e) => setEditNote(prev => ({ ...prev, title: e.target.value }))}
                        />

                        <Textarea
                            placeholder="Note content"
                            value={editNote.content || ''}
                            onChange={(e) => setEditNote(prev => ({ ...prev, content: e.target.value }))}
                            rows={10}
                        />

                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {editNote.tags?.map(tag => (
                                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => {
                                                setEditNote(prev => ({
                                                    ...prev,
                                                    tags: prev.tags?.filter(t => t !== tag)
                                                }));
                                            }}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateNote}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Semantic Search Component */}
            <SemanticSearch />
        </div>
    );
}

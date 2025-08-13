import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Save,
  Tag,
  X,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUpdateNote, useProcessNoteForRAG, useSettings } from '../lib/query';
import { useUIStore } from '../lib/store';
import type { Id } from '../../convex/_generated/dataModel';

interface NoteEditorProps {
  note: {
    _id: Id<"notes">;
    title: string;
    content: string;
    tags: string[];
  } | null;
  className?: string;
}

export default function NoteEditor({ note, className }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { saveDraft, getDraft, deleteDraft } = useUIStore();
  const updateNote = useUpdateNote();
  const processNoteForRAG = useProcessNoteForRAG();
  const settings = useSettings();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      setHasUnsavedChanges(true);
      if (note) {
        saveDraft(note._id, title, editor.getHTML());
      }
    },
  });

  // Load note content
  useEffect(() => {
    if (note) {
      const draft = getDraft(note._id);
      if (draft && draft.lastSaved > note.updatedAt) {
        // Use draft if it's newer
        setTitle(draft.title);
        editor?.commands.setContent(draft.content);
      } else {
        setTitle(note.title);
        editor?.commands.setContent(note.content);
      }
      setTags(note.tags);
      setHasUnsavedChanges(false);
    } else {
      setTitle('');
      setTags([]);
      editor?.commands.setContent('');
      setHasUnsavedChanges(false);
    }
  }, [note, editor, getDraft]);

  const handleSave = useCallback(async () => {
    if (!note || !editor) return;

    const content = editor.getHTML();
    
    try {
      await updateNote.mutateAsync({
        id: note._id,
        title,
        content,
        tags,
      });

      // Process for RAG if auto-reembed is enabled
      if (settings?.autoReembed) {
        processNoteForRAG.mutate(note._id);
      }

      setHasUnsavedChanges(false);
      deleteDraft(note._id);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }, [note, editor, title, tags, updateNote, processNoteForRAG, settings, deleteDraft]);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setHasUnsavedChanges(true);
    }
  }, [newTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setHasUnsavedChanges(true);
  }, [tags]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  if (!note) {
    return (
      <div className={cn("flex-1 flex items-center justify-center text-muted-foreground", className)}>
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No note selected</h3>
          <p>Select a note from the sidebar or create a new one to start editing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Note title..."
            className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
          />
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
            <Button
              onClick={handleSave}
              disabled={updateNote.isPending || !hasUnsavedChanges}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <div className="flex items-center gap-1">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className="h-6 text-xs w-20 min-w-0"
            />
            <Button
              onClick={handleAddTag}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive('bold') && "bg-muted"
            )}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive('italic') && "bg-muted"
            )}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive('bulletList') && "bg-muted"
            )}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive('orderedList') && "bg-muted"
            )}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive('blockquote') && "bg-muted"
            )}
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive('code') && "bg-muted"
            )}
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <EditorContent 
            editor={editor} 
            className="min-h-[500px] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

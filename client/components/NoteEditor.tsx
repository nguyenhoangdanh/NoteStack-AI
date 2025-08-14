import React, { useState, useEffect } from 'react';
import { Note, UpdateNoteRequest } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  SaveIcon, 
  XIcon, 
  EyeIcon, 
  EditIcon,
  BrainIcon,
  ShareIcon,
  HistoryIcon,
  TagIcon,
  FileTextIcon
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useUpdateNote, useGenerateSuggestion } from '../hooks';

interface NoteEditorProps {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<UpdateNoteRequest>({
    title: note.title,
    content: note.content,
    tags: [...note.tags]
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const { mutate: updateNote } = useUpdateNote();
  const { mutateAsync: generateSuggestion } = useGenerateSuggestion();

  // Track changes
  useEffect(() => {
    const changed = 
      editedNote.title !== note.title ||
      editedNote.content !== note.content ||
      JSON.stringify(editedNote.tags) !== JSON.stringify(note.tags);
    setHasChanges(changed);
  }, [editedNote, note]);

  // Auto-save functionality (commented out for now)
  useEffect(() => {
    if (!hasChanges) return;
    
    const autoSaveTimer = setTimeout(() => {
      // handleSave(false); // Silent save
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [editedNote, hasChanges]);

  const handleSave = () => {
    if (note) {
      updateNote({
        id: note.id,
        title: editedNote.title,
        content: editedNote.content,
        tags: editedNote.tags
      });
    }
  };

  const addTag = (tag: string) => {
    if (!tag || editedNote.tags?.includes(tag)) return;
    setEditedNote(prev => ({ 
      ...prev, 
      tags: [...(prev.tags || []), tag] 
    }));
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setEditedNote(prev => ({ 
      ...prev, 
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold line-clamp-1">{editedNote.title || 'Untitled'}</h1>
            <p className="text-sm text-muted-foreground">
              Last saved: {new Date(note.updatedAt).toLocaleString()}
              {hasChanges && ' • Unsaved changes'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center space-x-1">
                <EditIcon className="h-3 w-3" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-1">
                <EyeIcon className="h-3 w-3" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm">
            <BrainIcon className="h-4 w-4 mr-2" />
            AI Chat
          </Button>
          
          <Button variant="outline" size="sm">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button 
            onClick={() => handleSave()} 
            disabled={!hasChanges || saving}
            className="min-w-[100px]"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex" onKeyDown={handleKeyDown}>
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'edit' ? (
            <div className="flex-1 flex flex-col p-4 space-y-4">
              {/* Title */}
              <Input
                placeholder="Note title"
                value={editedNote.title || ''}
                onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-bold border-none px-0 focus-visible:ring-0"
              />
              
              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-4 w-4 text-muted-foreground" />
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
                    className="max-w-xs"
                  />
                  <Button size="sm" onClick={() => addTag(tagInput)}>
                    Add
                  </Button>
                </div>
                
                {editedNote.tags && editedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editedNote.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button 
                          onClick={() => removeTag(tag)} 
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Content Editor */}
              <Textarea
                placeholder="Start writing your note..."
                value={editedNote.content || ''}
                onChange={(e) => setEditedNote(prev => ({ ...prev, content: e.target.value }))}
                className="flex-1 resize-none border-none px-0 focus-visible:ring-0 font-mono"
                style={{ minHeight: '400px' }}
              />
              
              {/* Editor Footer */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>{editedNote.content?.split(' ').length || 0} words</span>
                  <span>{editedNote.content?.length || 0} characters</span>
                </div>
                <div>
                  <span>Ctrl+S to save</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4">
              <div className="max-w-none">
                <h1 className="text-3xl font-bold mb-4">{editedNote.title || 'Untitled'}</h1>
                
                {editedNote.tags && editedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {editedNote.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        
                        return language ? (
                          <SyntaxHighlighter
                            style={tomorrow as any}
                            language={language}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {editedNote.content || 'No content yet...'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-muted/30">
          <div className="p-4 space-y-6">
            {/* Note Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <FileTextIcon className="h-4 w-4" />
                  <span>Note Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modified</span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Words</span>
                  <span>{editedNote.content?.split(' ').length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Characters</span>
                  <span>{editedNote.content?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Workspace</span>
                  <span>{note.workspace?.name || 'Unknown'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BrainIcon className="h-4 w-4 mr-2" />
                  Generate Summary
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share Note
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <HistoryIcon className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI-powered suggestions for improving this note will appear here.
                </p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Get Suggestions
                </Button>
              </CardContent>
            </Card>

            {/* Related Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Related notes based on content similarity will appear here.
                </p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Find Related
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

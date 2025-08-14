import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreateNote, useUpdateNote } from '@/hooks/useNotes';
import { useDefaultWorkspace } from '@/hooks/useWorkspaces';
import { toast } from 'react-hot-toast';
import type { Note, Workspace } from '@/types';

const noteFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  tags: z.string(),
  workspaceId: z.string().min(1, 'Workspace is required'),
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface NoteEditorProps {
  note?: Note | null;
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
}

export function NoteEditor({ note, isOpen, onClose, workspaces }: NoteEditorProps) {
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const { data: defaultWorkspace } = useDefaultWorkspace();

  const isEditing = !!note;
  const isLoading = createNote.isPending || updateNote.isPending;

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: '',
      workspaceId: '',
    },
  });

  // Reset form when note changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (note) {
        form.reset({
          title: note.title,
          content: note.content,
          tags: note.tags.join(', '),
          workspaceId: note.workspaceId,
        });
      } else {
        form.reset({
          title: '',
          content: '',
          tags: '',
          workspaceId: defaultWorkspace?.id || workspaces[0]?.id || '',
        });
      }
    }
  }, [note, isOpen, form, defaultWorkspace, workspaces]);

  const onSubmit = async (data: NoteFormData) => {
    try {
      const tags = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      if (isEditing && note) {
        await updateNote.mutateAsync({
          id: note.id,
          title: data.title,
          content: data.content,
          tags,
          workspaceId: data.workspaceId,
        });
        toast.success('Note updated successfully');
      } else {
        await createNote.mutateAsync({
          title: data.title,
          content: data.content,
          tags,
          workspaceId: data.workspaceId,
        });
        toast.success('Note created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update note' : 'Failed to create note');
    }
  };

  const parseTags = (tagsString: string) => {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  const currentTags = parseTags(form.watch('tags') || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? 'Edit Note' : 'Create New Note'}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter note title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workspace */}
            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workspace" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                          {workspace.name}
                          {workspace.isDefault && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Default
                            </Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note content..."
                      className="min-h-[200px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tags separated by commas..."
                      {...field}
                    />
                  </FormControl>
                  {currentTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {currentTags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="btn-gradient">
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? 'Update Note' : 'Create Note'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

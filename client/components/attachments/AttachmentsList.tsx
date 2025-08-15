import React from "react";
import { Paperclip, Download, Eye, Trash2, FileText, Image, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNoteAttachments } from "@/hooks/useAttachments";
import type { Attachment } from "@/types";

const mockAttachments: Attachment[] = [
  {
    id: "1",
    noteId: "note-1",
    filename: "project-diagram.png",
    originalName: "project-diagram.png",
    mimeType: "image/png",
    size: 245760,
    url: "/uploads/project-diagram.png",
    uploadedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2", 
    noteId: "note-1",
    filename: "meeting-notes.pdf",
    originalName: "meeting-notes.pdf",
    mimeType: "application/pdf",
    size: 512000,
    url: "/uploads/meeting-notes.pdf",
    uploadedAt: "2024-01-14T14:20:00Z",
  },
];

interface AttachmentsListProps {
  noteId: string;
  showTitle?: boolean;
}

export function AttachmentsList({ noteId, showTitle = true }: AttachmentsListProps) {
  const { data: attachments, isLoading, error } = useNoteAttachments(noteId);
  
  const finalAttachments = attachments || mockAttachments;

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {showTitle && <Skeleton className="h-6 w-32" />}
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error || finalAttachments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          <span className="font-medium">Attachments ({finalAttachments.length})</span>
        </div>
      )}
      
      <div className="space-y-2">
        {finalAttachments.map((attachment) => (
          <Card key={attachment.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="text-muted-foreground">
                  {getFileIcon(attachment.mimeType)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{attachment.originalName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(attachment.size)}</span>
                    <span>•</span>
                    <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

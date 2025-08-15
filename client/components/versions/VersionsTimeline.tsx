import React from "react";
import { Clock, RotateCcw, Eye, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNoteVersions } from "@/hooks/useVersions";
import type { NoteVersion } from "@/types";

const mockVersions: NoteVersion[] = [
  {
    id: "v3",
    noteId: "note-1",
    version: 3,
    title: "Updated with AI suggestions",
    content: "Enhanced content with AI improvements...",
    changeLog: "Added AI-generated insights and improved structure",
    createdAt: "2024-01-15T14:20:00Z",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      image: null,
    },
    wordCount: 450,
    characterCount: 2890,
    isLatest: true,
  },
  {
    id: "v2",
    noteId: "note-1",
    version: 2,
    title: "Added more details",
    content: "Expanded content with more examples...",
    changeLog: "Added detailed examples and clarifications",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      image: null,
    },
    wordCount: 320,
    characterCount: 2100,
    isLatest: false,
  },
];

interface VersionsTimelineProps {
  noteId: string;
  limit?: number;
}

export function VersionsTimeline({
  noteId,
  limit = 10,
}: VersionsTimelineProps) {
  const { data: versions, isLoading, error } = useNoteVersions(noteId, limit);

  const finalVersions = versions || mockVersions;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || finalVersions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <GitBranch className="h-8 w-8 mx-auto mb-2" />
        <p>No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4" />
        <span className="font-medium">Version History</span>
        <Badge variant="secondary">{finalVersions.length}</Badge>
      </div>

      <div className="space-y-3">
        {finalVersions.map((version, index) => (
          <Card key={version.id} className="relative">
            {/* Timeline line */}
            {index < finalVersions.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
            )}

            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      version.isLatest
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      v{version.version}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{version.title}</h4>
                      {version.isLatest && (
                        <Badge variant="default" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {!version.isLatest && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {version.changeLog}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <span>by {version.createdBy.name}</span>
                    <span>{version.wordCount} words</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

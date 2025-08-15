import React, { useState } from "react";
import { Plus, Hash, X, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTags, useCreateTag } from "@/hooks/useTags";
import { toast } from "react-hot-toast";
import type { Tag } from "@/types";

const mockTags: Tag[] = [
  {
    id: "1",
    name: "javascript",
    color: "#F7DF1E",
    description: "JavaScript programming language",
    ownerId: "user-1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    _count: { noteTags: 25 },
  },
  {
    id: "2",
    name: "react",
    color: "#61DAFB",
    description: "React framework",
    ownerId: "user-1",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    _count: { noteTags: 18 },
  },
  {
    id: "3",
    name: "productivity",
    color: "#10B981",
    description: "Productivity tips and methods",
    ownerId: "user-1",
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    _count: { noteTags: 12 },
  },
];

interface TagsManagerProps {
  showCreateForm?: boolean;
  limit?: number;
}

export function TagsManager({
  showCreateForm = true,
  limit,
}: TagsManagerProps) {
  const [newTagName, setNewTagName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: tags, isLoading, error } = useTags();
  const createTag = useCreateTag();

  const finalTags = tags || mockTags;
  const displayTags = limit ? finalTags.slice(0, limit) : finalTags;

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag.mutateAsync({
        name: newTagName.trim(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      });
      setNewTagName("");
      setIsCreating(false);
      toast.success("Tag created successfully");
    } catch (error) {
      toast.error("Failed to create tag");
    }
  };

  const handleDeleteTag = (tagId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete tag:", tagId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Failed to load tags
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="font-medium">Tags</span>
          <Badge variant="secondary">{finalTags.length}</Badge>
        </div>

        {showCreateForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tag
          </Button>
        )}
      </div>

      {/* Create Tag Form */}
      {isCreating && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
                className="flex-1"
              />
              <Button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || createTag.isPending}
                size="sm"
              >
                Create
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCreating(false)}
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags List */}
      {displayTags.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Hash className="h-8 w-8 mx-auto mb-2" />
          <p>No tags created yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Most Used</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayTags
                .sort(
                  (a, b) =>
                    (b._count?.noteTags || 0) - (a._count?.noteTags || 0),
                )
                .slice(0, 10)
                .map((tag) => (
                  <div key={tag.id} className="group relative">
                    <Badge
                      variant="secondary"
                      className="pr-8 hover:pr-2 transition-all duration-200"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`,
                      }}
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag.name}
                      <span className="ml-2 text-xs opacity-70">
                        {tag._count?.noteTags || 0}
                      </span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -right-1 top-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          {/* All Tags */}
          {!limit && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">All Tags</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {finalTags.map((tag) => (
                  <Card key={tag.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-medium truncate">{tag.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {tag._count?.noteTags || 0}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {tag.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {tag.description}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Plus, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import type { Workspace } from "@/types";
import { WorkspaceCard } from "./WorkspaceCard";
import { WorkspaceEditor } from "./WorkspaceEditor";

const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Personal Notes",
    ownerId: "user-1",
    isDefault: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "2",
    name: "Work Projects",
    ownerId: "user-1",
    isDefault: false,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    name: "Research & Studies",
    ownerId: "user-1",
    isDefault: false,
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
  },
];

interface WorkspacesListProps {
  showCreateButton?: boolean;
}

export function WorkspacesList({
  showCreateButton = true,
}: WorkspacesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );

  const { data: workspaces, isLoading, error } = useWorkspaces();

  const finalWorkspaces = workspaces || mockWorkspaces;

  const filteredWorkspaces = finalWorkspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateWorkspace = () => {
    setIsCreating(true);
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    // TODO: Implement delete functionality
    console.log("Delete workspace:", workspace.id);
  };

  const handleSelectWorkspace = (workspace: Workspace) => {
    // TODO: Navigate to workspace or set as active
    console.log("Select workspace:", workspace.id);
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setEditingWorkspace(null);
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
              <CardContent className="p-6">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
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
          <p className="text-muted-foreground">
            Failed to load workspaces. Please try again.
          </p>
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
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {showCreateButton && (
          <Button onClick={handleCreateWorkspace} className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Workspace
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredWorkspaces.length} workspaces</span>
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first workspace to get started"}
            </p>
            {showCreateButton && !searchQuery && (
              <Button onClick={handleCreateWorkspace} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleEditWorkspace}
              onDelete={handleDeleteWorkspace}
              onSelect={handleSelectWorkspace}
            />
          ))}
        </div>
      )}

      {/* Workspace Editor Modal */}
      {(isCreating || editingWorkspace) && (
        <WorkspaceEditor
          workspace={editingWorkspace}
          isOpen={isCreating || !!editingWorkspace}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}

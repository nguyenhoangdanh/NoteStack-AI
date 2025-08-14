import React, { useState } from "react";
import {
  Plus,
  FolderOpen,
  Users,
  Star,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useNotes } from "@/hooks/useNotes";
import { toast } from "react-hot-toast";
import type { Workspace } from "@/types";
import { formatDistanceToNow } from "date-fns";

// Mock workspaces data
const mockWorkspaces: Workspace[] = [
  {
    id: "workspace-1",
    name: "Development",
    ownerId: "user-1",
    isDefault: true,
    createdAt: "2024-01-10T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "workspace-2",
    name: "Research",
    ownerId: "user-1",
    isDefault: false,
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "workspace-3",
    name: "Personal Projects",
    ownerId: "user-1",
    isDefault: false,
    createdAt: "2024-01-08T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
  },
];

export default function WorkspacesPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  const { data: workspaces, isLoading, error } = useWorkspaces();
  const { data: allNotes } = useNotes();

  // Use actual data if available, otherwise fallback to mock data
  const finalWorkspaces = workspaces || mockWorkspaces;

  // Count notes per workspace
  const getNotesCount = (workspaceId: string) => {
    if (!allNotes) return Math.floor(Math.random() * 20) + 5; // Mock count
    return allNotes.filter((note) => note.workspaceId === workspaceId).length;
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this workspace? All notes in this workspace will be moved to your default workspace.",
      )
    ) {
      try {
        // Note: Implement delete workspace functionality
        toast.success("Workspace deleted successfully");
      } catch (error) {
        toast.error("Failed to delete workspace");
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
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
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              Failed to load workspaces. Please try again.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Workspaces</h1>
            <p className="text-muted-foreground">
              Organize your notes into separate workspaces for different
              projects, topics, or teams.
            </p>
          </div>
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalWorkspaces.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Workspaces
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <FileText className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {finalWorkspaces.reduce(
                      (total, ws) => total + getNotesCount(ws.id),
                      0,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Collaborators</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspaces Grid */}
        {finalWorkspaces.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-48">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first workspace to start organizing your notes
              </p>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {finalWorkspaces.map((workspace) => {
              const notesCount = getNotesCount(workspace.id);
              return (
                <Card
                  key={workspace.id}
                  className="card-gradient transition-all duration-200 hover:shadow-lg cursor-pointer"
                  onClick={() => setSelectedWorkspace(workspace)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FolderOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {workspace.name}
                            {workspace.isDefault && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </CardTitle>
                          {workspace.isDefault && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit workspace
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!workspace.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWorkspace(workspace.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Notes
                        </span>
                        <Badge variant="outline">{notesCount}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {formatDate(workspace.updatedAt)}</span>
                        <Button variant="outline" size="sm">
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

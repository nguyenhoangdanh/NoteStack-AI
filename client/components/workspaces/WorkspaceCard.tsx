import React from "react";
import { MoreHorizontal, Users, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Workspace } from "@/types";
import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspace: Workspace) => void;
  onSelect?: (workspace: Workspace) => void;
}

export function WorkspaceCard({
  workspace,
  onEdit,
  onDelete,
  onSelect,
}: WorkspaceCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(workspace);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(workspace);
  };

  const handleSelect = () => {
    onSelect?.(workspace);
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        workspace.isDefault && "ring-2 ring-primary/20 bg-primary/5",
      )}
      onClick={handleSelect}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold truncate">
          {workspace.name}
          {workspace.isDefault && (
            <Star className="inline h-4 w-4 ml-2 text-yellow-500 fill-current" />
          )}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              Edit Workspace
            </DropdownMenuItem>
            {!workspace.isDefault && (
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                Delete Workspace
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              Created {new Date(workspace.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {workspace.isDefault && (
          <Badge variant="secondary" className="w-fit">
            Default Workspace
          </Badge>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Click to manage workspace</span>
        </div>
      </CardContent>
    </Card>
  );
}

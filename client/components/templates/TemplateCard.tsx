import React from "react";
import {
  MoreHorizontal,
  FileText,
  Globe,
  Lock,
  Copy,
  Eye,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Template } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onEdit?: (template: Template) => void;
  onDelete?: (template: Template) => void;
  onUse?: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
  onPreview?: (template: Template) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
  onUse,
  onDuplicate,
  onPreview,
}: TemplateCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(template);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(template);
  };

  const handleUse = () => {
    onUse?.(template);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.(template);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(template);
  };

  const usageCount = template.usage?.totalUses || 0;

  // Extract variables from content (simple pattern matching for {{variable}})
  const variables = [
    ...new Set(
      template.content
        .match(/\{\{(\w+)\}\}/g)
        ?.map((match) => match.slice(2, -2)) || [],
    ),
  ];

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] group"
      onClick={handleUse}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold truncate flex items-center gap-2">
            {template.name}
            {template.isPublic ? (
              <Globe className="h-4 w-4 text-blue-500" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {usageCount} {usageCount === 1 ? "use" : "uses"}
            </span>
            {variables.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {variables.length} variables
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUse}>
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              Edit Template
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              Delete Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Created {new Date(template.createdAt).toLocaleDateString()}
          </span>
          {template.isPublic && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Public</span>
            </div>
          )}
        </div>

        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {variables.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Variables:</div>
            <div className="flex flex-wrap gap-1">
              {variables.slice(0, 4).map((variable, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-mono"
                >
                  {`{{${variable}}}`}
                </Badge>
              ))}
              {variables.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{variables.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full btn-gradient mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleUse();
          }}
        >
          Use This Template
        </Button>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { MoreHorizontal, Hash, FileText, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onView?: (category: Category) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  onView,
}: CategoryCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(category);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(category);
  };

  const handleView = () => {
    onView?.(category);
  };

  const noteCount = category._count?.noteCategories || 0;

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] group"
      onClick={handleView}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {category.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {category.isAuto && (
                <Badge variant="secondary" className="text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  Auto
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {noteCount} {noteCount === 1 ? "note" : "notes"}
              </span>
            </div>
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
            <DropdownMenuItem onClick={handleView}>
              <FileText className="h-4 w-4 mr-2" />
              View Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>
              Created {new Date(category.createdAt).toLocaleDateString()}
            </span>
          </div>
          {category.confidence && (
            <Badge variant="outline" className="text-xs">
              {Math.round(category.confidence * 100)}% confidence
            </Badge>
          )}
        </div>

        {category.keywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span>Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {category.keywords.slice(0, 4).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {category.keywords.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{category.keywords.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

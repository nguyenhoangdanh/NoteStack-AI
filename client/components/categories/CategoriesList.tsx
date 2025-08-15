import React, { useState } from "react";
import { Plus, Search, Tag, Bot, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCategories, useAutoCategorizeNote } from "@/hooks/useCategories";
import type { Category } from "@/types";
import { CategoryCard } from "./CategoryCard";
import { CategoryEditor } from "./CategoryEditor";

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Work",
    description: "Professional notes and tasks",
    color: "#3B82F6",
    icon: "💼",
    keywords: ["work", "office", "business", "professional"],
    ownerId: "user-1",
    isAuto: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    _count: { noteCategories: 12 },
  },
  {
    id: "2",
    name: "Personal",
    description: "Personal thoughts and ideas",
    color: "#10B981",
    icon: "🏠",
    keywords: ["personal", "diary", "thoughts", "ideas"],
    ownerId: "user-1",
    isAuto: true,
    confidence: 0.85,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    _count: { noteCategories: 8 },
  },
  {
    id: "3",
    name: "Research",
    description: "Academic and research notes",
    color: "#8B5CF6",
    icon: "🔬",
    keywords: ["research", "academic", "study", "analysis"],
    ownerId: "user-1",
    isAuto: false,
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    _count: { noteCategories: 5 },
  },
];

interface CategoriesListProps {
  showCreateButton?: boolean;
  includeAuto?: boolean;
}

export function CategoriesList({ 
  showCreateButton = true,
  includeAuto = true 
}: CategoriesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutoOnly, setShowAutoOnly] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading, error } = useCategories(includeAuto);
  const autoCategorize = useAutoCategorizeNote();

  const finalCategories = categories || mockCategories;

  const filteredCategories = finalCategories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAutoFilter = !showAutoOnly || category.isAuto;
    
    return matchesSearch && matchesAutoFilter;
  });

  const handleCreateCategory = () => {
    setIsCreating(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (category: Category) => {
    // TODO: Implement delete functionality
    console.log("Delete category:", category.id);
  };

  const handleViewCategory = (category: Category) => {
    // TODO: Navigate to category notes view
    console.log("View category:", category.id);
  };

  const handleAutoCategorize = async () => {
    try {
      // TODO: This would need a global auto-categorize hook
      console.log("Auto-categorize all notes");
    } catch (error) {
      console.error("Auto-categorize failed:", error);
    }
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  const autoCategories = finalCategories.filter(c => c.isAuto);
  const manualCategories = finalCategories.filter(c => !c.isAuto);

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
            Failed to load categories. Please try again.
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
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-only"
              checked={showAutoOnly}
              onCheckedChange={setShowAutoOnly}
            />
            <Label htmlFor="auto-only" className="text-sm">
              Auto-generated only
            </Label>
          </div>
          
          <Button
            variant="outline"
            onClick={handleAutoCategorize}
            disabled={autoCategorize.isPending}
            className="text-sm"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Auto-categorize
          </Button>
          
          {showCreateButton && (
            <Button onClick={handleCreateCategory} className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredCategories.length} categories</span>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Bot className="h-3 w-3" />
          {autoCategories.length} auto-generated
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          {manualCategories.length} manual
        </Badge>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first category to start organizing your notes"}
            </p>
            {showCreateButton && !searchQuery && (
              <div className="flex gap-2">
                <Button onClick={handleCreateCategory} className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAutoCategorize}
                  disabled={autoCategorize.isPending}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Auto-categorize
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onView={handleViewCategory}
            />
          ))}
        </div>
      )}

      {/* Category Editor Modal */}
      {(isCreating || editingCategory) && (
        <CategoryEditor
          category={editingCategory}
          isOpen={isCreating || !!editingCategory}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}

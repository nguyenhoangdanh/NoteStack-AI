import React, { useState } from "react";
import { Plus, Search, FileText, Globe, Lock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplates } from "@/hooks/useTemplates";
import type { Template } from "@/types";
import { TemplateCard } from "./TemplateCard";
import { TemplateEditor } from "./TemplateEditor";

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Meeting Notes",
    description:
      "Structured template for meeting notes with participants, agenda, and action items",
    content: `# Meeting Notes - {{title}}

**Date:** {{date}}
**Participants:** {{participants}}

## Agenda
{{agenda}}

## Discussion Points
{{discussion}}

## Action Items
{{actionItems}}

## Next Steps
{{nextSteps}}`,
    tags: ["meeting", "business", "notes"],
    isPublic: true,
    ownerId: "user-1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    usage: { totalUses: 45 },
  },
  {
    id: "2",
    name: "Project Planning",
    description:
      "Comprehensive project planning template with goals, timeline, and resources",
    content: `# Project Plan: {{projectName}}

## Overview
{{overview}}

## Goals
{{goals}}

## Timeline
**Start Date:** {{startDate}}
**End Date:** {{endDate}}

## Resources
{{resources}}

## Milestones
{{milestones}}

## Risks
{{risks}}`,
    tags: ["project", "planning", "management"],
    isPublic: false,
    ownerId: "user-1",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    usage: { totalUses: 23 },
  },
  {
    id: "3",
    name: "Daily Journal",
    description:
      "Personal daily journal template for reflection and goal tracking",
    content: `# Daily Journal - {{date}}

## Today's Highlights
{{highlights}}

## Accomplishments
{{accomplishments}}

## Challenges
{{challenges}}

## Tomorrow's Goals
{{tomorrowGoals}}

## Reflections
{{reflections}}`,
    tags: ["journal", "personal", "reflection"],
    isPublic: true,
    ownerId: "user-1",
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    usage: { totalUses: 67 },
  },
];

interface TemplatesListProps {
  showCreateButton?: boolean;
  isPublic?: boolean;
}

export function TemplatesList({
  showCreateButton = true,
  isPublic,
}: TemplatesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPublicOnly, setShowPublicOnly] = useState(isPublic || false);
  const [sortBy, setSortBy] = useState("recent");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const { data: templates, isLoading, error } = useTemplates(isPublic);

  const finalTemplates = templates || mockTemplates;

  const filteredTemplates = finalTemplates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesVisibility = !showPublicOnly || template.isPublic;

      return matchesSearch && matchesVisibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "usage":
          return (b.usage?.totalUses || 0) - (a.usage?.totalUses || 0);
        case "recent":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

  const handleCreateTemplate = () => {
    setIsCreating(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (template: Template) => {
    // TODO: Implement delete functionality
    console.log("Delete template:", template.id);
  };

  const handleUseTemplate = (template: Template) => {
    // TODO: Navigate to note creation with template
    console.log("Use template:", template.id);
  };

  const handleDuplicateTemplate = (template: Template) => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate template:", template.id);
  };

  const handlePreviewTemplate = (template: Template) => {
    // TODO: Implement preview functionality
    console.log("Preview template:", template.id);
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const publicTemplates = finalTemplates.filter((t) => t.isPublic);
  const privateTemplates = finalTemplates.filter((t) => !t.isPublic);

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
            Failed to load templates. Please try again.
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isPublic && (
            <div className="flex items-center space-x-2">
              <Switch
                id="public-only"
                checked={showPublicOnly}
                onCheckedChange={setShowPublicOnly}
              />
              <Label htmlFor="public-only" className="text-sm">
                Public only
              </Label>
            </div>
          )}

          {showCreateButton && (
            <Button onClick={handleCreateTemplate} className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredTemplates.length} templates</span>
        {!isPublic && (
          <>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {publicTemplates.length} public
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {privateTemplates.length} private
            </Badge>
          </>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first template to get started"}
            </p>
            {showCreateButton && !searchQuery && (
              <Button onClick={handleCreateTemplate} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onUse={handleUseTemplate}
              onDuplicate={handleDuplicateTemplate}
              onPreview={handlePreviewTemplate}
            />
          ))}
        </div>
      )}

      {/* Template Editor Modal */}
      {(isCreating || editingTemplate) && (
        <TemplateEditor
          template={editingTemplate}
          isOpen={isCreating || !!editingTemplate}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}

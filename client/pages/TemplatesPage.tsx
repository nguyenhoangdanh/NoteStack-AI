import React, { useState } from 'react';
import { Plus, FileTemplate, Star, Copy, Edit, Trash2, Search, Filter, Globe, Lock } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTemplates, useDeleteTemplate } from '@/hooks/useTemplates';
import { toast } from 'react-hot-toast';
import type { Template } from '@/types';

// Mock templates data
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    description: 'Structured template for meeting notes with agenda, attendees, and action items',
    content: `# Meeting Notes - {{date}}

## Attendees
- {{attendees}}

## Agenda
1. {{agenda_item_1}}
2. {{agenda_item_2}}
3. {{agenda_item_3}}

## Discussion Points
{{discussion}}

## Action Items
- [ ] {{action_1}} - Due: {{due_date_1}}
- [ ] {{action_2}} - Due: {{due_date_2}}

## Next Steps
{{next_steps}}`,
    isPublic: true,
    usageCount: 45,
    tags: ['meeting', 'work', 'productivity'],
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    creator: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: '2',
    name: 'Project Planning',
    description: 'Comprehensive template for project planning and tracking',
    content: `# Project: {{project_name}}

## Overview
**Start Date:** {{start_date}}
**End Date:** {{end_date}}
**Status:** {{status}}
**Priority:** {{priority}}

## Objectives
{{objectives}}

## Scope
### In Scope
- {{in_scope_1}}
- {{in_scope_2}}

### Out of Scope
- {{out_scope_1}}
- {{out_scope_2}}

## Milestones
- [ ] {{milestone_1}} - {{date_1}}
- [ ] {{milestone_2}} - {{date_2}}
- [ ] {{milestone_3}} - {{date_3}}

## Resources
**Team:** {{team_members}}
**Budget:** {{budget}}
**Tools:** {{tools}}

## Risks & Mitigation
{{risks}}`,
    isPublic: true,
    usageCount: 32,
    tags: ['project', 'planning', 'management'],
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    creator: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: '3',
    name: 'Research Notes',
    description: 'Academic research template with citations and methodology',
    content: `# Research Notes: {{topic}}

## Research Question
{{research_question}}

## Methodology
{{methodology}}

## Key Findings
1. {{finding_1}}
2. {{finding_2}}
3. {{finding_3}}

## Sources
### Primary Sources
- {{primary_source_1}}
- {{primary_source_2}}

### Secondary Sources
- {{secondary_source_1}}
- {{secondary_source_2}}

## Quotes & Citations
> "{{quote_1}}" - {{citation_1}}
> "{{quote_2}}" - {{citation_2}}

## Analysis
{{analysis}}

## Conclusions
{{conclusions}}

## Further Research
{{further_research}}`,
    isPublic: false,
    usageCount: 18,
    tags: ['research', 'academic', 'citations'],
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
    creator: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { data: publicTemplates, isLoading: publicLoading } = useTemplates(true);
  const { data: allTemplates, isLoading: allLoading } = useTemplates();
  const deleteTemplate = useDeleteTemplate();

  // Use actual data if available, otherwise fallback to mock data
  const templates = allTemplates || mockTemplates;

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'public' && template.isPublic) ||
                         (filter === 'private' && !template.isPublic);

    return matchesSearch && matchesFilter;
  });

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(templateId);
        toast.success('Template deleted successfully');
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  const handleUseTemplate = (template: Template) => {
    // Copy template content to clipboard and show notification
    navigator.clipboard.writeText(template.content);
    toast.success(`Template "${template.name}" copied to clipboard`);
  };

  const isLoading = publicLoading || allLoading;

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
                  <Skeleton className="h-20 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
              <FileTemplate className="h-8 w-8" />
              Templates
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and use note templates to streamline your workflow
            </p>
          </div>
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
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
              <div className="flex gap-2">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileTemplate className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{templates.length}</p>
                  <p className="text-sm text-muted-foreground">Total Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Globe className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {templates.filter(t => t.isPublic).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Public Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Star className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Uses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-48">
              <FileTemplate className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Create your first template to get started'}
              </p>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="card-gradient transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {template.name}
                        {template.isPublic ? (
                          <Globe className="h-4 w-4 text-success" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Content Preview */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-mono text-muted-foreground line-clamp-3">
                      {template.content.substring(0, 150)}...
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{template.usageCount} uses</span>
                    </div>
                    <span>
                      by {template.creator.name}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 btn-gradient"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Popular Templates Section */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              Most Popular Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates
                .sort((a, b) => b.usageCount - a.usageCount)
                .slice(0, 5)
                .map((template, index) => (
                  <div 
                    key={template.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.usageCount} uses
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

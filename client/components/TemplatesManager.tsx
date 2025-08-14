import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    FileTextIcon,
    PlusIcon,
    SearchIcon,
    LayoutTemplateIcon,
    CopyIcon,
    EditIcon,
    TrashIcon,
    MoreHorizontalIcon,
    StarIcon,
    ClockIcon,
    UsersIcon,
    FolderIcon,
    SparklesIcon
} from 'lucide-react';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    content: string;
    tags: string[];
    isPublic: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
    isFavorite: boolean;
}

export function TemplatesManager() {
    const [activeTab, setActiveTab] = useState('my-templates');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock templates data
    const templates: Template[] = [
        {
            id: '1',
            name: 'Meeting Notes',
            description: 'Standard template for meeting notes with agenda and action items',
            category: 'Work',
            content: `# Meeting Notes - [Date]\n\n## Attendees\n- \n\n## Agenda\n1. \n\n## Discussion Points\n\n## Action Items\n- [ ] \n\n## Next Meeting\n`,
            tags: ['meeting', 'work', 'agenda'],
            isPublic: true,
            usageCount: 23,
            createdAt: '2024-01-10T10:00:00Z',
            updatedAt: '2024-01-15T14:30:00Z',
            isFavorite: true
        },
        {
            id: '2',
            name: 'Project Planning',
            description: 'Comprehensive project planning template with milestones and resources',
            category: 'Planning',
            content: `# Project Plan: [Project Name]\n\n## Overview\n\n## Objectives\n- \n\n## Milestones\n\n## Resources\n\n## Timeline\n\n## Risks\n`,
            tags: ['project', 'planning', 'milestones'],
            isPublic: false,
            usageCount: 12,
            createdAt: '2024-01-05T09:00:00Z',
            updatedAt: '2024-01-12T16:20:00Z',
            isFavorite: false
        },
        {
            id: '3',
            name: 'Code Review',
            description: 'Template for documenting code review findings and suggestions',
            category: 'Development',
            content: `# Code Review: [PR/Branch Name]\n\n## Summary\n\n## Files Reviewed\n- \n\n## Findings\n### Issues\n- \n\n### Suggestions\n- \n\n## Approval Status\n- [ ] Approved\n- [ ] Needs Changes\n`,
            tags: ['code-review', 'development', 'quality'],
            isPublic: true,
            usageCount: 8,
            createdAt: '2024-01-08T11:00:00Z',
            updatedAt: '2024-01-14T13:45:00Z',
            isFavorite: true
        },
        {
            id: '4',
            name: 'Weekly Report',
            description: 'Weekly status report template for team updates',
            category: 'Reports',
            content: `# Weekly Report - Week of [Date]\n\n## Completed This Week\n- \n\n## In Progress\n- \n\n## Planned for Next Week\n- \n\n## Blockers\n- \n\n## Metrics\n`,
            tags: ['report', 'weekly', 'status'],
            isPublic: false,
            usageCount: 15,
            createdAt: '2024-01-12T08:00:00Z',
            updatedAt: '2024-01-16T10:15:00Z',
            isFavorite: false
        }
    ];

    const categories = Array.from(new Set(templates.map(t => t.category)));
    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Templates</h2>
                    <p className="text-muted-foreground">Create and manage note templates</p>
                </div>
                <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="my-templates">My Templates</TabsTrigger>
                    <TabsTrigger value="public">Public Gallery</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>

                <TabsContent value="my-templates" className="space-y-6">
                    {/* Search and Filter */}
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select className="px-3 py-2 border rounded-md">
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTemplates.map((template) => (
                            <Card key={template.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                {template.isFavorite && (
                                                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                                )}
                                            </div>
                                            <CardDescription className="mt-1">
                                                {template.description}
                                            </CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Template Preview */}
                                    <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono text-xs max-h-24 overflow-hidden">
                                        <pre className="whitespace-pre-wrap">{template.content.substring(0, 150)}...</pre>
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
                                                +{template.tags.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-3">
                                            <Badge variant="outline">{template.category}</Badge>
                                            <span className="flex items-center space-x-1">
                                                <CopyIcon className="h-3 w-3" />
                                                <span>{template.usageCount}</span>
                                            </span>
                                        </div>
                                        <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <Button size="sm" className="flex-1">
                                            <CopyIcon className="h-4 w-4 mr-1" />
                                            Use Template
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <EditIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <StarIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="public" className="space-y-6">
                    <div className="text-center py-8">
                        <LayoutTemplateIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Public Template Gallery</h3>
                        <p className="text-muted-foreground mb-4">
                            Discover and use templates shared by the community
                        </p>
                        <Button variant="outline">
                            Browse Public Templates
                        </Button>
                    </div>

                    {/* Featured Templates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Featured Community Templates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        name: "Daily Standup",
                                        author: "DevTeam",
                                        downloads: 1250,
                                        rating: 4.8,
                                        description: "Perfect template for daily standup meetings"
                                    },
                                    {
                                        name: "Bug Report",
                                        author: "QA Team",
                                        downloads: 890,
                                        rating: 4.6,
                                        description: "Comprehensive bug report template"
                                    },
                                    {
                                        name: "1:1 Meeting",
                                        author: "Management",
                                        downloads: 1100,
                                        rating: 4.9,
                                        description: "Structure for one-on-one meetings"
                                    },
                                    {
                                        name: "Learning Notes",
                                        author: "Educators",
                                        downloads: 750,
                                        rating: 4.7,
                                        description: "Template for educational content"
                                    }
                                ].map((template, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{template.name}</h4>
                                            <div className="flex items-center space-x-1">
                                                <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                                                <span className="text-xs">{template.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{template.description}</p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>by {template.author}</span>
                                            <span>{template.downloads} downloads</span>
                                        </div>
                                        <Button size="sm" variant="outline" className="w-full">
                                            Download Template
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => {
                            const categoryTemplates = templates.filter(t => t.category === category);
                            const totalUsage = categoryTemplates.reduce((sum, t) => sum + t.usageCount, 0);

                            return (
                                <Card key={category}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center space-x-2">
                                            <FolderIcon className="h-5 w-5 text-blue-600" />
                                            <CardTitle className="text-base">{category}</CardTitle>
                                        </div>
                                        <CardDescription>
                                            {categoryTemplates.length} template{categoryTemplates.length !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            {categoryTemplates.slice(0, 3).map((template) => (
                                                <div key={template.id} className="flex items-center justify-between">
                                                    <span className="text-sm truncate">{template.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {template.usageCount}
                                                    </Badge>
                                                </div>
                                            ))}
                                            {categoryTemplates.length > 3 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{categoryTemplates.length - 3} more templates
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-2 border-t">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Total usage</span>
                                                <span>{totalUsage}</span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="w-full">
                                            View Category
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="space-y-6">
                    {templates.filter(t => t.isFavorite).length === 0 ? (
                        <div className="text-center py-12">
                            <StarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Favorite Templates</h3>
                            <p className="text-muted-foreground mb-4">
                                Star templates to add them to your favorites for quick access
                            </p>
                            <Button variant="outline">
                                Browse Templates
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.filter(t => t.isFavorite).map((template) => (
                                <Card key={template.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                                </div>
                                                <CardDescription className="mt-1">
                                                    {template.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <Badge variant="outline">{template.category}</Badge>
                                            <span className="text-muted-foreground">
                                                Used {template.usageCount} times
                                            </span>
                                        </div>
                                        <Button size="sm" className="w-full">
                                            <CopyIcon className="h-4 w-4 mr-2" />
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

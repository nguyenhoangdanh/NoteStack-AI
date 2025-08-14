import React, { useState } from 'react';
import { Note } from '../types/api.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TagIcon, 
  PlusIcon, 
  SearchIcon,
  TrendingUpIcon,
  HashIcon,
  BarChart3Icon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
  SparklesIcon
} from 'lucide-react';

interface TagsManagerProps {
  notes: Note[];
  onNotesUpdate: (notes: Note[]) => void;
}

export function TagsManager({ notes, onNotesUpdate }: TagsManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newTagName, setNewTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate tag statistics
  const allTags = notes.flatMap(note => note.tags || []);
  const tagFrequency = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);

  const totalTags = Object.keys(tagFrequency).length;
  const avgTagsPerNote = notes.length > 0 ? (allTags.length / notes.length).toFixed(1) : '0';

  // Mock tag colors and categories
  const tagColors = {
    'react': '#61DAFB',
    'javascript': '#F7DF1E',
    'typescript': '#3178C6',
    'css': '#1572B6',
    'html': '#E34F26',
    'nodejs': '#339933',
    'python': '#3776AB',
    'work': '#F59E0B',
    'personal': '#8B5CF6',
    'learning': '#10B981',
    'project': '#EF4444',
    'meeting': '#6366F1'
  };

  const getTagColor = (tag: string) => {
    return tagColors[tag.toLowerCase() as keyof typeof tagColors] || '#6B7280';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tags Management</h2>
          <p className="text-muted-foreground">Organize and manage your note tags</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all-tags">All Tags</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="cleanup">Cleanup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{totalTags}</div>
                    <div className="text-sm text-muted-foreground">Total tags</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3Icon className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{avgTagsPerNote}</div>
                    <div className="text-sm text-muted-foreground">Avg per note</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUpIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{topTags[0]?.[1] || 0}</div>
                    <div className="text-sm text-muted-foreground">Most used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <HashIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{Object.values(tagFrequency).filter(count => count === 1).length}</div>
                    <div className="text-sm text-muted-foreground">Used once</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Popular Tags</CardTitle>
              <CardDescription>Your most frequently used tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topTags.slice(0, 15).map(([tag, count]) => (
                  <div 
                    key={tag}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border"
                    style={{ borderColor: getTagColor(tag) + '40', backgroundColor: getTagColor(tag) + '10' }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getTagColor(tag) }}
                    ></div>
                    <span className="font-medium text-sm">{tag}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate tag suggestions
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Find unused tags
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Rename similar tags
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tag Categories</CardTitle>
                <CardDescription>Organize tags by categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { category: 'Technology', count: 12, color: '#3B82F6' },
                    { category: 'Work', count: 8, color: '#F59E0B' },
                    { category: 'Personal', count: 5, color: '#8B5CF6' },
                    { category: 'Learning', count: 7, color: '#10B981' }
                  ].map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        <span className="text-sm">{cat.category}</span>
                      </div>
                      <Badge variant="outline">{cat.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all-tags" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Tag</th>
                      <th className="text-left p-4 font-medium">Usage</th>
                      <th className="text-left p-4 font-medium">Last Used</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTags
                      .filter(([tag]) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(([tag, count]) => (
                      <tr key={tag} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getTagColor(tag) }}
                            ></div>
                            <span className="font-medium">{tag}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{count} notes</Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          2 days ago
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Tag Suggestions</CardTitle>
              <CardDescription>Smart tag recommendations based on your notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    note: "React Performance Optimization Guide",
                    currentTags: ["react", "performance"],
                    suggestedTags: ["optimization", "hooks", "memoization"]
                  },
                  {
                    note: "Team Meeting Q4 Planning",
                    currentTags: ["meeting"],
                    suggestedTags: ["planning", "q4", "goals", "team"]
                  },
                  {
                    note: "Machine Learning Research Notes",
                    currentTags: ["ml"],
                    suggestedTags: ["research", "ai", "neural-networks", "deep-learning"]
                  }
                ].map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">{suggestion.note}</h4>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Current tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.currentTags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Suggested tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.suggestedTags.map((tag) => (
                            <Button 
                              key={tag} 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-xs"
                            >
                              + {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Apply All</Button>
                      <Button variant="ghost" size="sm">Dismiss</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button className="w-full">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate More Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tag Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Tag usage chart would go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tag Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tag1: "react", tag2: "javascript", correlation: 0.89 },
                    { tag1: "work", tag2: "meeting", correlation: 0.76 },
                    { tag1: "learning", tag2: "tutorial", correlation: 0.82 }
                  ].map((rel, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{rel.tag1}</Badge>
                        <span className="text-muted-foreground">+</span>
                        <Badge variant="outline">{rel.tag2}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(rel.correlation * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tag Cleanup</CardTitle>
              <CardDescription>Clean up and organize your tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Remove unused tags ({Object.values(tagFrequency).filter(count => count === 1).length})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Merge similar tags (5 pairs found)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Normalize tag casing
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Similar Tags to Merge</h4>
                <div className="space-y-2">
                  {[
                    { tags: ["Javascript", "javascript", "JS"], suggestion: "javascript" },
                    { tags: ["Meeting", "meeting", "meetings"], suggestion: "meeting" },
                    { tags: ["todo", "TODO", "To-do"], suggestion: "todo" }
                  ].map((merge, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {merge.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Merge into: <span className="font-medium">{merge.suggestion}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Merge</Button>
                        <Button variant="ghost" size="sm">Skip</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

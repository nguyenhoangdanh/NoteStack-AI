import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  SparklesIcon, 
  BrainIcon, 
  LinkIcon, 
  TagIcon,
  FileTextIcon,
  TrendingUpIcon,
  SearchIcon,
  CopyIcon
} from 'lucide-react';
import { Note } from '../types';

interface SmartFeaturesProps {
  notes: Note[];
  onNotesUpdate: (notes: Note[]) => void;
}

export function SmartFeatures({ notes, onNotesUpdate }: SmartFeaturesProps) {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
          <TabsTrigger value="summaries">Summaries</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Smart Categories</h3>
              <p className="text-sm text-muted-foreground">AI-powered note organization and categorization</p>
            </div>
            <Button>
              <TagIcon className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manual Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <TagIcon className="h-4 w-4" />
                  <span>Your Categories</span>
                </CardTitle>
                <CardDescription>Manually created categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Technology", icon: "💻", color: "#3B82F6", count: 12, isAuto: false },
                  { name: "Personal", icon: "👤", color: "#8B5CF6", count: 8, isAuto: false },
                  { name: "Work", icon: "💼", color: "#F59E0B", count: 5, isAuto: false },
                  { name: "Research", icon: "📚", color: "#10B981", count: 7, isAuto: false }
                ].map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <span className="font-medium text-sm">{category.name}</span>
                        <p className="text-xs text-muted-foreground">
                          {category.count} notes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{category.count}</Badge>
                      <Button variant="ghost" size="sm">⋯</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Categories
                </Button>
              </CardContent>
            </Card>

            {/* Auto Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4" />
                  <span>AI-Generated Categories</span>
                </CardTitle>
                <CardDescription>Categories automatically detected by AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Machine Learning", icon: "🧠", confidence: 0.87, count: 5, keywords: ["ml", "ai", "neural"] },
                  { name: "Frontend Development", icon: "🎨", confidence: 0.92, count: 8, keywords: ["react", "css", "ui"] },
                  { name: "Project Management", icon: "📋", confidence: 0.75, count: 3, keywords: ["planning", "tasks"] }
                ].map((category) => (
                  <div key={category.name} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <span className="font-medium text-sm">{category.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.round(category.confidence * 100)}% confidence
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {category.count} notes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Accept
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <BrainIcon className="h-4 w-4 mr-2" />
                  Generate More Categories
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Category Suggestions for Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Uncategorized Notes</CardTitle>
              <CardDescription>Notes that could benefit from categorization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "React Hooks Best Practices",
                    content: "A comprehensive guide to using React hooks effectively...",
                    suggestions: ["Technology", "Frontend Development"]
                  },
                  {
                    title: "Team Meeting Notes - Q4 Planning",
                    content: "Discussed goals for Q4, resource allocation, and timeline...",
                    suggestions: ["Work", "Project Management"]
                  },
                  {
                    title: "Weekend Reading List",
                    content: "Books I want to read during the weekend...",
                    suggestions: ["Personal", "Learning"]
                  }
                ].map((note, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">{note.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {note.content}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Suggested:</span>
                        {note.suggestions.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Apply All Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Duplicate Detection</h3>
              <p className="text-sm text-muted-foreground">Find and manage similar or duplicate notes</p>
            </div>
            <Button>
              <SearchIcon className="h-4 w-4 mr-2" />
              Scan for Duplicates
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <CopyIcon className="h-4 w-4" />
                  <span>Detection Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">3</div>
                  <p className="text-sm text-muted-foreground">Potential duplicates</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">High similarity</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medium similarity</span>
                    <Badge variant="secondary">1</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total notes scanned</span>
                    <span>{notes.length}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Detection Report
                </Button>
              </CardContent>
            </Card>

            {/* Merge Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Merge Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BrainIcon className="h-4 w-4 mr-2" />
                    Smart Merge (AI)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Manual Review
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link Instead of Merge
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Merge preferences:
                  </p>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2 text-xs">
                      <input type="checkbox" defaultChecked />
                      <span>Preserve all tags</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs">
                      <input type="checkbox" defaultChecked />
                      <span>Keep creation dates</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs">
                      <input type="checkbox" />
                      <span>Auto-delete originals</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full" variant="destructive">
                  Merge All High Similarity
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Review Medium Similarity
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Ignore All Low Similarity
                </Button>
                <div className="pt-2 border-t">
                  <Button size="sm" className="w-full" variant="ghost">
                    Schedule Weekly Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Duplicate Pairs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Found Duplicates</CardTitle>
              <CardDescription>Review and manage similar notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    similarity: 0.94,
                    note1: { title: "React Development Guide", content: "A comprehensive guide to React development with hooks and state management...", tags: ["react", "development"] },
                    note2: { title: "React Development Tutorial", content: "Complete tutorial for React development including hooks, state, and best practices...", tags: ["react", "tutorial"] }
                  },
                  {
                    similarity: 0.89,
                    note1: { title: "Meeting Notes - Q4 Planning", content: "Quarterly planning meeting discussing goals and objectives for Q4...", tags: ["meeting", "planning"] },
                    note2: { title: "Q4 Planning Meeting", content: "Meeting notes from Q4 planning session covering goals and timeline...", tags: ["meeting", "q4"] }
                  },
                  {
                    similarity: 0.76,
                    note1: { title: "JavaScript Best Practices", content: "List of best practices for JavaScript development...", tags: ["javascript", "best-practices"] },
                    note2: { title: "JS Coding Guidelines", content: "Guidelines and best practices for JavaScript coding standards...", tags: ["javascript", "guidelines"] }
                  }
                ].map((duplicate, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={duplicate.similarity > 0.9 ? "destructive" : duplicate.similarity > 0.8 ? "default" : "secondary"}
                        >
                          {Math.round(duplicate.similarity * 100)}% similar
                        </Badge>
                        <span className="text-sm text-muted-foreground">Duplicate pair {index + 1}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Merge</Button>
                        <Button variant="ghost" size="sm">Ignore</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{duplicate.note1.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {duplicate.note1.content}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {duplicate.note1.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{duplicate.note2.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {duplicate.note2.content}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {duplicate.note2.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relations" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Note Relations</h3>
              <p className="text-sm text-muted-foreground">Discover connections and build your knowledge graph</p>
            </div>
            <Button>
              <BrainIcon className="h-4 w-4 mr-2" />
              Analyze Relations
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>Connection Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">47</div>
                    <p className="text-sm text-muted-foreground">Total connections</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <p className="text-sm text-muted-foreground">Strong relations</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Most connected note</span>
                    <span className="font-medium">React Development Guide</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average connections</span>
                    <span>2.3 per note</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Knowledge clusters</span>
                    <span>5 identified</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUpIcon className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Knowledge Graph Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Knowledge Graph</CardTitle>
                <CardDescription>Visual representation of your knowledge network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-0.5"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-center space-x-1">
                      <div className="w-1 h-8 bg-gray-300"></div>
                      <div className="w-1 h-6 bg-gray-300 mt-1"></div>
                      <div className="w-1 h-8 bg-gray-300"></div>
                    </div>
                    <p className="text-sm text-muted-foreground">Interactive graph preview</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    Open Full Graph View
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Export as Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Connected Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Connected Notes</CardTitle>
              <CardDescription>Notes with the strongest relationships in your knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "React Development Guide",
                    connections: 8,
                    strongConnections: 3,
                    relatedTopics: ["JavaScript", "Frontend", "Hooks", "State Management"],
                    lastUpdated: "2 days ago"
                  },
                  {
                    title: "Machine Learning Fundamentals",
                    connections: 6,
                    strongConnections: 2,
                    relatedTopics: ["AI", "Python", "Data Science", "Neural Networks"],
                    lastUpdated: "1 week ago"
                  },
                  {
                    title: "Project Management Best Practices",
                    connections: 5,
                    strongConnections: 4,
                    relatedTopics: ["Agile", "Scrum", "Leadership", "Planning"],
                    lastUpdated: "3 days ago"
                  },
                  {
                    title: "Database Design Patterns",
                    connections: 4,
                    strongConnections: 1,
                    relatedTopics: ["SQL", "NoSQL", "Architecture", "Performance"],
                    lastUpdated: "5 days ago"
                  }
                ].map((note, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{note.title}</h4>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{note.connections} connections</span>
                            <span>{note.strongConnections} strong</span>
                            <span>Updated {note.lastUpdated}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {note.relatedTopics.slice(0, 4).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {note.relatedTopics.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.relatedTopics.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Connected Notes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Connections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <SparklesIcon className="h-4 w-4" />
                <span>Suggested Connections</span>
              </CardTitle>
              <CardDescription>AI-detected potential relationships between your notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    note1: "React Performance Optimization",
                    note2: "Web Vitals Guide",
                    similarity: 0.78,
                    reason: "Both discuss performance metrics and optimization techniques"
                  },
                  {
                    note1: "TypeScript Best Practices",
                    note2: "React Development Guide",
                    similarity: 0.85,
                    reason: "Common patterns in React TypeScript development"
                  },
                  {
                    note1: "Microservices Architecture",
                    note2: "API Design Principles",
                    similarity: 0.72,
                    reason: "Related architectural concepts and API design"
                  }
                ].map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {Math.round(suggestion.similarity * 100)}% similarity
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Connect</Button>
                        <Button variant="ghost" size="sm">Ignore</Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">{suggestion.note1}</span>
                      <LinkIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{suggestion.note2}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <BrainIcon className="h-4 w-4 mr-2" />
                  Find More Connections
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI Summaries</h3>
              <p className="text-sm text-muted-foreground">Generate and manage AI-powered note summaries</p>
            </div>
            <Button>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Generate Summaries
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <FileTextIcon className="h-4 w-4" />
                  <span>Summary Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{Math.floor(notes.length * 0.6)}</div>
                  <p className="text-sm text-muted-foreground">Notes with summaries</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <Badge variant="secondary">{Math.floor(notes.length * 0.6)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <Badge variant="outline">{Math.floor(notes.length * 0.4)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing</span>
                    <Badge variant="default">2</Badge>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">60% complete</p>
                </div>
              </CardContent>
            </Card>

            {/* Summary Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary Templates</CardTitle>
                <CardDescription>Different styles for different purposes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Executive Summary", description: "Key points for leadership", icon: "📊" },
                  { name: "Academic Summary", description: "Scholarly format with citations", icon: "🎓" },
                  { name: "Key Points", description: "Bullet points of main ideas", icon: "🔑" },
                  { name: "Action Items", description: "Focus on tasks and next steps", icon: "✅" },
                  { name: "Technical Summary", description: "Technical details and specs", icon: "⚙️" }
                ].map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{template.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full">
                  Generate All Missing
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Regenerate Recent
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Bulk Export Summaries
                </Button>
                <div className="pt-2 border-t space-y-2">
                  <Button size="sm" variant="ghost" className="w-full">
                    Configure Templates
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full">
                    Summary Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Summaries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Summaries</CardTitle>
              <CardDescription>Latest AI-generated summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    noteTitle: "React Performance Optimization",
                    summaryType: "Technical Summary",
                    summary: "Comprehensive guide covering React performance optimization techniques including memoization, lazy loading, code splitting, and bundle analysis. Key recommendations: use React.memo for components, implement useMemo for expensive calculations, and optimize re-renders through proper state management.",
                    generatedAt: "2 hours ago",
                    wordCount: 1250,
                    summaryWordCount: 45
                  },
                  {
                    noteTitle: "Project Retrospective Q4 2024",
                    summaryType: "Executive Summary",
                    summary: "Q4 project successfully delivered key milestones with 95% user satisfaction. Main achievements: feature completion, performance improvements, and team growth. Areas for improvement: communication processes and testing coverage. Budget utilized: 98% of allocated resources.",
                    generatedAt: "1 day ago",
                    wordCount: 850,
                    summaryWordCount: 52
                  },
                  {
                    noteTitle: "Machine Learning Research Notes",
                    summaryType: "Academic Summary",
                    summary: "Review of recent developments in transformer architectures and attention mechanisms. Key papers analyzed include attention improvements, efficiency optimizations, and novel applications. Research methodology focuses on comparative analysis of model performance across different datasets.",
                    generatedAt: "3 days ago",
                    wordCount: 2100,
                    summaryWordCount: 68
                  }
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{item.noteTitle}</h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">{item.summaryType}</Badge>
                          <span>Generated {item.generatedAt}</span>
                          <span>•</span>
                          <span>{item.wordCount} → {item.summaryWordCount} words</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">⋯</Button>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">
                          Compression: {Math.round((1 - item.summaryWordCount / item.wordCount) * 100)}%
                        </span>
                        <span className="text-muted-foreground">
                          Reading time: ~{Math.ceil(item.summaryWordCount / 200)} min
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Summaries
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Summaries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Summaries</CardTitle>
              <CardDescription>Notes waiting for summary generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Database Migration Strategy", wordCount: 1850, priority: "high" },
                  { title: "User Research Findings", wordCount: 920, priority: "medium" },
                  { title: "API Documentation Update", wordCount: 1200, priority: "low" },
                  { title: "Security Best Practices", wordCount: 2400, priority: "high" }
                ].map((note, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        note.priority === 'high' ? 'bg-red-500' :
                        note.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <span className="font-medium text-sm">{note.title}</span>
                        <p className="text-xs text-muted-foreground">
                          {note.wordCount} words • Est. 2-3 min to summarize
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full">
                  Generate All Pending Summaries
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <TrendingUpIcon className="h-4 w-4" />
                  <span>Writing Patterns</span>
                </CardTitle>
                <CardDescription>
                  Insights about your writing habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Most active time</span>
                    <span>2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. note length</span>
                    <span>247 words</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Most used tags</span>
                    <span>react, javascript</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Analysis</CardTitle>
                <CardDescription>
                  AI analysis of your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Knowledge areas</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expertise level</span>
                    <span>Intermediate</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    View Full Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Productivity Score</CardTitle>
                <CardDescription>
                  Your knowledge building progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">85</div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

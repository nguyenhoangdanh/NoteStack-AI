import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Calendar, Activity, Target, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useActivityStats, useTrendingActivities } from '@/hooks/useActivities';
import { useUsage } from '@/hooks/useSettings';
import { useUserShareStats } from '@/hooks/useSharing';
import { useAttachmentAnalytics } from '@/hooks/useAttachments';
import { useTagAnalytics } from '@/hooks/useTags';

// Mock analytics data
const mockActivityData = {
  totalActivities: 1247,
  recentActivities: { last7Days: 89, last30Days: 341 },
  byAction: {
    CREATE: 156,
    UPDATE: 523,
    VIEW: 398,
    SEARCH: 124,
    DELETE: 46,
  },
  mostActiveNotes: [
    { noteId: '1', title: 'React Best Practices', activityCount: 45 },
    { noteId: '2', title: 'AI Integration Guide', activityCount: 38 },
    { noteId: '3', title: 'TypeScript Patterns', activityCount: 32 },
  ],
};

const mockUsageData = {
  notesCreated: 67,
  notesUpdated: 234,
  searchQueries: 156,
  aiInteractions: 89,
  collaborationSessions: 23,
  attachmentsUploaded: 45,
  templatesUsed: 12,
  summariesGenerated: 34,
};

const mockTrendingData = {
  notes: [
    { noteId: '1', title: 'React Hooks Deep Dive', score: 95, actions: { VIEW: 23, UPDATE: 12 } },
    { noteId: '2', title: 'AI Notes Architecture', score: 87, actions: { VIEW: 19, UPDATE: 8 } },
    { noteId: '3', title: 'Database Design Patterns', score: 82, actions: { VIEW: 15, UPDATE: 6 } },
  ],
  actions: [
    { action: 'VIEW', count: 198 },
    { action: 'UPDATE', count: 145 },
    { action: 'CREATE', count: 67 },
    { action: 'SEARCH', count: 89 },
  ],
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30');
  
  const { data: activityStats, isLoading: activityLoading } = useActivityStats();
  const { data: trendingData, isLoading: trendingLoading } = useTrendingActivities({ 
    window: '30d', 
    limit: 10 
  });
  const { data: usageData, isLoading: usageLoading } = useUsage(parseInt(timeRange));
  const { data: shareStats, isLoading: shareLoading } = useUserShareStats();
  const { data: attachmentAnalytics, isLoading: attachmentLoading } = useAttachmentAnalytics(
    parseInt(timeRange)
  );
  const { data: tagAnalytics, isLoading: tagLoading } = useTagAnalytics(parseInt(timeRange));

  // Use actual data if available, otherwise fallback to mock data
  const finalActivityStats = activityStats || mockActivityData;
  const finalTrendingData = trendingData || mockTrendingData;
  const finalUsageData = usageData || mockUsageData;

  const isLoading = activityLoading || trendingLoading || usageLoading || shareLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Analytics & Insights
            </h1>
            <p className="text-muted-foreground">
              Track your productivity, understand usage patterns, and optimize your workflow
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalActivityStats.totalActivities}</p>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  +{finalActivityStats.recentActivities.last7Days} this week
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalUsageData.notesCreated}</p>
                  <p className="text-sm text-muted-foreground">Notes Created</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  +23% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Zap className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalUsageData.aiInteractions}</p>
                  <p className="text-sm text-muted-foreground">AI Interactions</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  +45% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalUsageData.collaborationSessions}</p>
                  <p className="text-sm text-muted-foreground">Collaborations</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  +12% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity by Type */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Activity by Type</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(finalActivityStats.byAction).map(([action, count]) => (
                    <div key={action} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: {
                              CREATE: '#10B981',
                              UPDATE: '#3B82F6', 
                              VIEW: '#8B5CF6',
                              SEARCH: '#F59E0B',
                              DELETE: '#EF4444'
                            }[action] 
                          }}
                        />
                        <span className="text-sm font-medium">{action}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Most Active Notes */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Most Active Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {finalActivityStats.mostActiveNotes.map((note, index) => (
                    <div key={note.noteId} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{note.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {note.activityCount} activities
                          </p>
                        </div>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trending Content */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <Skeleton className="h-5 w-full mb-3" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {finalTrendingData.notes.map((note, index) => (
                  <div key={note.noteId} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-sm line-clamp-2">{note.title}</h4>
                      <Badge variant={index < 3 ? 'default' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <div className="text-2xl font-bold text-primary">{note.score}</div>
                      <div className="text-xs text-muted-foreground">Trending Score</div>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(note.actions).map(([action, count]) => (
                        <Badge key={action} variant="outline" className="text-xs">
                          {action}: {count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Patterns */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Usage Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Search Queries</span>
                  <Badge variant="outline">{finalUsageData.searchQueries}</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '78%' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Templates Used</span>
                  <Badge variant="outline">{finalUsageData.templatesUsed}</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: '45%' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Summaries Generated</span>
                  <Badge variant="outline">{finalUsageData.summariesGenerated}</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full" 
                    style={{ width: '62%' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attachments</span>
                  <Badge variant="outline">{finalUsageData.attachmentsUploaded}</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-info h-2 rounded-full" 
                    style={{ width: '38%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

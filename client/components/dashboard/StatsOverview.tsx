import React from 'react';
import { FileText, FolderOpen, Tags, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotes } from '@/hooks/useNotes';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';

const mockStats = [
  {
    title: 'Total Notes',
    value: 142,
    icon: FileText,
    change: '+12%',
    changeType: 'positive' as const,
  },
  {
    title: 'Workspaces',
    value: 8,
    icon: FolderOpen,
    change: '+2%',
    changeType: 'positive' as const,
  },
  {
    title: 'Categories',
    value: 23,
    icon: Tags,
    change: '+5%',
    changeType: 'positive' as const,
  },
  {
    title: 'Activity Score',
    value: 89,
    icon: Activity,
    change: '+8%',
    changeType: 'positive' as const,
  },
];

export function StatsOverview() {
  const { data: notes, isLoading: notesLoading } = useNotes();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Use actual data if available, otherwise fallback to mock data
  const stats = [
    {
      title: 'Total Notes',
      value: notes?.length ?? mockStats[0].value,
      icon: FileText,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Workspaces',
      value: workspaces?.length ?? mockStats[1].value,
      icon: FolderOpen,
      change: '+2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Categories',
      value: categories?.length ?? mockStats[2].value,
      icon: Tags,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Activity Score',
      value: mockStats[3].value,
      icon: Activity,
      change: '+8%',
      changeType: 'positive' as const,
    },
  ];

  const isLoading = notesLoading || workspacesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === 'positive' ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

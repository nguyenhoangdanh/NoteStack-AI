import React, { useState } from 'react';
import { Users, Plus, Share2, Crown, Eye, Edit, Shield, Mail, Clock, Circle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMyCollaborations, useInviteCollaborator } from '@/hooks/useCollaboration';
import { useUserShareStats } from '@/hooks/useSharing';
import { toast } from 'react-hot-toast';
import type { Collaboration } from '@/types';
import { formatDistanceToNow } from 'date-fns';

// Mock collaboration data
const mockCollaborations: Collaboration[] = [
  {
    id: '1',
    noteId: 'note-1',
    userId: 'user-2',
    user: {
      id: 'user-2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      image: '/avatars/sarah.jpg',
    },
    note: {
      id: 'note-1',
      title: 'React Development Guidelines',
      updatedAt: '2024-01-15T14:20:00Z',
      owner: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    permission: 'WRITE',
    joinedAt: '2024-01-10T10:30:00Z',
    lastActive: '2024-01-15T13:45:00Z',
    isOnline: true,
    isOwner: false,
  },
  {
    id: '2',
    noteId: 'note-2',
    userId: 'user-3',
    user: {
      id: 'user-3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      image: '/avatars/mike.jpg',
    },
    note: {
      id: 'note-2',
      title: 'Project Architecture Discussion',
      updatedAt: '2024-01-14T16:45:00Z',
      owner: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    permission: 'READ',
    joinedAt: '2024-01-12T09:15:00Z',
    lastActive: '2024-01-14T15:30:00Z',
    isOnline: false,
    isOwner: false,
  },
  {
    id: '3',
    noteId: 'note-3',
    userId: 'user-4',
    user: {
      id: 'user-4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      image: '/avatars/emma.jpg',
    },
    note: {
      id: 'note-3',
      title: 'AI Integration Strategy',
      updatedAt: '2024-01-13T11:20:00Z',
      owner: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    permission: 'ADMIN',
    joinedAt: '2024-01-08T11:20:00Z',
    lastActive: '2024-01-13T10:15:00Z',
    isOnline: true,
    isOwner: false,
  },
];

const mockShareStats = {
  totalShares: 12,
  activeCollaborations: 8,
  totalViews: 234,
  popularNotes: [
    { noteId: 'note-1', title: 'React Guidelines', views: 89 },
    { noteId: 'note-2', title: 'Project Architecture', views: 67 },
    { noteId: 'note-3', title: 'AI Integration', views: 45 },
  ],
};

export default function CollaborationPage() {
  const [filter, setFilter] = useState<'all' | 'owned' | 'shared'>('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<'READ' | 'WRITE' | 'ADMIN'>('READ');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const { data: collaborations, isLoading } = useMyCollaborations();
  const { data: shareStats, isLoading: shareStatsLoading } = useUserShareStats();
  const inviteCollaborator = useInviteCollaborator();

  // Use actual data if available, otherwise fallback to mock data
  const finalCollaborations = collaborations || mockCollaborations;
  const finalShareStats = shareStats || mockShareStats;

  // Filter collaborations
  const filteredCollaborations = finalCollaborations.filter(collab => {
    if (filter === 'owned') return collab.isOwner;
    if (filter === 'shared') return !collab.isOwner;
    return true;
  });

  const handleInviteCollaborator = async () => {
    if (!inviteEmail || !selectedNote) return;

    try {
      await inviteCollaborator.mutateAsync({
        noteId: selectedNote,
        data: {
          email: inviteEmail,
          permission: invitePermission.toLowerCase() as 'read' | 'write' | 'admin',
        },
      });
      toast.success('Collaborator invited successfully');
      setInviteEmail('');
      setSelectedNote(null);
    } catch (error) {
      toast.error('Failed to invite collaborator');
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'ADMIN':
        return <Crown className="h-4 w-4 text-warning" />;
      case 'WRITE':
        return <Edit className="h-4 w-4 text-success" />;
      case 'READ':
      default:
        return <Eye className="h-4 w-4 text-info" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'ADMIN':
        return 'warning';
      case 'WRITE':
        return 'success';
      case 'READ':
      default:
        return 'secondary';
    }
  };

  if (isLoading || shareStatsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
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
              <Users className="h-8 w-8" />
              Collaboration
            </h1>
            <p className="text-muted-foreground">
              Manage shared notes, invite collaborators, and track team activity
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Invite Collaborator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Collaborator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Permission Level</label>
                  <Select 
                    value={invitePermission} 
                    onValueChange={(value: any) => setInvitePermission(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read Only</SelectItem>
                      <SelectItem value="write">Read & Write</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Select Note</label>
                  <Select value={selectedNote || ''} onValueChange={setSelectedNote}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a note to share" />
                    </SelectTrigger>
                    <SelectContent>
                      {finalCollaborations
                        .filter(c => c.isOwner)
                        .map((collab) => (
                          <SelectItem key={collab.noteId} value={collab.noteId}>
                            {collab.note?.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleInviteCollaborator} 
                  disabled={!inviteEmail || !selectedNote || inviteCollaborator.isPending}
                  className="w-full btn-gradient"
                >
                  {inviteCollaborator.isPending ? 'Inviting...' : 'Send Invitation'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalShareStats.totalShares}</p>
                  <p className="text-sm text-muted-foreground">Total Shares</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalShareStats.activeCollaborations}</p>
                  <p className="text-sm text-muted-foreground">Active Collaborations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Eye className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{finalShareStats.totalViews}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter:</label>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collaborations</SelectItem>
                  <SelectItem value="owned">Notes I Own</SelectItem>
                  <SelectItem value="shared">Shared with Me</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">
                {filteredCollaborations.length} collaboration{filteredCollaborations.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Collaborations List */}
        {filteredCollaborations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-48">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No collaborations found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start collaborating by inviting team members to your notes
              </p>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Invite Collaborator
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCollaborations.map((collaboration) => (
              <Card key={collaboration.id} className="card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={collaboration.user?.image} />
                          <AvatarFallback>
                            {collaboration.user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {collaboration.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                            <Circle className="h-2 w-2 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{collaboration.user?.name}</h3>
                          <Badge variant={getPermissionColor(collaboration.permission) as any}>
                            {getPermissionIcon(collaboration.permission)}
                            {collaboration.permission}
                          </Badge>
                          {collaboration.isOwner && (
                            <Badge variant="outline">
                              <Crown className="h-3 w-3 mr-1" />
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {collaboration.user?.email}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last active: {collaboration.lastActive ? 
                              formatDistanceToNow(new Date(collaboration.lastActive), { addSuffix: true }) : 
                              'Never'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <h4 className="font-medium text-sm mb-1">
                        {collaboration.note?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Updated {collaboration.note?.updatedAt ? 
                          formatDistanceToNow(new Date(collaboration.note.updatedAt), { addSuffix: true }) : 
                          'Unknown'
                        }
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Popular Shared Notes */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Viewed Shared Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finalShareStats.popularNotes?.map((note, index) => (
                <div 
                  key={note.noteId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{note.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {note.views} views
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

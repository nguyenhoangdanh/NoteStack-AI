import React, { useState } from 'react';
import { Note } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    ShareIcon,
    UsersIcon,
    SettingsIcon,
    PlusIcon,
    ClockIcon,
    EyeIcon,
    EditIcon,
    TrashIcon,
    MoreHorizontalIcon,
    HistoryIcon,
    CopyIcon
} from 'lucide-react';

interface CollaborationPanelProps {
    notes: Note[];
}

export function CollaborationPanel({ notes }: CollaborationPanelProps) {
    const [activeTab, setActiveTab] = useState('shared');
    const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');

    const mockSharedNotes = notes.slice(0, 3).map(note => ({
        ...note,
        collaborators: [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'editor' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'viewer' }
        ],
        shareLink: `https://app.example.com/shared/${note.id}`,
        permissions: 'Can edit'
    }));

    const mockInvitations = [
        { id: '1', email: 'alice@example.com', role: 'editor', status: 'pending', sentAt: '2024-01-15T10:00:00Z' },
        { id: '2', email: 'bob@example.com', role: 'viewer', status: 'pending', sentAt: '2024-01-15T09:30:00Z' }
    ];

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="shared">Shared Notes</TabsTrigger>
                    <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
                    <TabsTrigger value="invitations">Invitations</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="shared" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Shared Notes</h3>
                            <p className="text-sm text-muted-foreground">Notes you're collaborating on with others</p>
                        </div>
                        <Button>
                            <ShareIcon className="h-4 w-4 mr-2" />
                            Share New Note
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center space-x-2">
                                <ShareIcon className="h-4 w-4 text-blue-600" />
                                <div>
                                    <div className="text-2xl font-bold">{mockSharedNotes.length}</div>
                                    <div className="text-sm text-muted-foreground">Shared notes</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center space-x-2">
                                <UsersIcon className="h-4 w-4 text-green-600" />
                                <div>
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-sm text-muted-foreground">Collaborators</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center space-x-2">
                                <EditIcon className="h-4 w-4 text-orange-600" />
                                <div>
                                    <div className="text-2xl font-bold">47</div>
                                    <div className="text-sm text-muted-foreground">Recent edits</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4 text-purple-600" />
                                <div>
                                    <div className="text-2xl font-bold">2h</div>
                                    <div className="text-sm text-muted-foreground">Avg response</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Shared Notes List */}
                    <div className="space-y-4">
                        {mockSharedNotes.map((note) => (
                            <Card key={note.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <CardTitle className="text-base">{note.title}</CardTitle>
                                                <CardDescription className="flex items-center space-x-2">
                                                    <span>{note.collaborators.length} collaborator{note.collaborators.length !== 1 ? 's' : ''}</span>
                                                    <span>•</span>
                                                    <span>Last updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary">{note.permissions}</Badge>
                                            <Badge variant="outline">v2.1</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Collaborators */}
                                        <div className="flex items-center space-x-3">
                                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex items-center space-x-2">
                                                <div className="flex -space-x-2">
                                                    {note.collaborators.map((collaborator) => (
                                                        <Avatar key={collaborator.id} className="h-7 w-7 border-2 border-background">
                                                            <AvatarFallback className="text-xs">
                                                                {collaborator.name.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {note.collaborators.map(c => `${c.name} (${c.role})`).join(', ')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Recent Activity */}
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="font-medium">Jane Smith</span>
                                                <span className="text-muted-foreground">edited the document 2 hours ago</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 ml-4">
                                                Added new section on "Performance Optimization"
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <EyeIcon className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <EditIcon className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <HistoryIcon className="h-4 w-4 mr-1" />
                                                    History
                                                </Button>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm">
                                                    <ShareIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontalIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Share Link Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Share Links</CardTitle>
                            <CardDescription>Public links for external sharing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { note: "React Development Guide", link: "https://app.example.com/shared/abc123", views: 47, expires: "7 days" },
                                    { note: "Project Roadmap", link: "https://app.example.com/shared/def456", views: 23, expires: "Never" }
                                ].map((shareLink, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">{shareLink.note}</p>
                                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                <span>{shareLink.views} views</span>
                                                <span>•</span>
                                                <span>Expires: {shareLink.expires}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <CopyIcon className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <SettingsIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="collaborators" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Manage Collaborators</h3>
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Enter email address"
                                value={newCollaboratorEmail}
                                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                                className="w-64"
                            />
                            <Button>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Invite
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Collaborators</CardTitle>
                            <CardDescription>People who have access to your shared notes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockSharedNotes[0]?.collaborators.map((collaborator) => (
                                    <div key={collaborator.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{collaborator.name}</p>
                                                <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{collaborator.role}</Badge>
                                            <Button variant="ghost" size="sm">
                                                <SettingsIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invitations" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Pending Invitations</h3>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sent Invitations</CardTitle>
                            <CardDescription>Invitations waiting for response</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockInvitations.map((invitation) => (
                                    <div key={invitation.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{invitation.email}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Invited as {invitation.role} • {new Date(invitation.sentAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary">{invitation.status}</Badge>
                                            <Button variant="ghost" size="sm">
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <h3 className="text-lg font-semibold">Collaboration Settings</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle>Default Permissions</CardTitle>
                            <CardDescription>Set default permissions for new collaborators</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Role</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link Sharing</label>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="public-links" />
                                    <label htmlFor="public-links" className="text-sm">
                                        Allow public link sharing
                                    </label>
                                </div>
                            </div>

                            <Button>Save Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

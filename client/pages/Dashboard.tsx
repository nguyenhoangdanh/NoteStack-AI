import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Note, Workspace, Settings } from '../types/api.types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    PlusIcon,
    SearchIcon,
    MessageCircleIcon,
    SettingsIcon,
    NotebookIcon,
    BrainIcon,
    TagIcon,
    ShareIcon,
    HistoryIcon,
    TrendingUpIcon,
    FileTextIcon,
    UsersIcon,
    SparklesIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { NotesManager } from '../components/NotesManager';
import { ChatInterface } from '../components/ChatInterface';
import { SmartFeatures } from '../components/SmartFeatures';
import { CollaborationPanel } from '../components/CollaborationPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { QuickActions } from '../components/QuickActions';
import { InsightsWidget } from '../components/InsightsWidget';
import { RecentActivity } from '../components/RecentActivity';

export default function Dashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('notes');
    const [notes, setNotes] = useState<Note[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Load initial data
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [notesData, workspacesData, settingsData] = await Promise.all([
                apiClient.notes.list(),
                apiClient.workspaces.list(),
                apiClient.settings.get()
            ]);

            setNotes(notesData);
            setWorkspaces(workspacesData);
            setSettings(settingsData);

            // Set default workspace
            const defaultWorkspace = workspacesData.find(w => w.isDefault);
            if (defaultWorkspace) {
                setSelectedWorkspace(defaultWorkspace);
            }

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleWorkspaceChange = async (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        try {
            const workspaceNotes = await apiClient.notes.list(workspace.id);
            setNotes(workspaceNotes);
        } catch (error) {
            console.error('Failed to load workspace notes:', error);
            toast.error('Failed to load workspace notes');
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            loadDashboardData();
            return;
        }

        try {
            const searchResults = await apiClient.notes.search({ q: query });
            setNotes(searchResults);
        } catch (error) {
            console.error('Search failed:', error);
            toast.error('Search failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <BrainIcon className="h-8 w-8 text-primary" />
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    AI Notes
                                </h1>
                            </div>
                            <Badge variant="secondary">Dashboard</Badge>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Quick Search */}
                            <div className="relative w-96">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search notes, ask AI, or find anything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                    className="pl-10"
                                />
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.image || undefined} alt={user?.name || user?.email} />
                                    <AvatarFallback>
                                        {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium">{user?.name || user?.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-3">
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <QuickActions
                                selectedWorkspace={selectedWorkspace}
                                onWorkspaceChange={handleWorkspaceChange}
                                workspaces={workspaces}
                                onRefresh={loadDashboardData}
                            />

                            {/* Insights Widget */}
                            <InsightsWidget notes={notes} />

                            {/* Recent Activity */}
                            <RecentActivity />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            {/* Tab Navigation */}
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="notes" className="flex items-center space-x-2">
                                    <FileTextIcon className="h-4 w-4" />
                                    <span>Notes</span>
                                </TabsTrigger>
                                <TabsTrigger value="chat" className="flex items-center space-x-2">
                                    <MessageCircleIcon className="h-4 w-4" />
                                    <span>AI Chat</span>
                                </TabsTrigger>
                                <TabsTrigger value="smart" className="flex items-center space-x-2">
                                    <SparklesIcon className="h-4 w-4" />
                                    <span>Smart</span>
                                </TabsTrigger>
                                <TabsTrigger value="collaborate" className="flex items-center space-x-2">
                                    <UsersIcon className="h-4 w-4" />
                                    <span>Collaborate</span>
                                </TabsTrigger>
                                <TabsTrigger value="insights" className="flex items-center space-x-2">
                                    <TrendingUpIcon className="h-4 w-4" />
                                    <span>Insights</span>
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="flex items-center space-x-2">
                                    <SettingsIcon className="h-4 w-4" />
                                    <span>Settings</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab Content */}
                            <TabsContent value="notes" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Your Notes</h2>
                                        <p className="text-muted-foreground">
                                            {notes.length} note{notes.length !== 1 ? 's' : ''} in {selectedWorkspace?.name}
                                        </p>
                                    </div>
                                    <Button onClick={() => { }} className="flex items-center space-x-2">
                                        <PlusIcon className="h-4 w-4" />
                                        <span>New Note</span>
                                    </Button>
                                </div>

                                <NotesManager
                                    notes={notes}
                                    selectedWorkspace={selectedWorkspace}
                                    onNotesUpdate={setNotes}
                                    onWorkspaceChange={handleWorkspaceChange}
                                    workspaces={workspaces}
                                />
                            </TabsContent>

                            <TabsContent value="chat" className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">AI Chat Assistant</h2>
                                    <p className="text-muted-foreground">
                                        Ask questions about your notes, get summaries, and more
                                    </p>
                                </div>

                                <ChatInterface settings={settings} />
                            </TabsContent>

                            <TabsContent value="smart" className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Smart Features</h2>
                                    <p className="text-muted-foreground">
                                        AI-powered organization, insights, and productivity tools
                                    </p>
                                </div>

                                <SmartFeatures notes={notes} onNotesUpdate={setNotes} />
                            </TabsContent>

                            <TabsContent value="collaborate" className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Collaboration</h2>
                                    <p className="text-muted-foreground">
                                        Share notes, work together, and manage permissions
                                    </p>
                                </div>

                                <CollaborationPanel notes={notes} />
                            </TabsContent>

                            <TabsContent value="insights" className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Analytics & Insights</h2>
                                    <p className="text-muted-foreground">
                                        Track your productivity, usage patterns, and note analytics
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Productivity Stats */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <TrendingUpIcon className="h-5 w-5" />
                                                <span>Productivity</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Notes Created</span>
                                                    <span className="font-medium">{notes.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Active Workspaces</span>
                                                    <span className="font-medium">{workspaces.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">AI Model</span>
                                                    <span className="font-medium">{settings?.model || 'Default'}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Activity Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <HistoryIcon className="h-5 w-5" />
                                                <span>Recent Activity</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Activity tracking coming soon...
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Usage Stats Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <BrainIcon className="h-5 w-5" />
                                                <span>AI Usage</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Usage analytics coming soon...
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Settings</h2>
                                    <p className="text-muted-foreground">
                                        Manage your preferences, AI models, and account settings
                                    </p>
                                </div>

                                <SettingsPanel
                                    settings={settings}
                                    onSettingsUpdate={setSettings}
                                    user={user}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Workspace } from '../types/api.types';
import { apiClient } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import {
    PlusIcon,
    FolderIcon,
    RefreshCwIcon,
    SearchIcon,
    BrainIcon,
    SparklesIcon,
    TrendingUpIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface QuickActionsProps {
    selectedWorkspace: Workspace | null;
    onWorkspaceChange: (workspace: Workspace) => void;
    workspaces: Workspace[];
    onRefresh: () => void;
}

export function QuickActions({
    selectedWorkspace,
    onWorkspaceChange,
    workspaces,
    onRefresh
}: QuickActionsProps) {
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) {
            toast.error('Please enter a workspace name');
            return;
        }

        setCreating(true);
        try {
            const newWorkspace = await apiClient.workspaces.create({ name: newWorkspaceName.trim() });
            onWorkspaceChange(newWorkspace);
            setIsCreateWorkspaceOpen(false);
            setNewWorkspaceName('');
            toast.success('Workspace created successfully!');
            onRefresh();
        } catch (error) {
            console.error('Failed to create workspace:', error);
            toast.error('Failed to create workspace');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Workspace Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                        <FolderIcon className="h-4 w-4" />
                        <span>Workspace</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Select
                        value={selectedWorkspace?.id || ''}
                        onValueChange={(workspaceId) => {
                            const workspace = workspaces.find(w => w.id === workspaceId);
                            if (workspace) onWorkspaceChange(workspace);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            {workspaces.map(workspace => (
                                <SelectItem key={workspace.id} value={workspace.id}>
                                    <div className="flex items-center space-x-2">
                                        <span>{workspace.name}</span>
                                        {workspace.isDefault && (
                                            <span className="text-xs text-muted-foreground">(Default)</span>
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                                <PlusIcon className="h-3 w-3 mr-2" />
                                New Workspace
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Workspace</DialogTitle>
                                <DialogDescription>
                                    Create a new workspace to organize your notes
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <Input
                                    placeholder="Workspace name"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateWorkspace();
                                        }
                                    }}
                                />
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateWorkspace} disabled={creating}>
                                    {creating ? 'Creating...' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Note
                    </Button>

                    <Button variant="outline" size="sm" className="w-full justify-start">
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Advanced Search
                    </Button>

                    <Button variant="outline" size="sm" className="w-full justify-start">
                        <BrainIcon className="h-4 w-4 mr-2" />
                        Ask AI
                    </Button>

                    <Button variant="outline" size="sm" className="w-full justify-start">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Smart Features
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={onRefresh}
                    >
                        <RefreshCwIcon className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </CardContent>
            </Card>

            {/* Productivity Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                        <TrendingUpIcon className="h-4 w-4" />
                        <span>Today</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Notes created</span>
                        <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">AI chats</span>
                        <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Words written</span>
                        <span className="font-medium">0</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import React, { useState } from 'react';
import { Settings, User } from '../types/api.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    UserIcon,
    BrainIcon,
    ShieldIcon,
    BellIcon,
    PaletteIcon,
    DatabaseIcon,
    DownloadIcon,
    TrashIcon,
    KeyIcon
} from 'lucide-react';

interface SettingsPanelProps {
    settings: Settings | null;
    onSettingsUpdate: (settings: Settings) => void;
    user: User | null;
}

export function SettingsPanel({ settings, onSettingsUpdate, user }: SettingsPanelProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [localSettings, setLocalSettings] = useState(settings);

    const updateSetting = (key: keyof Settings, value: any) => {
        if (!localSettings) return;
        const updated = { ...localSettings, [key]: value };
        setLocalSettings(updated);
        onSettingsUpdate(updated);
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="ai">AI & Models</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <h3 className="text-lg font-semibold">Profile Settings</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <UserIcon className="h-5 w-5" />
                                <span>Personal Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={user?.image || undefined} alt={user?.name || user?.email} />
                                    <AvatarFallback className="text-lg">
                                        {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline">Change Photo</Button>
                                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={user?.name || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue={user?.email || ''} type="email" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    className="w-full p-2 border rounded-md min-h-[80px]"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                    <h3 className="text-lg font-semibold">AI & Model Settings</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BrainIcon className="h-5 w-5" />
                                <span>AI Model Configuration</span>
                            </CardTitle>
                            <CardDescription>Configure your preferred AI models and settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Primary AI Model</Label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={localSettings?.model || 'gpt-4'}
                                    onChange={(e) => updateSetting('model', e.target.value)}
                                >
                                    <option value="gpt-4">GPT-4 (Recommended)</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="claude-3">Claude 3</option>
                                    <option value="gemini-pro">Gemini Pro</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Temperature</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={localSettings?.temperature || 0.7}
                                    onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Current: {localSettings?.temperature || 0.7} (Higher = more creative)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Max Response Length</Label>
                                <Input
                                    type="number"
                                    defaultValue={localSettings?.maxTokens || 2048}
                                    onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Usage & Limits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">API Requests This Month</p>
                                    <p className="text-sm text-muted-foreground">1,247 of 10,000 used</p>
                                </div>
                                <Badge variant="secondary">12.5%</Badge>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '12.5%' }}></div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                    <h3 className="text-lg font-semibold">Preferences</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <PaletteIcon className="h-5 w-5" />
                                <span>Appearance</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                                </div>
                                <Switch
                                    checked={localSettings?.darkMode || false}
                                    onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Compact Layout</Label>
                                    <p className="text-sm text-muted-foreground">Use a more condensed interface</p>
                                </div>
                                <Switch />
                            </div>

                            <div className="space-y-2">
                                <Label>Language</Label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="vi">Tiếng Việt</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Editor Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Auto-save</Label>
                                    <p className="text-sm text-muted-foreground">Automatically save changes as you type</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>AI Suggestions</Label>
                                    <p className="text-sm text-muted-foreground">Show AI writing suggestions while editing</p>
                                </div>
                                <Switch
                                    checked={localSettings?.aiSuggestions || true}
                                    onCheckedChange={(checked) => updateSetting('aiSuggestions', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Settings</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BellIcon className="h-5 w-5" />
                                <span>Push Notifications</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Collaboration Updates</Label>
                                    <p className="text-sm text-muted-foreground">When someone edits or comments on shared notes</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>AI Processing Complete</Label>
                                    <p className="text-sm text-muted-foreground">When AI analysis or summarization finishes</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Weekly Insights</Label>
                                    <p className="text-sm text-muted-foreground">Weekly summary of your productivity and notes</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4">
                    <h3 className="text-lg font-semibold">Privacy & Security</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <ShieldIcon className="h-5 w-5" />
                                <span>Account Security</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                </div>
                                <Button variant="outline">Enable 2FA</Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Change Password</Label>
                                    <p className="text-sm text-muted-foreground">Update your account password</p>
                                </div>
                                <Button variant="outline">
                                    <KeyIcon className="h-4 w-4 mr-2" />
                                    Change
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Privacy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Analytics</Label>
                                    <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>AI Training</Label>
                                    <p className="text-sm text-muted-foreground">Allow anonymized data to improve AI models</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Management</h3>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DatabaseIcon className="h-5 w-5" />
                                <span>Export & Backup</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Export All Data</Label>
                                    <p className="text-sm text-muted-foreground">Download all your notes and settings</p>
                                </div>
                                <Button>
                                    <DownloadIcon className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Auto Backup</Label>
                                    <p className="text-sm text-muted-foreground">Automatic daily backups to cloud storage</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-destructive">
                                <TrashIcon className="h-5 w-5" />
                                <span>Danger Zone</span>
                            </CardTitle>
                            <CardDescription>These actions cannot be undone</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Delete All Notes</Label>
                                    <p className="text-sm text-muted-foreground">Permanently delete all your notes and data</p>
                                </div>
                                <Button variant="destructive">Delete All</Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Delete Account</Label>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

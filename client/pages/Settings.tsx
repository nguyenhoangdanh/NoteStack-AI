import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/ui/theme-toggle";
import {
  ArrowLeft,
  Brain,
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  Key,
  Mail,
  Globe,
  Zap,
  Heart,
  Star,
  Crown,
  Sparkles,
} from "lucide-react";
import { DemoBanner } from "@/components/DemoBanner";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Demo settings state
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || "Demo User",
      email: user?.email || "demo@example.com",
      avatar: user?.image || "",
    },
    preferences: {
      theme: "system",
      language: "en",
      notifications: true,
      autoSave: true,
    },
    ai: {
      model: "gpt-3.5-turbo",
      maxTokens: 2000,
      temperature: 0.7,
      apiKey: "",
    },
    data: {
      exportFormat: "json",
      autoBackup: true,
      retentionDays: 30,
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert("Settings saved successfully! (Demo mode)");
  };

  const handleExport = () => {
    alert("Export functionality would download your data (Demo mode)");
  };

  const handleImport = () => {
    alert("Import functionality would upload your data (Demo mode)");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion would be processed (Demo mode)");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "from-blue-500 to-purple-500" },
    { id: "preferences", label: "Preferences", icon: SettingsIcon, color: "from-emerald-500 to-green-500" },
    { id: "ai", label: "AI Settings", icon: Brain, color: "from-orange-500 to-red-500" },
    { id: "data", label: "Data & Privacy", icon: Shield, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      {/* Header */}
      <header className="border-b border-white/20 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/notes")}
                className="text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-black/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">Settings</h1>
                  <p className="text-xs text-muted-foreground">Customize your AI Notes experience</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <DemoBanner />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-gradient shadow-lg border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="text-gradient">Settings</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                      }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card className="card-gradient shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gradient">Profile Settings</CardTitle>
                      <CardDescription>Manage your account information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          profile: { ...prev.profile, name: e.target.value }
                        }))}
                        className="bg-white/50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          profile: { ...prev.profile, email: e.target.value }
                        }))}
                        className="bg-white/50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button onClick={handleSave} className="btn-gradient text-white" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={logout} className="text-red-600 hover:text-red-700">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "preferences" && (
              <Card className="card-gradient shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                      <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gradient-success">Preferences</CardTitle>
                      <CardDescription>Customize your app experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/30 dark:bg-slate-800/30 border-emerald-200 dark:border-emerald-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Theme</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[
                            { value: "light", label: "Light", icon: "☀️" },
                            { value: "dark", label: "Dark", icon: "🌙" },
                            { value: "system", label: "System", icon: "💻" }
                          ].map(theme => (
                            <Button
                              key={theme.value}
                              variant={settings.preferences.theme === theme.value ? "default" : "outline"}
                              className={`w-full justify-start ${settings.preferences.theme === theme.value ? "btn-gradient-success text-white" : ""
                                }`}
                              onClick={() => setSettings(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, theme: theme.value }
                              }))}
                            >
                              <span className="mr-2">{theme.icon}</span>
                              {theme.label}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/30 dark:bg-slate-800/30 border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">Push Notifications</span>
                            </div>
                            <Button
                              size="sm"
                              variant={settings.preferences.notifications ? "default" : "outline"}
                              onClick={() => setSettings(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, notifications: !prev.preferences.notifications }
                              }))}
                              className={settings.preferences.notifications ? "btn-gradient text-white" : ""}
                            >
                              {settings.preferences.notifications ? "On" : "Off"}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Save className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm">Auto Save</span>
                            </div>
                            <Button
                              size="sm"
                              variant={settings.preferences.autoSave ? "default" : "outline"}
                              onClick={() => setSettings(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, autoSave: !prev.preferences.autoSave }
                              }))}
                              className={settings.preferences.autoSave ? "btn-gradient-success text-white" : ""}
                            >
                              {settings.preferences.autoSave ? "On" : "Off"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "ai" && (
              <Card className="card-gradient shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gradient">AI Settings</CardTitle>
                      <CardDescription>Configure AI behavior and preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">AI Model</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", badge: "Fast" },
                          { value: "gpt-4", label: "GPT-4", badge: "Smart" },
                          { value: "claude-3", label: "Claude 3", badge: "Creative" }
                        ].map(model => (
                          <Button
                            key={model.value}
                            variant={settings.ai.model === model.value ? "default" : "outline"}
                            className={`justify-between ${settings.ai.model === model.value ? "btn-gradient text-white" : ""
                              }`}
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              ai: { ...prev.ai, model: model.value }
                            }))}
                          >
                            <span>{model.label}</span>
                            <Badge variant="secondary" className="ml-2">{model.badge}</Badge>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="text-foreground font-medium">OpenAI API Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="apiKey"
                          type="password"
                          placeholder="sk-..."
                          value={settings.ai.apiKey}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            ai: { ...prev.ai, apiKey: e.target.value }
                          }))}
                          className="bg-white/50 dark:bg-slate-800/50 border-orange-200 dark:border-orange-800"
                        />
                        <Button className="btn-gradient text-white">
                          <Key className="w-4 h-4 mr-2" />
                          Test
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Your API key is encrypted and stored securely</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "data" && (
              <Card className="card-gradient shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gradient">Data & Privacy</CardTitle>
                      <CardDescription>Manage your data and privacy settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={handleExport} className="btn-gradient-success text-white h-16">
                      <Download className="w-5 h-5 mr-2" />
                      Export Data
                    </Button>
                    <Button onClick={handleImport} className="btn-gradient text-white h-16">
                      <Upload className="w-5 h-5 mr-2" />
                      Import Data
                    </Button>
                  </div>

                  <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-700 dark:text-red-300 text-lg">Danger Zone</CardTitle>
                      <CardDescription className="text-red-600 dark:text-red-400">
                        Irreversible actions that permanently affect your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


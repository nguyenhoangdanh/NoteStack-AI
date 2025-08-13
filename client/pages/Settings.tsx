import React, { useState } from "react";
import { useSettings, useUpdateSettings, useUsage } from "../lib/query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Save,
  BarChart3,
  Settings as SettingsIcon,
  Upload,
  Download,
} from "lucide-react";
import ImportExport from "../components/ImportExport";

const AVAILABLE_MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast & Efficient)" },
  { value: "gpt-4o", label: "GPT-4o (Advanced)" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

export default function Settings() {
  const settings = useSettings();
  const usage = useUsage(30);
  const updateSettings = useUpdateSettings();

  const [model, setModel] = useState(settings?.model || "gpt-4o-mini");
  const [maxTokens, setMaxTokens] = useState(settings?.maxTokens || 4000);
  const [autoReembed, setAutoReembed] = useState(settings?.autoReembed ?? true);
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setModel(settings.model);
      setMaxTokens(settings.maxTokens);
      setAutoReembed(settings.autoReembed);
      setHasChanges(false);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        model,
        maxTokens,
        autoReembed,
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  // Prepare usage data for chart
  const usageData =
    usage?.map((day) => ({
      date: new Date(day.date).toLocaleDateString(),
      embedding: day.embeddingTokens,
      chat: day.chatTokens,
      total: day.embeddingTokens + day.chatTokens,
    })) || [];

  const totalTokensThisMonth = usageData.reduce(
    (sum, day) => sum + day.total,
    0,
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your AI Notes experience and monitor usage
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Data & Files</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* AI Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Choose the AI model and configure its behavior for your notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select
                  value={model}
                  onValueChange={(value) => {
                    setModel(value);
                    markChanged();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((modelOption) => (
                      <SelectItem
                        key={modelOption.value}
                        value={modelOption.value}
                      >
                        {modelOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Different models offer varying levels of capability and speed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1000"
                  max="16000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => {
                    setMaxTokens(Number(e.target.value));
                    markChanged();
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum tokens for AI responses (1000-16000). Higher values
                  allow longer responses but cost more.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoReembed">Auto Re-embed Notes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update embeddings when notes are saved for
                    better search
                  </p>
                </div>
                <Switch
                  id="autoReembed"
                  checked={autoReembed}
                  onCheckedChange={(checked) => {
                    setAutoReembed(checked);
                    markChanged();
                  }}
                />
              </div>

              {hasChanges && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge variant="secondary">Unsaved changes</Badge>
                  <Button
                    onClick={handleSave}
                    disabled={updateSettings.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateSettings.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your notes and embeddings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" size="sm">
                  Re-process All Notes
                </Button>
                <Button variant="outline" size="sm">
                  Clear All Embeddings
                </Button>
                <Button variant="outline" size="sm">
                  Export Notes
                </Button>
                <Button variant="outline" size="sm">
                  Import Notes
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                These actions will process your notes in the background and may
                take some time
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <ImportExport />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Usage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Tokens (30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalTokensThisMonth.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Embedding + Chat tokens
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Embedding Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usageData
                    .reduce((sum, day) => sum + day.embedding, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  For note processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Chat Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usageData
                    .reduce((sum, day) => sum + day.chat, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  For AI conversations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Token Usage (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Track your AI token consumption over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar
                      dataKey="embedding"
                      stackId="tokens"
                      fill="#8884d8"
                      name="Embedding"
                    />
                    <Bar
                      dataKey="chat"
                      stackId="tokens"
                      fill="#82ca9d"
                      name="Chat"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No usage data available yet</p>
                    <p className="text-sm">
                      Start using AI features to see your usage here
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

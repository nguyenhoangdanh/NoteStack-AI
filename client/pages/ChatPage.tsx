import React from "react";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              AI Chat Assistant
            </h1>
            <p className="text-muted-foreground">
              Get intelligent insights and assistance with your notes using AI
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +12 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Model</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GPT-4</div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  Latest
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3s</div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notes Analyzed
              </CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                In current session
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Info */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">
                  Intelligent Note Assistant
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI assistant can help you summarize notes, find
                  connections between ideas, generate insights, and answer
                  questions about your content using advanced language models.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Note Summarization</Badge>
                  <Badge variant="secondary">Content Analysis</Badge>
                  <Badge variant="secondary">Idea Connections</Badge>
                  <Badge variant="secondary">Smart Q&A</Badge>
                  <Badge variant="secondary">Writing Assistance</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="h-[600px]">
          <ChatInterface />
        </Card>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Tips for Better AI Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Be Specific</h4>
                <p className="text-sm text-muted-foreground">
                  Ask specific questions about your notes for more targeted
                  responses.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Use Context</h4>
                <p className="text-sm text-muted-foreground">
                  Reference specific notes, tags, or timeframes for better
                  understanding.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Iterate</h4>
                <p className="text-sm text-muted-foreground">
                  Build on previous responses by asking follow-up questions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Explore Connections</h4>
                <p className="text-sm text-muted-foreground">
                  Ask about relationships between different notes and topics.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Request Formats</h4>
                <p className="text-sm text-muted-foreground">
                  Ask for summaries, lists, tables, or other specific formats.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Use Examples</h4>
                <p className="text-sm text-muted-foreground">
                  Provide examples when asking for creative or analytical tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

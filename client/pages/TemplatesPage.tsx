import React from "react";
import { ArrowLeft, FileText, Globe, Lock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatesList } from "@/components/templates/TemplatesList";

export default function TemplatesPage() {
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Templates</h1>
            <p className="text-muted-foreground">
              Create reusable templates with variables to speed up your
              note-taking
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Templates
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +6 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Public Templates
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  Shared
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Meeting Notes</div>
              <p className="text-xs text-muted-foreground">67 times used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                Templates used this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Template Variables Info */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Smart Template Variables</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create dynamic templates using variables like {`{{title}}`},{" "}
                  {`{{date}}`}, {`{{description}}`}. When you use a template,
                  these will be replaced with input fields for quick
                  customization.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Dynamic Content</Badge>
                  <Badge variant="secondary">Variable Replacement</Badge>
                  <Badge variant="secondary">Quick Input Forms</Badge>
                  <Badge variant="secondary">Reusable Structures</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  All Templates
                </TabsTrigger>
                <TabsTrigger value="public" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Public
                </TabsTrigger>
                <TabsTrigger
                  value="private"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Private
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <TemplatesList />
              </TabsContent>

              <TabsContent value="public" className="mt-6">
                <TemplatesList isPublic={true} />
              </TabsContent>

              <TabsContent value="private" className="mt-6">
                <TemplatesList isPublic={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

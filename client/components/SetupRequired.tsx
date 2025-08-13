import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Terminal, ExternalLink, Copy, CheckCircle } from "lucide-react";

export default function SetupRequired() {
  const [copied, setCopied] = React.useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const isConfigured = apiUrl && !apiUrl.includes('localhost') && !apiUrl.includes('3001');

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If using local development, don't show setup screen
  if (!isConfigured) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
            <Terminal className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Backend Setup Required</h1>
          <p className="text-muted-foreground">
            Let's get your AI Notes backend configured in just a few steps
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Setup (5 minutes)</CardTitle>
            <CardDescription>
              Follow these steps to configure your NestJS backend and start using AI Notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                You'll need to run these commands in your terminal to set up the backend.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    1
                  </span>
                  Install Dependencies
                </h3>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                  <code>cd backend && npm install</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCommand("cd backend && npm install")}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    2
                  </span>
                  Setup Database
                </h3>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                  <code>npx prisma migrate dev</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCommand("npx prisma migrate dev")}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This will create the database tables using Prisma migrations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    3
                  </span>
                  Configure Environment
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Update your <code>.env</code> file with your database and API keys:
                </p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  <div>DATABASE_URL="your_database_url_here"</div>
                  <div>OPENAI_API_KEY="your_openai_api_key_here"</div>
                  <div>JWT_SECRET="your_jwt_secret_here"</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    4
                  </span>
                  Start the Backend
                </h3>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                  <code>npm run start:dev</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCommand("npm run start:dev")}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  The backend will start on port 3001. Refresh this page after starting.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-4">
                <Button asChild>
                  <a
                    href="https://docs.nestjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    NestJS Docs
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://www.prisma.io/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Prisma Docs
                  </a>
                </Button>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Note:</strong> Make sure your PostgreSQL database is running and
                accessible with the DATABASE_URL you provided.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

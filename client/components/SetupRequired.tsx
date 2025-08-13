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

  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  const isConfigured = convexUrl && !convexUrl.includes("your-project");

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConfigured) {
    return null; // Let the app load normally
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
            <Terminal className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Setup Required</h1>
          <p className="text-muted-foreground">
            Let's get your AI Notes app configured in just a few steps
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Setup (5 minutes)</CardTitle>
            <CardDescription>
              Follow these steps to configure Convex and start using AI Notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                You'll need to run these commands in your terminal to set up the
                backend.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    1
                  </span>
                  Install Convex CLI
                </h3>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                  <code>npm install -g convex</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCommand("npm install -g convex")}
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
                  Initialize Convex
                </h3>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                  <code>npx convex dev</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCommand("npx convex dev")}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This will create a Convex account and project. Follow the
                  prompts.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    3
                  </span>
                  Update Environment
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Copy your Convex URL from the terminal output and update{" "}
                  <code>.env.local</code>:
                </p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  <code>VITE_CONVEX_URL=https://your-project.convex.cloud</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    4
                  </span>
                  Restart the App
                </h3>
                <p className="text-sm text-muted-foreground">
                  Refresh this page after updating your environment variables.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-4">
                <Button asChild>
                  <a
                    href="https://docs.convex.dev/quickstart"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Convex Docs
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://github.com/get-convex/convex-auth"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Convex Auth
                  </a>
                </Button>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Optional:</strong> For AI features, you'll also need an
                OpenAI API key. Add it to your Convex environment with:{" "}
                <code>npx convex env set OPENAI_API_KEY sk-your-key</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

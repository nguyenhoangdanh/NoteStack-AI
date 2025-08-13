import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowRight,
  Brain,
  Search,
  MessageSquare,
  Zap,
  Shield,
  Users,
  Sparkles,
  FileText,
  Tags,
  Keyboard,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/notes");
    } else {
      navigate("/signup");
    }
  };

  const handleTryDemo = () => {
    navigate("/demo");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">AI Notes</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/demo"
              className="text-muted-foreground hover:text-foreground"
            >
              Demo
            </Link>
            <Link
              to="#features"
              className="text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/notes")}>
                Go to Notes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Your AI-Powered
            <br />
            Note-Taking Companion
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your thoughts into organized knowledge. AI Notes helps you
            capture, organize, and discover insights from your notes with
            intelligent search and chat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleTryDemo}>
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for intelligent note-taking
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features that make your notes work harder for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>AI Chat</CardTitle>
              <CardDescription>
                Ask questions about your notes and get intelligent answers with
                source citations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Search className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Smart Search</CardTitle>
              <CardDescription>
                Find exactly what you're looking for with semantic search that
                understands context
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Rich Editor</CardTitle>
              <CardDescription>
                Beautiful markdown editor with formatting tools and real-time
                collaboration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Tags className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Automatic tagging and organization to keep your notes structured
                and findable
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Keyboard className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>
                Lightning-fast navigation with comprehensive keyboard shortcuts for
                power users
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your notes are encrypted and stored securely. Only you have access
                to your data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to supercharge your note-taking?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who've transformed how they capture and
              organize knowledge
            </p>
            <Button size="lg" variant="secondary" onClick={handleGetStarted}>
              Start Taking Smarter Notes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">AI Notes</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 AI Notes. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

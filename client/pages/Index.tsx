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
import { ThemeToggle } from "../components/ui/theme-toggle";
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
  Heart,
  Star,
  Rocket,
  Edit3,
  Share2,
  Globe,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-500"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/20 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">AI Notes</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/demo"
                className="text-muted-foreground hover:text-blue-500 transition-colors font-medium"
              >
                Demo
              </Link>
              <Link
                to="#features"
                className="text-muted-foreground hover:text-purple-500 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                to="#pricing"
                className="text-muted-foreground hover:text-emerald-500 transition-colors font-medium"
              >
                Pricing
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate("/notes")}
                  className="btn-gradient text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                >
                  Go to Notes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild className="hover:bg-white/20 dark:hover:bg-black/20">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="btn-gradient text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-5xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-gradient">Your AI-Powered</span>
              <br />
              <span className="text-foreground">Note-Taking</span>
              <br />
              <span className="text-gradient-success">Companion</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your thoughts into organized knowledge. AI Notes helps you
              capture, organize, and discover insights from your notes with
              intelligent search and AI-powered assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="btn-gradient-success text-white font-semibold px-8 py-4 text-lg h-16 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleTryDemo}
                className="px-8 py-4 text-lg h-16 bg-white/50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-800 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
              >
                <Star className="w-5 h-5 mr-2" />
                Try Interactive Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-success mb-2">1M+</div>
                <div className="text-muted-foreground">Notes Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Powerful Features for Modern Note-Taking
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to capture, organize, and collaborate on your ideas with the power of AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-gradient shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gradient">AI Chat Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your notes and get intelligent answers with
                  source citations and context
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-gradient shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gradient-success">Semantic Search</CardTitle>
                <CardDescription>
                  Find exactly what you're looking for with AI-powered search that
                  understands context and meaning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-gradient shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/25">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gradient">Rich Markdown Editor</CardTitle>
                <CardDescription>
                  Beautiful editor with live preview, formatting tools, and
                  collaborative editing features
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-gradient shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
                  <Tags className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gradient">Smart Organization</CardTitle>
                <CardDescription>
                  Automatic tagging, categorization, and intelligent organization
                  to keep your notes structured
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-gradient shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/25">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gradient">Real-time Collaboration</CardTitle>
                <CardDescription>
                  Share notes, collaborate in real-time, and work together with
                  team members seamlessly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-gradient shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gradient">Secure & Private</CardTitle>
                <CardDescription>
                  Your notes are encrypted and stored securely. Privacy-first
                  approach with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="card-gradient shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/25 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to revolutionize your <span className="text-gradient">productivity</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of users who've transformed how they capture, organize, and discover knowledge with AI Notes.
                </p>
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="btn-gradient text-white font-semibold px-8 py-4 text-lg h-16 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start Your Journey Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/20 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gradient">AI Notes</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>© 2024 AI Notes. Made with <Heart className="w-4 h-4 inline text-red-500" /> for productivity.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

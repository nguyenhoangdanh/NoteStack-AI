import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ThemeToggle } from "../components/ui/theme-toggle";
import {
  Home,
  ArrowLeft,
  Search,
  Brain,
  Sparkles,
  Star,
  Heart,
  Zap,
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-purple-950 dark:to-red-950"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="w-full max-w-2xl relative z-10 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-black/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <ThemeToggle />
        </div>

        <Card className="card-gradient shadow-2xl border-0 backdrop-blur-xl text-center overflow-hidden">
          <CardContent className="p-12">
            {/* 404 Animation */}
            <div className="relative mb-8">
              {/* Large 404 Text */}
              <div className="text-8xl md:text-9xl font-bold text-gradient mb-4 animate-pulse">
                404
              </div>

              {/* Floating icons around 404 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute -top-8 -left-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-8 -right-8 w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce delay-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-8 -left-8 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce delay-300">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce delay-100">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                  Oops! Page Not Found
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                  The page you're looking for seems to have wandered off into the digital void.
                  But don't worry, we'll help you find your way back!
                </p>
              </div>

              {/* Fun facts */}
              <div className="bg-white/30 dark:bg-slate-800/30 rounded-xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-semibold text-muted-foreground">Fun Fact</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The first HTTP 404 error was documented in 1993. You're experiencing
                  over 30 years of web history! 🎉
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="btn-gradient text-white font-semibold px-8 py-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Link to="/notes">
                  <Button
                    variant="outline"
                    className="px-8 py-3 bg-white/50 dark:bg-slate-800/50 border-purple-200 dark:border-purple-800 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    My Notes
                  </Button>
                </Link>
              </div>

              {/* Search suggestion */}
              <div className="pt-6 border-t border-white/20 dark:border-slate-700/50">
                <p className="text-sm text-muted-foreground mb-3">
                  Looking for something specific?
                </p>
                <div className="flex items-center space-x-2 max-w-sm mx-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search for pages..."
                      className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          alert("Search functionality would help you find content (Demo mode)");
                        }
                      }}
                    />
                  </div>
                  <Button
                    size="sm"
                    className="btn-gradient-success text-white"
                    onClick={() => alert("Search functionality would help you find content (Demo mode)")}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom links */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Need help? Here are some popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/", label: "Home" },
              { href: "/notes", label: "Notes" },
              { href: "/settings", label: "Settings" },
              { href: "/login", label: "Login" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-gradient hover:underline transition-all duration-300 px-3 py-1 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

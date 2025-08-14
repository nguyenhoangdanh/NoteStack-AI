import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { DemoBanner } from "../components/DemoBanner";
import {
  Brain,
  Search,
  Plus,
  FileText,
  Sparkles,
  Settings,
  LogOut,
  Edit3,
  Trash2,
  Star,
  Calendar,
  Tag,
  Filter,
  Grid,
  List,
  MoreVertical,
  Download,
  Share2,
  Heart,
  Zap,
  BookOpen,
  Clock,
} from "lucide-react";

export default function Notes() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterTag, setFilterTag] = useState<string>("");

  // Demo notes data
  const demoNotes = [
    {
      id: "1",
      title: "Welcome to AI Notes",
      content: "# Welcome to AI Notes\n\nThis is your first note! Try creating more notes and exploring the AI features.",
      tags: ["welcome", "getting-started"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      isFavorite: true,
    },
    {
      id: "2",
      title: "Meeting Notes - Project Alpha",
      content: "## Team Meeting\n\n- Discussed project timeline\n- Assigned tasks to team members\n- Next meeting scheduled for Friday",
      tags: ["meeting", "work", "project-alpha"],
      createdAt: "2024-01-14",
      updatedAt: "2024-01-16",
      isFavorite: false,
    },
    {
      id: "3",
      title: "Recipe Ideas",
      content: "## Dinner Ideas\n\n1. Pasta with marinara sauce\n2. Grilled chicken with vegetables\n3. Stir-fry with tofu",
      tags: ["cooking", "recipes", "personal"],
      createdAt: "2024-01-13",
      updatedAt: "2024-01-13",
      isFavorite: false,
    },
    {
      id: "4",
      title: "Learning Goals 2024",
      content: "# Learning Goals\n\n- Master React and TypeScript\n- Learn AI/ML fundamentals\n- Improve design skills\n- Build 3 projects",
      tags: ["goals", "learning", "personal"],
      createdAt: "2024-01-12",
      updatedAt: "2024-01-14",
      isFavorite: true,
    },
  ];

  const allTags = Array.from(new Set(demoNotes.flatMap(note => note.tags)));

  const filteredNotes = demoNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = () => {
    // In demo mode, just show a placeholder
    alert("Demo Mode: Note creation would redirect to editor in full version");
  };

  const handleEditNote = (noteId: string) => {
    alert(`Demo Mode: Would open note ${noteId} for editing`);
  };

  const handleDeleteNote = (noteId: string) => {
    alert(`Demo Mode: Would delete note ${noteId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      {/* Header */}
      <header className="border-b border-white/20 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">AI Notes</h1>
                <p className="text-xs text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/settings")}
                className="bg-white/50 dark:bg-slate-800/50 border-purple-200 dark:border-purple-800 hover:bg-white/80 dark:hover:bg-slate-800/80"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="bg-white/50 dark:bg-slate-800/50 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <DemoBanner />

        {/* Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {filteredNotes.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gradient">{demoNotes.length}</p>
              <p className="text-sm text-muted-foreground">Total Notes</p>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  {allTags.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gradient-success">{allTags.length}</p>
              <p className="text-sm text-muted-foreground">Tags</p>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
                  {demoNotes.filter(n => n.isFavorite).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gradient">{demoNotes.filter(n => n.isFavorite).length}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-lg hover:shadow-xl transition-all duration-300 border-0 cursor-pointer group" onClick={handleCreateNote}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg font-semibold text-gradient">Create Note</p>
              <p className="text-sm text-muted-foreground">Start writing</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterTag === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTag("")}
              className={filterTag === "" ? "btn-gradient text-white" : ""}
            >
              All Notes
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={filterTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTag(tag)}
                className={filterTag === tag ? "btn-gradient text-white" : ""}
              >
                #{tag}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "btn-gradient text-white" : ""}
            >
              <Grid className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "btn-gradient text-white" : ""}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>

        {/* Notes Grid/List */}
        {filteredNotes.length === 0 ? (
          <Card className="card-gradient shadow-lg border-0 text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gradient mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `No notes match "${searchQuery}"` : "You haven't created any notes yet"}
              </p>
              <Button onClick={handleCreateNote} className="btn-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="card-gradient shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 cursor-pointer group"
                onClick={() => handleEditNote(note.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-gradient text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {note.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{note.updatedAt}</span>
                        {note.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note.id);
                        }}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {note.content.replace(/[#*]/g, '').substring(0, 120)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{note.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Tag,
  FolderOpen,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NoteCard } from "@/components/notes/NoteCard";
import { useSearchNotes } from "@/hooks/useNotes";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useCategories } from "@/hooks/useCategories";
import type { Note } from "@/types";

// Mock search results
const mockSearchResults: Note[] = [
  {
    id: "1",
    title: "React Best Practices",
    content:
      "Key principles for writing maintainable React code including component composition, state management patterns, and performance optimization techniques. These practices help ensure your codebase remains scalable and maintainable.",
    tags: ["react", "frontend", "best-practices"],
    workspaceId: "workspace-1",
    ownerId: "user-1",
    isDeleted: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    workspace: { id: "workspace-1", name: "Development" },
  },
  {
    id: "2",
    title: "TypeScript Advanced Patterns",
    content:
      "Advanced TypeScript patterns including conditional types, mapped types, and template literal types for better type safety and developer experience. These patterns unlock powerful type-level programming.",
    tags: ["typescript", "patterns", "advanced"],
    workspaceId: "workspace-1",
    ownerId: "user-1",
    isDeleted: false,
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    workspace: { id: "workspace-1", name: "Development" },
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data: workspaces } = useWorkspaces();
  const { data: categories } = useCategories();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchNotes({ q: debouncedQuery }, debouncedQuery.length > 0);

  // Use actual data if available, otherwise fallback to mock data
  const results = searchResults || (debouncedQuery ? mockSearchResults : []);

  // Apply filters and sorting
  const filteredAndSortedResults = results
    .filter((note) => {
      if (
        selectedWorkspace !== "all" &&
        note.workspaceId !== selectedWorkspace
      ) {
        return false;
      }
      if (selectedTag !== "all" && !note.tags.includes(selectedTag)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "created":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "updated":
        default:
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

  // Get all unique tags from results
  const availableTags = Array.from(
    new Set(results.flatMap((note) => note.tags)),
  ).sort();

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedWorkspace("all");
    setSelectedTag("all");
    setSortBy("updated");
    setSortOrder("desc");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient">Search</h1>
          <p className="text-muted-foreground">
            Find notes using AI-powered search. Search by content, tags, or use
            advanced filters.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search notes by content, title, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Sorting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Workspace Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace</label>
                <Select
                  value={selectedWorkspace}
                  onValueChange={setSelectedWorkspace}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workspaces</SelectItem>
                    {workspaces?.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          {workspace.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag</label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          {tag}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last Updated</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className="w-full justify-start"
                >
                  {sortOrder === "desc" ? (
                    <>
                      <SortDesc className="h-4 w-4 mr-2" />
                      Descending
                    </>
                  ) : (
                    <>
                      <SortAsc className="h-4 w-4 mr-2" />
                      Ascending
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex items-center gap-2">
              {(selectedWorkspace !== "all" ||
                selectedTag !== "all" ||
                searchQuery) && (
                <>
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary">Search: "{searchQuery}"</Badge>
                  )}
                  {selectedWorkspace !== "all" && (
                    <Badge variant="secondary">
                      Workspace:{" "}
                      {
                        workspaces?.find((w) => w.id === selectedWorkspace)
                          ?.name
                      }
                    </Badge>
                  )}
                  {selectedTag !== "all" && (
                    <Badge variant="secondary">Tag: {selectedTag}</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {debouncedQuery
                ? `Search Results (${filteredAndSortedResults.length})`
                : "Recent Notes"}
            </h2>
            {filteredAndSortedResults.length > 0 && (
              <Badge variant="outline">
                {filteredAndSortedResults.length} result
                {filteredAndSortedResults.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Loading State */}
          {isLoading && debouncedQuery && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  Search failed. Please try again.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredAndSortedResults.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-48">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {debouncedQuery ? "No results found" : "Start searching"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {debouncedQuery
                    ? "Try adjusting your search query or filters"
                    : "Enter a search query to find your notes"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results Grid */}
          {!isLoading && !error && filteredAndSortedResults.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedResults.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

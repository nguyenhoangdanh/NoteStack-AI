import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, History, Star, TrendingUp } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAdvancedSearch,
  useSearchHistory,
  usePopularQueries,
  useSavedSearches,
} from "@/hooks/useSearch";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/search/SearchFilters";
import type {
  AdvancedSearchRequest,
  SearchResult,
  SearchHistory,
  SavedSearch,
  PopularQuery,
} from "@/types";

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "React Performance Optimization",
    content:
      "Detailed guide on optimizing React applications for better performance including memoization, lazy loading, and bundle splitting.",
    excerpt:
      "This comprehensive guide covers various techniques to optimize React applications, including component memoization with React.memo, lazy loading with React.lazy, and code splitting strategies.",
    score: 0.95,
    highlights: ["React", "performance", "optimization", "memoization"],
    reasons: ["Title match", "Content relevance", "Tag match"],
    workspace: { id: "1", name: "Development" },
    tags: ["react", "performance", "optimization"],
    categories: [{ name: "Development", color: "#3B82F6" }],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    wordCount: 1250,
    hasAttachments: true,
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    content:
      "Essential TypeScript patterns and practices for building scalable applications with better type safety.",
    excerpt:
      "Learn about advanced TypeScript patterns including utility types, conditional types, and mapped types for building robust applications.",
    score: 0.87,
    highlights: ["TypeScript", "patterns", "types"],
    reasons: ["Content match", "Category relevance"],
    workspace: { id: "1", name: "Development" },
    tags: ["typescript", "patterns", "types"],
    categories: [{ name: "Development", color: "#3B82F6" }],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    wordCount: 980,
    hasAttachments: false,
  },
];

const mockSearchHistory: SearchHistory[] = [
  {
    id: "1",
    userId: "user-1",
    query: "React hooks",
    filters: {},
    resultCount: 12,
    searchedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    query: "TypeScript interfaces",
    filters: {},
    resultCount: 8,
    searchedAt: "2024-01-15T09:15:00Z",
  },
];

const mockPopularQueries: PopularQuery[] = [
  { query: "React", count: 45 },
  { query: "TypeScript", count: 32 },
  { query: "performance", count: 28 },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<AdvancedSearchRequest>({
    query: searchParams.get("q") || "",
    sortBy: "relevance",
    sortOrder: "desc",
    limit: 20,
  });

  const {
    data: searchResults,
    isPending: isSearching,
    mutate: performSearch,
  } = useAdvancedSearch();
  const { data: searchHistory } = useSearchHistory();
  const { data: popularQueries } = usePopularQueries();
  const { data: savedSearches } = useSavedSearches();

  const finalResults =
    searchResults?.results || (query ? mockSearchResults : []);
  const finalHistory = searchHistory || mockSearchHistory;
  const finalPopular = popularQueries || mockPopularQueries;

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      setFilters((prev) => ({ ...prev, query: urlQuery }));
      performSearch({ ...filters, query: urlQuery });
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (query.trim()) {
      const newFilters = { ...filters, query: query.trim() };
      setFilters(newFilters);
      performSearch(newFilters);
      setSearchParams({ q: query.trim() });
    }
  };

  const handleFiltersChange = (newFilters: Partial<AdvancedSearchRequest>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (query.trim()) {
      performSearch(updatedFilters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters: AdvancedSearchRequest = {
      query: filters.query,
      sortBy: "relevance",
      sortOrder: "desc",
      limit: 20,
    };
    setFilters(clearedFilters);
    if (query.trim()) {
      performSearch(clearedFilters);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // TODO: Navigate to note detail
    console.log("Open note:", result.id);
  };

  const handleQuerySelect = (selectedQuery: string) => {
    setQuery(selectedQuery);
    const newFilters = { ...filters, query: selectedQuery };
    setFilters(newFilters);
    performSearch(newFilters);
    setSearchParams({ q: selectedQuery });
  };

  const showSuggestions = !query.trim() && finalHistory.length > 0;

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
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Advanced Search
            </h1>
            <p className="text-muted-foreground">
              Find exactly what you're looking for with powerful search and
              filters
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search your notes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                className="btn-gradient h-12 px-8"
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <SearchFilters
              filters={filters}
              facets={searchResults?.facets}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Suggestions when no query */}
            {showSuggestions && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Searches */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Recent Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {finalHistory.slice(0, 5).map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-between text-left h-auto p-3"
                        onClick={() => handleQuerySelect(item.query)}
                      >
                        <div>
                          <div className="font-medium">{item.query}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.resultCount} results •{" "}
                            {new Date(item.searchedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Popular Queries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Popular Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {finalPopular.slice(0, 5).map((item) => (
                      <Button
                        key={item.query}
                        variant="ghost"
                        className="w-full justify-between text-left h-auto p-3"
                        onClick={() => handleQuerySelect(item.query)}
                      >
                        <div className="font-medium">{item.query}</div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search Results */}
            {(query.trim() || finalResults.length > 0) && (
              <SearchResults
                results={finalResults}
                isLoading={isSearching}
                query={query}
                total={searchResults?.total}
                onResultClick={handleResultClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

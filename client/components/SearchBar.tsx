import React, { useState, useEffect, useRef } from "react";
import { Search, X, FileText, MessageSquare } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useSearchNotes, useSemanticSearch } from "../hooks/useApi";
import { useUIStore } from "../lib/store";
import { useChatStore } from "../lib/store";
import { cn } from "../lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  className,
  placeholder = "Search notes...",
  autoFocus,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState<"text" | "semantic">("text");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { setSelectedNoteId, setChatOpen, setCommandPaletteOpen } = useUIStore();
  const { setInput, addMessage } = useChatStore();

  const { data: textResults } = useSearchNotes(
    { q: query }, 
    query.trim().length > 0 && searchType === "text"
  );
  
  const semanticSearch = useSemanticSearch();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    
    // Switch to semantic search for longer queries
    if (value.length > 10) {
      setSearchType("semantic");
      if (value.trim()) {
        semanticSearch.mutate({ query: value.trim() });
      }
    } else {
      setSearchType("text");
    }
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setQuery("");
    setIsOpen(false);
    setCommandPaletteOpen(false);
  };

  const handleAskQuestion = () => {
    if (query.trim()) {
      addMessage({
        role: "user",
        content: query.trim(),
      });
      setInput(query.trim());
      setChatOpen(true);
      setQuery("");
      setIsOpen(false);
      setCommandPaletteOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      setIsOpen(false);
      setCommandPaletteOpen(false);
    } else if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const results = searchType === "semantic" && semanticSearch.data 
        ? semanticSearch.data 
        : textResults;
      
      if (results && results.length > 0) {
        // Handle both text and semantic search results
        const firstResult = searchType === "semantic" && semanticSearch.data 
          ? semanticSearch.data[0].noteId  // Use noteId for semantic results
          : (results as any[])[0].id;      // Use id for text results
        handleSelectNote(firstResult);
      } else {
        handleAskQuestion();
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getSearchResults = () => {
    if (searchType === "semantic" && semanticSearch.data) {
      return semanticSearch.data.map(result => ({
        id: result.noteId, // Use noteId from semantic search result
        title: result.noteTitle,
        content: result.chunkContent,
        tags: [],
        heading: result.heading,
        similarity: result.similarity,
      }));
    }
    // For text search, notes already have the correct structure
    return textResults || [];
  };

  const searchResults = getSearchResults();

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (
        <Card
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-auto z-50 shadow-lg"
        >
          <div className="p-2">
            {/* Search type indicator */}
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <Badge variant={searchType === "text" ? "default" : "secondary"} className="text-xs">
                Text Search
              </Badge>
              <Badge variant={searchType === "semantic" ? "default" : "secondary"} className="text-xs">
                Semantic Search
              </Badge>
              {semanticSearch.isPending && (
                <span className="text-xs text-muted-foreground">Searching...</span>
              )}
            </div>

            {searchResults.length > 0 ? (
              <>
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.id + index}
                      onClick={() => handleSelectNote(result.id)}
                      className="flex items-start gap-3 p-3 rounded-md hover:bg-muted cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {result.title}
                          {result.heading && (
                            <span className="text-muted-foreground">{' > '}{result.heading}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {result.content.substring(0, 150)}
                          {result.content.length > 150 && "..."}
                        </div>
                        {result.similarity && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Similarity: {Math.round(result.similarity * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ask AI option */}
                <div className="border-t mt-2 pt-2">
                  <div
                    onClick={handleAskQuestion}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Ask my notes: "{query}"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Use AI to get answers from your notes
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : query.length > 0 && !semanticSearch.isPending ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm mb-2">No notes found for "{query}"</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAskQuestion}
                  className="text-xs"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Ask AI about this
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}


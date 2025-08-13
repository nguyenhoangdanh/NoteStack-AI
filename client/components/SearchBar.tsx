import React, { useState, useEffect, useRef } from "react";
import { Search, X, FileText, MessageSquare } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { useSearchNotes } from "../lib/query";
import { useUIStore } from "../lib/store";
import { useChatStore } from "../lib/store";
import type { Id } from "../../convex/_generated/dataModel";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { setSelectedNoteId, setChatOpen, setCommandPaletteOpen } =
    useUIStore();
  const { setInput, addMessage } = useChatStore();

  const searchResults = useSearchNotes(query);

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
  };

  const handleSelectNote = (noteId: Id<"notes">) => {
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
      if (searchResults && searchResults.length > 0) {
        handleSelectNote(searchResults[0]._id);
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

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

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
            {searchResults && searchResults.length > 0 ? (
              <>
                <div className="space-y-1">
                  {searchResults.map((note) => (
                    <div
                      key={note._id}
                      onClick={() => handleSelectNote(note._id)}
                      className="flex items-start gap-3 p-3 rounded-md hover:bg-muted cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {highlightMatch(note.title, query)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {highlightMatch(
                            note.content
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 100),
                            query,
                          )}
                          {note.content.length > 100 && "..."}
                        </div>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3}
                              </Badge>
                            )}
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
                        Use AI to search through your notes semantically
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : query.length > 0 ? (
              <div className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-3">
                  No notes found for "{query}"
                </div>
                <Button
                  onClick={handleAskQuestion}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask my notes instead
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}

import React from "react";
import {
  FileText,
  Calendar,
  Tag,
  Folder,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/types";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  query?: string;
  total?: number;
  onResultClick?: (result: SearchResult) => void;
}

function SearchResultCard({
  result,
  query,
  onClick,
}: {
  result: SearchResult;
  query?: string;
  onClick?: (result: SearchResult) => void;
}) {
  const handleClick = () => {
    onClick?.(result);
  };

  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length || !query) return text;

    let highlightedText = text;
    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>',
      );
    });

    return highlightedText;
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] group"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold truncate group-hover:text-primary transition-colors"
              dangerouslySetInnerHTML={{
                __html: highlightText(result.title, result.highlights),
              }}
            />
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                <span>{result.workspace.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(result.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{result.wordCount} words</span>
              </div>
              {result.hasAttachments && (
                <Badge variant="secondary" className="text-xs">
                  Has attachments
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {Math.round(result.score * 100)}% match
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p
          className="text-sm text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: highlightText(result.excerpt, result.highlights),
          }}
        />

        {result.reasons.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lightbulb className="h-3 w-3" />
              <span>Match reasons:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {result.reasons.slice(0, 3).map((reason, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {reason}
                </Badge>
              ))}
              {result.reasons.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{result.reasons.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {result.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {result.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {result.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{result.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {result.categories.length > 0 && (
            <div className="flex gap-1">
              {result.categories.slice(0, 2).map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: category.color }}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchResults({
  results,
  isLoading,
  query,
  total,
  onResultClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground text-center">
            {query
              ? `No notes match your search for "${query}"`
              : "Try entering a search query or adjusting your filters"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total ? `${total} results` : `${results.length} results`}
          {query && (
            <span>
              {" "}
              for <strong>"{query}"</strong>
            </span>
          )}
        </p>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard
            key={result.id}
            result={result}
            query={query}
            onClick={onResultClick}
          />
        ))}
      </div>
    </div>
  );
}

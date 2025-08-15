import React from "react";
import { Filter, Calendar, Tag, Folder, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AdvancedSearchRequest, SearchFacets } from "@/types";

interface SearchFiltersProps {
  filters: AdvancedSearchRequest;
  facets?: SearchFacets;
  onFiltersChange: (filters: Partial<AdvancedSearchRequest>) => void;
  onClearFilters: () => void;
}

export function SearchFilters({
  filters,
  facets,
  onFiltersChange,
  onClearFilters,
}: SearchFiltersProps) {
  const hasActiveFilters = !!(
    filters.workspaceId ||
    filters.tags?.length ||
    filters.categories?.length ||
    filters.dateRange ||
    filters.hasAttachments ||
    filters.wordCountRange ||
    filters.lastModifiedDays
  );

  return (
    <Card className="w-80">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" defaultValue={["workspaces", "date", "content"]} className="w-full">
          {/* Workspaces */}
          <AccordionItem value="workspaces">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Workspaces
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Select
                value={filters.workspaceId || ""}
                onValueChange={(value) => 
                  onFiltersChange({ workspaceId: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All workspaces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All workspaces</SelectItem>
                  {facets?.workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{workspace.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {workspace.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Date Range */}
          <AccordionItem value="date">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-from" className="text-xs">From</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateRange?.from || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        dateRange: {
                          ...filters.dateRange,
                          from: e.target.value,
                          to: filters.dateRange?.to || "",
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs">To</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateRange?.to || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        dateRange: {
                          from: filters.dateRange?.from || "",
                          to: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              
              {facets && (
                <div className="space-y-2">
                  <Label className="text-xs">Quick filters</Label>
                  <div className="space-y-1">
                    {facets.dateRanges.last7Days > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-xs h-8"
                        onClick={() => {
                          const date = new Date();
                          date.setDate(date.getDate() - 7);
                          onFiltersChange({
                            dateRange: {
                              from: date.toISOString().split('T')[0],
                              to: new Date().toISOString().split('T')[0],
                            },
                          });
                        }}
                      >
                        Last 7 days
                        <Badge variant="secondary" className="text-xs">
                          {facets.dateRanges.last7Days}
                        </Badge>
                      </Button>
                    )}
                    {facets.dateRanges.last30Days > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-xs h-8"
                        onClick={() => {
                          const date = new Date();
                          date.setDate(date.getDate() - 30);
                          onFiltersChange({
                            dateRange: {
                              from: date.toISOString().split('T')[0],
                              to: new Date().toISOString().split('T')[0],
                            },
                          });
                        }}
                      >
                        Last 30 days
                        <Badge variant="secondary" className="text-xs">
                          {facets.dateRanges.last30Days}
                        </Badge>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Tags */}
          <AccordionItem value="tags">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {facets?.tags.slice(0, 10).map((tag) => (
                <div key={tag.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.name}`}
                    checked={filters.tags?.includes(tag.name) || false}
                    onCheckedChange={(checked) => {
                      const currentTags = filters.tags || [];
                      const newTags = checked
                        ? [...currentTags, tag.name]
                        : currentTags.filter((t) => t !== tag.name);
                      onFiltersChange({ tags: newTags });
                    }}
                  />
                  <Label
                    htmlFor={`tag-${tag.name}`}
                    className="text-sm flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>{tag.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {tag.count}
                    </Badge>
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Content Filters */}
          <AccordionItem value="content">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-attachments"
                  checked={filters.hasAttachments || false}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ hasAttachments: checked || undefined })
                  }
                />
                <Label htmlFor="has-attachments" className="text-sm">
                  Has attachments
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Word count range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.wordCountRange?.min || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        wordCountRange: {
                          ...filters.wordCountRange,
                          min: e.target.value ? parseInt(e.target.value) : 0,
                          max: filters.wordCountRange?.max || 0,
                        },
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.wordCountRange?.max || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        wordCountRange: {
                          min: filters.wordCountRange?.min || 0,
                          max: e.target.value ? parseInt(e.target.value) : 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

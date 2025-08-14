import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { SearchIcon, BrainIcon, SparklesIcon, XIcon } from 'lucide-react';
import { Note } from '@/types';

interface SemanticSearchProps {
    onSearch: (query: string) => void;
    onClose: () => void;
    searchResults?: Note[];
    loading?: boolean;
}

export function SemanticSearch({ onSearch, onClose, searchResults = [], loading = false }: SemanticSearchProps) {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'semantic' | 'keyword'>('semantic');

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    const exampleQueries = [
        "Notes about machine learning concepts",
        "Research on user interface design",
        "Meeting notes from last month",
        "Ideas related to productivity",
        "Technical documentation"
    ];

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BrainIcon className="h-5 w-5 text-primary" />
                        <CardTitle>Semantic Search</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
                <CardDescription>
                    Search your notes by meaning and concepts, not just keywords
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Search Type Toggle */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Search type:</span>
                    <div className="flex space-x-1">
                        <Button
                            variant={searchType === 'semantic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSearchType('semantic')}
                        >
                            <SparklesIcon className="h-4 w-4 mr-1" />
                            Semantic
                        </Button>
                        <Button
                            variant={searchType === 'keyword' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSearchType('keyword')}
                        >
                            <SearchIcon className="h-4 w-4 mr-1" />
                            Keyword
                        </Button>
                    </div>
                </div>

                {/* Search Input */}
                <div className="flex space-x-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={
                                searchType === 'semantic'
                                    ? "Describe what you're looking for conceptually..."
                                    : "Enter keywords to search for..."
                            }
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={!query.trim() || loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>

                {/* Example Queries */}
                {!searchResults.length && !loading && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium">Try these example searches:</h4>
                        <div className="flex flex-wrap gap-2">
                            {exampleQueries.map((example, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuery(example)}
                                    className="text-xs"
                                >
                                    {example}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                            </h4>
                            <Badge variant="secondary">
                                {searchType === 'semantic' ? 'Semantic' : 'Keyword'} search
                            </Badge>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {searchResults.map((note) => (
                                <Card key={note.id} className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h5 className="font-medium text-sm">{note.title}</h5>
                                            <Badge variant="outline" className="text-xs">
                                                {new Date(note.updatedAt).toLocaleDateString()}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {note.content?.substring(0, 150)}...
                                        </p>

                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {note.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {note.tags.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{note.tags.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center space-y-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm text-muted-foreground">
                                {searchType === 'semantic' ? 'Analyzing semantic meaning...' : 'Searching notes...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && query && searchResults.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                            No notes found matching "{query}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Try adjusting your search terms or switching to {searchType === 'semantic' ? 'keyword' : 'semantic'} search
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

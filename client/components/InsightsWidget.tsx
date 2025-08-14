import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
    TrendingUpIcon,
    FileTextIcon,
    TagIcon,
    ClockIcon,
    BrainIcon,
    TargetIcon
} from 'lucide-react';
import { Note } from '@/types';

interface InsightsWidgetProps {
    notes: Note[];
}

export function InsightsWidget({ notes }: InsightsWidgetProps) {
    // Calculate insights
    const totalNotes = notes.length;
    const totalWords = notes.reduce((acc, note) => acc + (note.content?.split(' ').length || 0), 0);
    const avgWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;

    // Calculate tags frequency
    const tagFrequency = notes.reduce((acc, note) => {
        note.tags?.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagFrequency)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5);

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentNotes = notes.filter(note =>
        new Date(note.createdAt) > sevenDaysAgo
    ).length;

    // Calculate productivity score (mock calculation)
    const productivityScore = Math.min(100, Math.round(
        (recentNotes * 10) +
        (totalNotes > 0 ? 20 : 0) +
        (avgWordsPerNote > 100 ? 20 : avgWordsPerNote / 5) +
        (topTags.length * 5)
    ));

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                        <TrendingUpIcon className="h-4 w-4" />
                        <span>Quick Insights</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Total Notes */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Total Notes</span>
                        </div>
                        <Badge variant="secondary">{totalNotes}</Badge>
                    </div>

                    {/* Recent Activity */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">This Week</span>
                        </div>
                        <Badge variant={recentNotes > 0 ? "default" : "secondary"}>
                            {recentNotes}
                        </Badge>
                    </div>

                    {/* Average Words */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BrainIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Avg Words</span>
                        </div>
                        <Badge variant="outline">{avgWordsPerNote}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Productivity Score */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                        <TargetIcon className="h-4 w-4" />
                        <span>Productivity</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Score</span>
                            <span className="text-sm font-medium">{productivityScore}/100</span>
                        </div>
                        <Progress value={productivityScore} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {productivityScore >= 80 ? 'Excellent!' :
                                productivityScore >= 60 ? 'Good progress' :
                                    productivityScore >= 40 ? 'Keep going' :
                                        'Getting started'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Top Tags */}
            {topTags.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 text-base">
                            <TagIcon className="h-4 w-4" />
                            <span>Top Tags</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topTags.map(([tag, count]) => (
                                <div key={tag} className="flex items-center justify-between">
                                    <span className="text-sm truncate">{tag}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {count as React.ReactNode}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Writing Goals */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Writing Goal</CardTitle>
                    <CardDescription className="text-xs">
                        Weekly target: 5 notes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">{Math.min(recentNotes, 5)}/5</span>
                        </div>
                        <Progress value={(recentNotes / 5) * 100} className="h-2" />
                        {recentNotes >= 5 ? (
                            <p className="text-xs text-green-600">Goal achieved! 🎉</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {5 - recentNotes} more to reach your goal
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

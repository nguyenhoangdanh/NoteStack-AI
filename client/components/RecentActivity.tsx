import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    FileTextIcon,
    EditIcon,
    ShareIcon,
    MessageCircleIcon,
    UsersIcon,
    ClockIcon
} from 'lucide-react';

interface Activity {
    id: string;
    type: 'note_created' | 'note_updated' | 'note_shared' | 'chat_message' | 'collaboration';
    title: string;
    description: string;
    timestamp: string;
    user?: {
        name: string;
        image?: string;
    };
}

export function RecentActivity() {
    // Mock recent activity data
    const activities: Activity[] = [
        {
            id: '1',
            type: 'note_created',
            title: 'New note created',
            description: 'Meeting Notes - Project Alpha',
            timestamp: '2 hours ago',
            user: { name: 'You' }
        },
        {
            id: '2',
            type: 'note_updated',
            title: 'Note updated',
            description: 'Research Findings - AI Trends',
            timestamp: '4 hours ago',
            user: { name: 'You' }
        },
        {
            id: '3',
            type: 'chat_message',
            title: 'AI Chat session',
            description: 'Asked about summarization techniques',
            timestamp: '6 hours ago',
            user: { name: 'You' }
        },
        {
            id: '4',
            type: 'note_shared',
            title: 'Note shared',
            description: 'Quarterly Review shared with team',
            timestamp: '1 day ago',
            user: { name: 'You' }
        },
        {
            id: '5',
            type: 'collaboration',
            title: 'Collaboration invite',
            description: 'John Doe invited to "Project Beta"',
            timestamp: '2 days ago',
            user: { name: 'John Doe', image: undefined }
        }
    ];

    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'note_created':
                return <FileTextIcon className="h-4 w-4 text-green-600" />;
            case 'note_updated':
                return <EditIcon className="h-4 w-4 text-blue-600" />;
            case 'note_shared':
                return <ShareIcon className="h-4 w-4 text-purple-600" />;
            case 'chat_message':
                return <MessageCircleIcon className="h-4 w-4 text-orange-600" />;
            case 'collaboration':
                return <UsersIcon className="h-4 w-4 text-indigo-600" />;
            default:
                return <ClockIcon className="h-4 w-4 text-gray-600" />;
        }
    };

    const getActivityColor = (type: Activity['type']) => {
        switch (type) {
            case 'note_created':
                return 'bg-green-50 border-green-200';
            case 'note_updated':
                return 'bg-blue-50 border-blue-200';
            case 'note_shared':
                return 'bg-purple-50 border-purple-200';
            case 'chat_message':
                return 'bg-orange-50 border-orange-200';
            case 'collaboration':
                return 'bg-indigo-50 border-indigo-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                    <ClockIcon className="h-4 w-4" />
                    <span>Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-xs">
                    Your latest actions and updates
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getActivityIcon(activity.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {activity.title}
                                        </p>
                                        <Badge variant="outline" className="text-xs ml-2">
                                            {activity.timestamp}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-gray-600 mt-1 truncate">
                                        {activity.description}
                                    </p>

                                    {activity.user && activity.user.name !== 'You' && (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src={activity.user.image} alt={activity.user.name} />
                                                <AvatarFallback className="text-xs">
                                                    {activity.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-gray-500">{activity.user.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        View all activity →
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

# Activities API

User activity tracking system with comprehensive analytics, productivity insights, and behavior analysis.

## 📋 Overview

The activities system tracks all user interactions across the platform, providing detailed analytics, productivity insights, and behavioral patterns. It enables users to understand their work habits and optimize their productivity.

### Features
- ✅ Comprehensive activity logging across all features
- ✅ Productivity analytics and time tracking
- ✅ Activity timeline and history
- ✅ Goal setting and achievement tracking
- ✅ Personalized insights and recommendations
- ✅ Activity export and reporting
- ✅ Team collaboration analytics
- ✅ Background data processing

## 🔐 Endpoints

### GET /activities

Get user activities with filtering and pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `action` (string, optional) - Filter by action type
- `noteId` (string, optional) - Filter by specific note
- `dateFrom` (ISO string, optional) - Activities from date
- `dateTo` (ISO string, optional) - Activities to date
- `limit` (number, optional, default: 20) - Maximum activities
- `offset` (number, optional) - Pagination offset

**Success Response (200):**
```json
{
  "success": true,
  "activities": [
    {
      "id": "cm4act123",
      "userId": "cm4user123",
      "action": "NOTE_CREATED",
      "noteId": "cm4note123",
      "metadata": {
        "noteTitle": "React Development Guide",
        "wordCount": 245,
        "tags": ["react", "javascript"],
        "workspaceName": "Development"
      },
      "createdAt": "2024-01-15T14:30:00.000Z",
      "user": {
        "id": "cm4user123",
        "name": "John Doe",
        "image": "https://avatar.com/john.jpg"
      },
      "note": {
        "id": "cm4note123",
        "title": "React Development Guide",
        "tags": ["react", "javascript"]
      }
    },
    {
      "id": "cm4act124",
      "userId": "cm4user123",
      "action": "SEARCH_PERFORMED",
      "noteId": null,
      "metadata": {
        "query": "React hooks tutorial",
        "resultCount": 12,
        "searchTime": 245
      },
      "createdAt": "2024-01-15T14:15:00.000Z",
      "user": {
        "id": "cm4user123",
        "name": "John Doe",
        "image": "https://avatar.com/john.jpg"
      },
      "note": null
    }
  ],
  "total": 156,
  "hasMore": true
}
```

**Activity Action Types:**
- `NOTE_CREATED`, `NOTE_UPDATED`, `NOTE_DELETED`, `NOTE_VIEWED`
- `SEARCH_PERFORMED`, `TAG_ADDED`, `TAG_REMOVED`
- `COLLABORATION_INVITED`, `COLLABORATION_JOINED`
- `SHARE_LINK_CREATED`, `SHARE_LINK_ACCESSED`
- `VERSION_CREATED`, `VERSION_RESTORED`
- `CATEGORY_ASSIGNED`, `SUMMARY_GENERATED`
- `TEMPLATE_USED`, `ATTACHMENT_UPLOADED`
- `POMODORO_STARTED`, `POMODORO_COMPLETED`

---

### GET /activities/timeline

Get activity timeline with intelligent grouping.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (string, optional, default: 'week') - Timeline period (`day`, `week`, `month`)
- `groupBy` (string, optional, default: 'day') - Grouping method (`hour`, `day`, `week`)

**Success Response (200):**
```json
{
  "success": true,
  "period": "week",
  "timeline": [
    {
      "date": "2024-01-15",
      "totalActivities": 28,
      "productiveTime": 195,
      "topActions": [
        {
          "action": "NOTE_UPDATED",
          "count": 12
        },
        {
          "action": "NOTE_VIEWED",
          "count": 8
        }
      ],
      "hourlyDistribution": {
        "9": 3,
        "10": 8,
        "11": 5,
        "14": 7,
        "15": 5
      },
      "activities": [
        {
          "id": "cm4act123",
          "action": "NOTE_CREATED",
          "metadata": {
            "noteTitle": "React Guide",
            "wordCount": 245
          },
          "createdAt": "2024-01-15T14:30:00.000Z"
        }
      ]
    }
  ],
  "summary": {
    "totalActivities": 156,
    "averagePerDay": 22.3,
    "mostActiveHour": 10,
    "peakDay": "2024-01-15"
  }
}
```

---

### GET /activities/insights

Get personalized productivity insights and analytics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (string, optional, default: 'month') - Analysis period
- `includeRecommendations` (boolean, optional, default: true) - Include AI recommendations

**Success Response (200):**
```json
{
  "success": true,
  "period": "month",
  "insights": {
    "productivityScore": 78,
    "totalActivities": 1247,
    "focusTime": 2340,
    "averageSessionLength": 45,
    "streakDays": 12,
    "topProductiveHours": [10, 14, 15],
    "workPatterns": {
      "preferredWorkingHours": "9AM - 6PM",
      "peakFocusTime": "10AM - 11AM",
      "mostProductiveDays": ["Tuesday", "Wednesday", "Thursday"],
      "averageBreakTime": 15
    },
    "contentMetrics": {
      "notesCreated": 45,
      "wordsWritten": 12450,
      "averageNoteLength": 276,
      "categoriesUsed": 8,
      "tagsApplied": 156
    },
    "collaborationMetrics": {
      "collaborationsJoined": 8,
      "notesShared": 12,
      "commentsAdded": 23,
      "versionsCreated": 34
    },
    "learningMetrics": {
      "searchesPerformed": 89,
      "knowledgeConnections": 67,
      "templatesUsed": 5,
      "summariesGenerated": 23
    }
  },
  "recommendations": [
    {
      "type": "PRODUCTIVITY_TIP",
      "title": "Optimize Your Peak Hours",
      "description": "You're most productive between 10-11AM. Consider scheduling important tasks during this time.",
      "actionable": true,
      "priority": "HIGH",
      "category": "TIME_MANAGEMENT"
    },
    {
      "type": "CONTENT_SUGGESTION",
      "title": "Improve Note Organization",
      "description": "You have 23 uncategorized notes. Auto-categorization could help organize them.",
      "actionable": true,
      "priority": "MEDIUM",
      "category": "ORGANIZATION"
    }
  ],
  "trends": {
    "productivityTrend": "IMPROVING",
    "focusTimeTrend": "STABLE",
    "creationTrend": "INCREASING",
    "collaborationTrend": "STABLE"
  }
}
```

---

### GET /activities/stats

Get comprehensive activity statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (string, optional, default: 'all') - Statistics period

**Success Response (200):**
```json
{
  "success": true,
  "period": "all",
  "stats": {
    "overview": {
      "totalActivities": 2456,
      "totalFocusTime": 14580,
      "activeDays": 89,
      "longestStreak": 15,
      "currentStreak": 7
    },
    "byAction": {
      "NOTE_CREATED": 234,
      "NOTE_UPDATED": 567,
      "NOTE_VIEWED": 1234,
      "SEARCH_PERFORMED": 189,
      "COLLABORATION_JOINED": 23,
      "SHARE_LINK_CREATED": 45
    },
    "byPeriod": {
      "thisWeek": 156,
      "lastWeek": 134,
      "thisMonth": 678,
      "lastMonth": 589
    },
    "byHour": {
      "0": 12, "1": 5, "2": 2, "3": 1,
      "9": 89, "10": 156, "11": 134, "12": 67,
      "13": 45, "14": 123, "15": 98, "16": 76
    },
    "byDayOfWeek": {
      "monday": 234,
      "tuesday": 345,
      "wednesday": 298,
      "thursday": 278,
      "friday": 189,
      "saturday": 67,
      "sunday": 45
    }
  }
}
```

---

### POST /activities/goals

Create or update productivity goals.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "goals": [
    {
      "type": "DAILY_FOCUS_TIME",
      "target": 120,
      "unit": "minutes",
      "period": "daily"
    },
    {
      "type": "NOTES_CREATED",
      "target": 10,
      "unit": "count",
      "period": "weekly"
    },
    {
      "type": "COLLABORATION_SCORE",
      "target": 80,
      "unit": "percentage",
      "period": "monthly"
    }
  ]
}
```

**Goal Types:**
- `DAILY_FOCUS_TIME`, `WEEKLY_FOCUS_TIME`, `MONTHLY_FOCUS_TIME`
- `NOTES_CREATED`, `WORDS_WRITTEN`, `SEARCHES_PERFORMED`
- `COLLABORATION_SCORE`, `KNOWLEDGE_CONNECTIONS`
- `STREAK_DAYS`, `PRODUCTIVITY_SCORE`

**Success Response (201):**
```json
{
  "success": true,
  "goals": [
    {
      "id": "cm4goal123",
      "userId": "cm4user123",
      "type": "DAILY_FOCUS_TIME",
      "target": 120,
      "unit": "minutes",
      "period": "daily",
      "currentProgress": 95,
      "progressPercentage": 79.2,
      "isActive": true,
      "createdAt": "2024-01-15T16:00:00.000Z",
      "updatedAt": "2024-01-15T16:00:00.000Z"
    }
  ],
  "message": "Goals updated successfully"
}
```

---

### GET /activities/goals

Get current productivity goals and progress.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "goals": [
    {
      "id": "cm4goal123",
      "type": "DAILY_FOCUS_TIME",
      "target": 120,
      "unit": "minutes",
      "period": "daily",
      "currentProgress": 95,
      "progressPercentage": 79.2,
      "isActive": true,
      "streak": 5,
      "bestStreak": 12,
      "lastAchieved": "2024-01-14T23:59:59.999Z",
      "history": [
        {
          "date": "2024-01-15",
          "progress": 95,
          "achieved": false
        },
        {
          "date": "2024-01-14",
          "progress": 135,
          "achieved": true
        }
      ]
    }
  ],
  "summary": {
    "activeGoals": 3,
    "achievedToday": 2,
    "overallProgress": 76.5
  }
}
```

---

### GET /activities/export

Export activity data in various formats.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `format` (string, required) - Export format (`csv`, `json`, `pdf`)
- `period` (string, optional, default: 'month') - Data period
- `includeMetadata` (boolean, optional, default: true) - Include detailed metadata

**Success Response (200):**
```json
{
  "success": true,
  "export": {
    "id": "cm4export123",
    "format": "csv",
    "period": "month",
    "recordCount": 1247,
    "fileSize": "2.3 MB",
    "downloadUrl": "https://api.domain.com/exports/cm4export123.csv",
    "expiresAt": "2024-01-22T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z"
  },
  "message": "Export completed successfully"
}
```

---

### POST /activities/track

Manually track a custom activity.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "action": "CUSTOM_STUDY_SESSION",
  "noteId": "cm4note123",
  "metadata": {
    "duration": 45,
    "topic": "React Hooks",
    "effectiveness": 8,
    "notes": "Good focused session"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "activity": {
    "id": "cm4act789",
    "userId": "cm4user123",
    "action": "CUSTOM_STUDY_SESSION",
    "noteId": "cm4note123",
    "metadata": {
      "duration": 45,
      "topic": "React Hooks",
      "effectiveness": 8,
      "notes": "Good focused session"
    },
    "createdAt": "2024-01-15T16:30:00.000Z"
  },
  "message": "Activity tracked successfully"
}
```

---

### GET /activities/team/:workspaceId

Get team activity analytics for workspace collaboration.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `workspaceId` (string) - Workspace ID

**Query Parameters:**
- `period` (string, optional, default: 'week') - Analysis period
- `includeIndividual` (boolean, optional, default: false) - Include individual user data

**Success Response (200):**
```json
{
  "success": true,
  "workspaceId": "cm4workspace123",
  "period": "week",
  "teamAnalytics": {
    "totalMembers": 5,
    "activeMembers": 4,
    "totalActivities": 567,
    "collaborationScore": 85,
    "teamProductivity": {
      "notesCreated": 34,
      "collaborationsStarted": 12,
      "versionsCreated": 45,
      "knowledgeShared": 23
    },
    "memberContributions": [
      {
        "userId": "cm4user123",
        "name": "John Doe",
        "activitiesCount": 156,
        "contributionScore": 92,
        "specializations": ["React", "JavaScript"],
        "lastActive": "2024-01-15T15:30:00.000Z"
      }
    ],
    "collaborationPatterns": {
      "mostCollaborativeHours": [10, 14, 15],
      "peakCollaborationDays": ["Tuesday", "Wednesday"],
      "averageResponseTime": "2.5 hours",
      "knowledgeSharingScore": 78
    }
  }
}
```

## 🔧 Activity Tracking Features

### Automatic Activity Logging

The system automatically tracks:

1. **Content Activities**
   - Note creation, updates, deletion
   - Content viewing and reading time
   - Tag and category assignments

2. **Search and Discovery**
   - Search queries and results
   - Related note discoveries
   - Knowledge connections

3. **Collaboration Activities**
   - Invitations sent/received
   - Real-time editing sessions
   - Version control actions

4. **Productivity Actions**
   - Focus sessions and time tracking
   - Goal achievements
   - Template usage

### Smart Analytics Engine

```typescript
// Activity analysis factors
const analyticsFactors = {
  productivityScore: {
    focusTime: 0.3,           // Time spent actively working
    contentCreation: 0.25,    // Notes created/updated
    knowledgeSharing: 0.2,    // Collaboration activities
    organization: 0.15,       // Tagging, categorizing
    learning: 0.1             // Search, discovery actions
  },
  engagementScore: {
    consistency: 0.4,         // Regular activity pattern
    depth: 0.3,               // Quality of interactions
    collaboration: 0.2,       // Team participation
    growth: 0.1               // Skill development
  }
};
```

### Personalized Insights

The system provides:
- **Productivity Patterns**: Peak performance times and habits
- **Learning Insights**: Knowledge acquisition and retention
- **Collaboration Metrics**: Team interaction and contribution
- **Goal Progress**: Achievement tracking and recommendations

## 🧪 Testing Examples

### Manual Testing with cURL

**Get activities:**
```bash
curl -X GET "http://localhost:3001/api/activities?limit=10&action=NOTE_CREATED" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get insights:**
```bash
curl -X GET "http://localhost:3001/api/activities/insights?period=week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Set goals:**
```bash
curl -X POST http://localhost:3001/api/activities/goals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goals": [
      {
        "type": "DAILY_FOCUS_TIME",
        "target": 120,
        "unit": "minutes",
        "period": "daily"
      }
    ]
  }'
```

**Export activities:**
```bash
curl -X GET "http://localhost:3001/api/activities/export?format=csv&period=month" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Advanced Features

### Productivity Analytics

```typescript
// Productivity scoring algorithm
const calculateProductivityScore = (activities: Activity[]) => {
  const factors = {
    contentCreation: countContentActivities(activities) * 10,
    focusTime: calculateFocusTime(activities) * 0.1,
    collaboration: countCollaborationActivities(activities) * 5,
    organization: countOrganizationActivities(activities) * 3,
    consistency: calculateConsistencyScore(activities) * 15
  };
  
  return Math.min(100, Object.values(factors).reduce((a, b) => a + b, 0));
};
```

### Goal Tracking System

- **Smart Goals**: Automatically adjusted based on performance
- **Achievement Badges**: Gamification elements for motivation
- **Progress Visualization**: Charts and graphs for goal tracking
- **Social Sharing**: Share achievements with team members

### Team Analytics

- **Collaboration Heat Maps**: Visual representation of team interactions
- **Knowledge Flow**: Track how information spreads through teams
- **Contribution Analysis**: Individual and team contribution metrics
- **Performance Benchmarks**: Compare against team and industry standards

## 📈 Insights and Recommendations

### AI-Powered Insights

The system analyzes patterns to provide:
- **Optimal Work Hours**: When you're most productive
- **Content Suggestions**: What to work on next
- **Collaboration Opportunities**: Who to work with
- **Learning Recommendations**: Skills to develop

### Behavioral Analysis

- **Work Patterns**: Consistent behaviors and habits
- **Focus Trends**: Attention span and concentration analysis
- **Social Interactions**: Collaboration frequency and quality
- **Learning Progress**: Skill development tracking

## ❌ Common Issues and Solutions

### Issue: "Missing activity data"
**Cause:** Client-side tracking disabled or API errors
**Solution:** Implement retry logic and offline activity queuing

### Issue: "Inaccurate productivity scores"
**Cause:** Incomplete activity logging or incorrect weightings
**Solution:** Review tracking implementation and adjust scoring factors

### Issue: "Poor insights quality"
**Cause:** Insufficient data or short tracking period
**Solution:** Encourage longer usage periods and complete profile setup

### Issue: "Privacy concerns with tracking"
**Cause:** Users uncomfortable with detailed monitoring
**Solution:** Provide granular privacy controls and data transparency

## 🔒 Privacy and Data Protection

### Data Collection
- **Transparent Logging**: Clear indication of what's being tracked
- **User Control**: Ability to disable specific tracking categories
- **Data Retention**: Configurable retention periods
- **Export Rights**: Full data export capabilities

### Privacy Features
- **Anonymous Analytics**: Option for anonymous data collection
- **Selective Sharing**: Control what data is shared with teams
- **Data Deletion**: Complete activity history deletion
- **Audit Trails**: Track who accessed your activity data

---

**Next:** [Tags Management API](./05-tags.md)

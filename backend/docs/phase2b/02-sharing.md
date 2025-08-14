# Sharing API

Advanced sharing system with public links, access control, view analytics, and comprehensive permissions management.

## 📋 Overview

The sharing system enables users to share notes publicly or privately with comprehensive access control, view tracking, and detailed analytics. It supports password protection, expiration dates, and referrer analysis.

### Features
- ✅ Public and private share link generation
- ✅ Password protection and expiration dates
- ✅ View count tracking and analytics
- ✅ Geographic and referrer analysis
- ✅ Access control with authentication requirements
- ✅ Share link management and revocation
- ✅ Background analytics processing
- ✅ Social sharing optimization

## 🔐 Endpoints

### POST /share/notes/:noteId/create

Create a new share link for a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Note ID to create share link for

**Request Body:**
```json
{
  "isPublic": true,
  "expiresAt": "2024-12-31T23:59:59.999Z",
  "allowComments": false,
  "requireAuth": false,
  "maxViews": 100,
  "password": "sharePassword123",
  "settings": {
    "allowDownload": true,
    "showAuthor": true,
    "allowSearch": false
  }
}
```

**Request Fields:**
- `isPublic`: Boolean - Whether link is publicly accessible
- `expiresAt`: ISO string (optional) - Link expiration date
- `allowComments`: Boolean (default: false) - Allow viewers to comment
- `requireAuth`: Boolean (default: false) - Require authentication to view
- `maxViews`: Number (optional) - Maximum number of views allowed
- `password`: String (optional) - Password protection for the link
- `settings`: Object (optional) - Additional sharing settings

**Success Response (201):**
```json
{
  "success": true,
  "shareLink": {
    "id": "cm4share123",
    "noteId": "cm4note123",
    "token": "abc123def456ghi789",
    "isPublic": true,
    "expiresAt": "2024-12-31T23:59:59.999Z",
    "allowComments": false,
    "requireAuth": false,
    "maxViews": 100,
    "passwordHash": "hashed_password",
    "settings": {
      "allowDownload": true,
      "showAuthor": true,
      "allowSearch": false
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "shareUrl": "https://ai-notes.com/share/abc123def456ghi789",
  "message": "Share link created successfully"
}
```

**Error Responses:**
```json
// 404 - Note not found
{
  "success": false,
  "message": "Note not found or access denied",
  "statusCode": 404
}

// 409 - Share link already exists
{
  "success": false,
  "message": "Share link already exists for this note",
  "statusCode": 409
}
```

---

### GET /share/notes/:noteId/links

Get all share links for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "shareLinks": [
    {
      "id": "cm4share123",
      "noteId": "cm4note123",
      "token": "abc123def456ghi789",
      "isPublic": true,
      "expiresAt": "2024-12-31T23:59:59.999Z",
      "allowComments": false,
      "requireAuth": false,
      "maxViews": 100,
      "passwordHash": "hashed_password",
      "settings": {
        "allowDownload": true,
        "showAuthor": true
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "shareViews": [
        {
          "id": "cm4view123",
          "viewerIp": "192.168.1.1",
          "viewerAgent": "Mozilla/5.0...",
          "referrer": "https://google.com",
          "isUnique": true,
          "metadata": {
            "country": "US",
            "device": "desktop"
          },
          "viewedAt": "2024-01-15T11:00:00.000Z"
        }
      ],
      "_count": {
        "shareViews": 25
      }
    }
  ],
  "totalLinks": 1
}
```

---

### GET /share/:token

Access a shared note via token (public endpoint).

**Parameters:**
- `token` (string) - Share link token

**Query Parameters:**
- `password` (string, optional) - Password for protected links

**Success Response (200):**
```json
{
  "success": true,
  "note": {
    "id": "cm4note123",
    "title": "React Development Guide",
    "content": "# React Development Guide\n\nThis is a comprehensive guide...",
    "tags": ["react", "javascript", "development"],
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "shareInfo": {
    "id": "cm4share123",
    "allowComments": false,
    "settings": {
      "allowDownload": true,
      "showAuthor": true
    },
    "viewCount": 26,
    "isExpired": false,
    "isMaxViewsReached": false
  },
  "author": {
    "name": "John Doe",
    "image": "https://avatar.com/john.jpg"
  }
}
```

**Error Responses:**
```json
// 404 - Invalid or expired token
{
  "success": false,
  "message": "Share link not found or expired",
  "statusCode": 404
}

// 401 - Password required
{
  "success": false,
  "message": "Password required to access this shared note",
  "statusCode": 401,
  "passwordRequired": true
}

// 401 - Authentication required
{
  "success": false,
  "message": "Authentication required to access this shared note",
  "statusCode": 401,
  "authRequired": true
}

// 429 - Max views reached
{
  "success": false,
  "message": "Share link has reached maximum view limit",
  "statusCode": 429
}
```

---

### PATCH /share/:shareId

Update an existing share link.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `shareId` (string) - Share link ID

**Request Body:**
```json
{
  "isPublic": false,
  "expiresAt": "2024-06-30T23:59:59.999Z",
  "allowComments": true,
  "maxViews": 50,
  "settings": {
    "allowDownload": false,
    "showAuthor": false
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "shareLink": {
    "id": "cm4share123",
    "noteId": "cm4note123",
    "token": "abc123def456ghi789",
    "isPublic": false,
    "expiresAt": "2024-06-30T23:59:59.999Z",
    "allowComments": true,
    "requireAuth": false,
    "maxViews": 50,
    "settings": {
      "allowDownload": false,
      "showAuthor": false
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Share link updated successfully"
}
```

---

### DELETE /share/:shareId

Delete/revoke a share link.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `shareId` (string) - Share link ID

**Success Response (204):**
No content returned.

**Error Response (404):**
```json
{
  "success": false,
  "message": "Share link not found",
  "statusCode": 404
}
```

---

### GET /share/:shareId/analytics

Get detailed analytics for a share link.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `shareId` (string) - Share link ID

**Query Parameters:**
- `period` (string, optional) - Time period: `day`, `week`, `month`, `all` (default: `week`)
- `groupBy` (string, optional) - Group results by: `day`, `hour`, `country`, `referrer`

**Success Response (200):**
```json
{
  "success": true,
  "shareId": "cm4share123",
  "period": "week",
  "analytics": {
    "totalViews": 156,
    "uniqueViews": 89,
    "viewsToday": 12,
    "averageViewsPerDay": 22.3,
    "topCountries": [
      {
        "country": "US",
        "countryName": "United States",
        "views": 67,
        "percentage": 42.9
      },
      {
        "country": "GB",
        "countryName": "United Kingdom", 
        "views": 23,
        "percentage": 14.7
      }
    ],
    "topReferrers": [
      {
        "referrer": "https://google.com",
        "views": 45,
        "percentage": 28.8
      },
      {
        "referrer": "https://twitter.com",
        "views": 32,
        "percentage": 20.5
      },
      {
        "referrer": "direct",
        "views": 30,
        "percentage": 19.2
      }
    ],
    "deviceTypes": {
      "desktop": 89,
      "mobile": 54,
      "tablet": 13
    },
    "viewsByDay": [
      {
        "date": "2024-01-15",
        "views": 34,
        "uniqueViews": 28
      },
      {
        "date": "2024-01-16",
        "views": 28,
        "uniqueViews": 22
      }
    ],
    "peakHours": [
      {
        "hour": 14,
        "views": 18
      },
      {
        "hour": 10,
        "views": 16
      }
    ]
  },
  "shareLink": {
    "token": "abc123def456ghi789",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-12-31T23:59:59.999Z",
    "maxViews": 100,
    "isPublic": true
  }
}
```

---

### GET /share/user/analytics

Get overall sharing analytics for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (string, optional) - Time period: `day`, `week`, `month`, `all` (default: `month`)

**Success Response (200):**
```json
{
  "success": true,
  "period": "month",
  "userAnalytics": {
    "totalShares": 45,
    "activeShares": 32,
    "expiredShares": 13,
    "totalViews": 2456,
    "uniqueViews": 1823,
    "averageViewsPerShare": 54.6,
    "mostViewedShares": [
      {
        "shareId": "cm4share123",
        "noteTitle": "React Development Guide",
        "views": 234,
        "uniqueViews": 189,
        "createdAt": "2024-01-10T09:00:00.000Z"
      }
    ],
    "viewsByDay": [
      {
        "date": "2024-01-15",
        "views": 89,
        "shares": 3
      }
    ],
    "topPerformingNotes": [
      {
        "noteId": "cm4note123",
        "noteTitle": "React Development Guide",
        "totalViews": 234,
        "shareCount": 1
      }
    ]
  }
}
```

---

### POST /share/:shareId/track-view

Track a view on a shared note (internal/public endpoint).

**Parameters:**
- `shareId` (string) - Share link ID

**Request Body:**
```json
{
  "viewerIp": "192.168.1.1",
  "viewerAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "referrer": "https://twitter.com/post/123",
  "viewerId": "cm4user456"
}
```

**Request Fields:**
- `viewerIp`: IP address of viewer (auto-detected if not provided)
- `viewerAgent`: User agent string (auto-detected if not provided)
- `referrer`: Referring URL (optional)
- `viewerId`: Authenticated user ID (optional)

**Success Response (201):**
```json
{
  "success": true,
  "view": {
    "id": "cm4view789",
    "shareLinkId": "cm4share123",
    "viewerIp": "192.168.1.1",
    "viewerAgent": "Mozilla/5.0...",
    "referrer": "https://twitter.com/post/123",
    "viewerId": "cm4user456",
    "isUnique": true,
    "metadata": {
      "country": "US",
      "city": "New York",
      "device": "desktop",
      "browser": "Chrome"
    },
    "viewedAt": "2024-01-15T12:30:00.000Z"
  },
  "totalViews": 157
}
```

---

### GET /share/:shareId/views

Get view history for a share link.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `shareId` (string) - Share link ID

**Query Parameters:**
- `limit` (number, optional, default: 50) - Maximum number of views to return
- `offset` (number, optional) - Pagination offset
- `unique` (boolean, optional) - Only return unique views

**Success Response (200):**
```json
{
  "success": true,
  "shareId": "cm4share123",
  "views": [
    {
      "id": "cm4view789",
      "viewerIp": "192.168.1.1",
      "viewerAgent": "Mozilla/5.0...",
      "referrer": "https://twitter.com",
      "viewerId": "cm4user456",
      "isUnique": true,
      "metadata": {
        "country": "US",
        "city": "New York",
        "device": "desktop",
        "browser": "Chrome"
      },
      "viewedAt": "2024-01-15T12:30:00.000Z"
    }
  ],
  "total": 156,
  "uniqueTotal": 89,
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### POST /share/:shareId/regenerate-token

Regenerate the share token (invalidates old links).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `shareId` (string) - Share link ID

**Success Response (200):**
```json
{
  "success": true,
  "shareLink": {
    "id": "cm4share123",
    "noteId": "cm4note123",
    "token": "new_xyz789abc456def123",
    "isPublic": true,
    "expiresAt": "2024-12-31T23:59:59.999Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  },
  "newShareUrl": "https://ai-notes.com/share/new_xyz789abc456def123",
  "message": "Share token regenerated successfully"
}
```

---

### POST /share/:shareId/set-password

Set or update password for a share link.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `shareId` (string) - Share link ID

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "hasPassword": true
}
```

---

### DELETE /share/:shareId/password

Remove password protection from a share link.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `shareId` (string) - Share link ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password protection removed",
  "hasPassword": false
}
```

## 🔧 Share Link Features

### Access Control Options

1. **Public Sharing**
   - No authentication required
   - Accessible via direct link
   - Optional password protection
   - View count tracking

2. **Private Sharing**
   - Requires authentication
   - Only specific users can access
   - Enhanced security logging
   - Permission-based access

3. **Expiration Control**
   - Time-based expiration
   - View count limits
   - Manual revocation
   - Automatic cleanup

### Analytics Capabilities

1. **View Tracking**
   - Unique vs total views
   - Geographic distribution
   - Device and browser analysis
   - Referrer tracking

2. **Performance Metrics**
   - Peak viewing times
   - Popular content identification
   - Engagement patterns
   - Conversion tracking

3. **Security Monitoring**
   - Suspicious access patterns
   - IP-based analysis
   - Failed access attempts
   - Automated threat detection

## 🧪 Testing Examples

### Manual Testing with cURL

**Create share link:**
```bash
curl -X POST http://localhost:3001/api/share/notes/NOTE_ID/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isPublic": true,
    "expiresAt": "2024-12-31T23:59:59.999Z",
    "allowComments": false,
    "password": "secret123"
  }'
```

**Access shared note:**
```bash
curl -X GET "http://localhost:3001/api/share/SHARE_TOKEN?password=secret123"
```

**Get share analytics:**
```bash
curl -X GET "http://localhost:3001/api/share/SHARE_ID/analytics?period=week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update share settings:**
```bash
curl -X PATCH http://localhost:3001/api/share/SHARE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxViews": 100,
    "allowComments": true
  }'
```

## 🚀 Background Processing

### Analytics Jobs
```typescript
{
  "process-share-analytics": {
    "shareId": "cm4share123",
    "period": "daily",
    "tasks": ["geo-analysis", "referrer-analysis", "device-analysis"]
  },
  "cleanup-expired-shares": {
    "olderThanDays": 30,
    "includeZeroViews": true
  },
  "generate-share-reports": {
    "userId": "cm4user123",
    "reportType": "monthly",
    "includeCharts": true
  }
}
```

## 🎯 Advanced Features

### Smart Link Generation
- SEO-optimized URLs
- Custom domain support
- QR code generation
- Social media previews

### Security Features
- Rate limiting per IP
- Suspicious activity detection
- Automatic link suspension
- Audit trail logging

### Integration Options
- Social media sharing
- Email sharing templates
- Embed code generation
- API access for third parties

---

**Next:** [User Management API](./03-users.md)

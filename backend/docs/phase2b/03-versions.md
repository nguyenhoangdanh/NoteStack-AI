# Version Control API

Comprehensive version control system for notes with automatic versioning, manual snapshots, and change tracking.

## 📋 Overview

The version control system automatically tracks changes to notes, creates version snapshots, and provides detailed change history. It enables users to view, compare, and restore previous versions of their notes.

### Features
- ✅ Automatic version creation on significant changes
- ✅ Manual version snapshots with custom change logs
- ✅ Version comparison with diff highlighting
- ✅ Version restoration and rollback capabilities
- ✅ Change tracking with user attribution
- ✅ Version analytics and statistics
- ✅ Configurable auto-versioning rules
- ✅ Branch-like version management

## 🔐 Endpoints

### GET /versions/notes/:noteId

Get all versions for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID to get versions for

**Query Parameters:**
- `limit` (number, optional, default: 20) - Maximum number of versions
- `offset` (number, optional) - Pagination offset

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "versions": [
    {
      "id": "cm4ver123",
      "noteId": "cm4note123",
      "version": 3,
      "title": "React Hooks Guide - Updated",
      "content": "# React Hooks Guide\n\nThis comprehensive guide covers React hooks including useState, useEffect, and custom hooks...",
      "changeLog": "Added section on custom hooks and performance optimization",
      "createdBy": "cm4user123",
      "createdAt": "2024-01-15T14:30:00.000Z",
      "user": {
        "id": "cm4user123",
        "name": "John Doe",
        "email": "john@example.com",
        "image": "https://avatar.com/john.jpg"
      },
      "wordCount": 1250,
      "charactersChanged": 245,
      "isAutomatic": false,
      "isCurrent": true
    },
    {
      "id": "cm4ver124",
      "noteId": "cm4note123",
      "version": 2,
      "title": "React Hooks Guide",
      "content": "# React Hooks Guide\n\nThis guide covers React hooks including useState and useEffect...",
      "changeLog": "Automatic version: Significant content changes detected",
      "createdBy": "cm4user123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": "cm4user123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "wordCount": 890,
      "charactersChanged": 180,
      "isAutomatic": true,
      "isCurrent": false
    }
  ],
  "totalVersions": 3,
  "currentVersion": 3
}
```

**Response Fields:**
- `version`: Sequential version number (starts from 1)
- `changeLog`: Description of changes made in this version
- `isAutomatic`: Whether version was created automatically
- `isCurrent`: Whether this is the current active version
- `wordCount`: Word count of the content in this version
- `charactersChanged`: Number of characters changed from previous version

---

### POST /versions/notes/:noteId/create

Create a manual version snapshot of a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Note ID to create version for

**Request Body:**
```json
{
  "changeLog": "Added comprehensive examples and refactored structure for better readability"
}
```

**Request Fields:**
- `changeLog`: Description of changes (required, max 500 characters)

**Success Response (201):**
```json
{
  "success": true,
  "version": {
    "id": "cm4ver125",
    "noteId": "cm4note123",
    "version": 4,
    "title": "React Hooks Guide - Updated",
    "content": "# React Hooks Guide\n\nThis comprehensive guide...",
    "changeLog": "Added comprehensive examples and refactored structure for better readability",
    "createdBy": "cm4user123",
    "createdAt": "2024-01-15T15:45:00.000Z",
    "wordCount": 1350,
    "charactersChanged": 125,
    "isAutomatic": false
  },
  "message": "Version created successfully"
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

// 400 - No changes detected
{
  "success": false,
  "message": "No changes detected since last version",
  "statusCode": 400
}
```

---

### GET /versions/:versionId

Get a specific version by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `versionId` (string) - Version ID

**Success Response (200):**
```json
{
  "success": true,
  "version": {
    "id": "cm4ver123",
    "noteId": "cm4note123",
    "version": 3,
    "title": "React Hooks Guide - Updated",
    "content": "# React Hooks Guide\n\nThis comprehensive guide covers...",
    "changeLog": "Added section on custom hooks and performance optimization",
    "createdBy": "cm4user123",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "user": {
      "id": "cm4user123",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://avatar.com/john.jpg"
    },
    "note": {
      "id": "cm4note123",
      "title": "React Hooks Guide - Current",
      "workspaceId": "cm4workspace123"
    },
    "isAutomatic": false,
    "isCurrent": false
  }
}
```

---

### GET /versions/notes/:noteId/compare

Compare two versions of a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Query Parameters:**
- `from` (number, required) - Source version number
- `to` (number, required) - Target version number

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "comparison": {
    "fromVersion": {
      "version": 2,
      "title": "React Hooks Guide",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "wordCount": 890
    },
    "toVersion": {
      "version": 3,
      "title": "React Hooks Guide - Updated",
      "createdAt": "2024-01-15T14:30:00.000Z",
      "wordCount": 1250
    },
    "changes": {
      "title": {
        "type": "modified",
        "from": "React Hooks Guide",
        "to": "React Hooks Guide - Updated"
      },
      "content": {
        "type": "modified",
        "additions": 245,
        "deletions": 12,
        "modifications": 18
      },
      "wordCountChange": 360,
      "charactersChanged": 245
    },
    "diff": {
      "title": [
        {
          "type": "unchanged",
          "text": "React Hooks Guide"
        },
        {
          "type": "added",
          "text": " - Updated"
        }
      ],
      "content": [
        {
          "type": "unchanged",
          "text": "# React Hooks Guide\n\nThis guide covers React hooks including useState"
        },
        {
          "type": "added",
          "text": ", useEffect, and custom hooks"
        },
        {
          "type": "unchanged",
          "text": "...\n\n"
        },
        {
          "type": "added",
          "text": "## Custom Hooks\n\nCustom hooks allow you to extract component logic into reusable functions..."
        }
      ]
    }
  }
}
```

**Response Fields:**
- `changes`: Summary of changes between versions
- `diff`: Detailed line-by-line differences
- `diff.type`: Change type (`unchanged`, `added`, `removed`, `modified`)

---

### POST /versions/:versionId/restore

Restore a note to a specific version.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `versionId` (string) - Version ID to restore to

**Request Body:**
```json
{
  "createBackup": true,
  "changeLog": "Restored to version 2 due to incorrect changes in latest version"
}
```

**Request Fields:**
- `createBackup`: Create backup of current version before restore (default: true)
- `changeLog`: Optional description of why restoration was performed

**Success Response (200):**
```json
{
  "success": true,
  "restoredNote": {
    "id": "cm4note123",
    "title": "React Hooks Guide",
    "content": "# React Hooks Guide\n\nThis guide covers...",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  },
  "restoredFromVersion": {
    "id": "cm4ver124",
    "version": 2,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "backupVersion": {
    "id": "cm4ver126",
    "version": 5,
    "changeLog": "Automatic backup before restore to version 2"
  },
  "message": "Note restored to version 2 successfully"
}
```

**Error Responses:**
```json
// 404 - Version not found
{
  "success": false,
  "message": "Version not found or access denied",
  "statusCode": 404
}

// 409 - Cannot restore current version
{
  "success": false,
  "message": "Cannot restore to current version",
  "statusCode": 409
}
```

---

### DELETE /versions/:versionId

Delete a specific version (except current version).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `versionId` (string) - Version ID to delete

**Success Response (204):**
No content returned.

**Error Responses:**
```json
// 403 - Cannot delete current version
{
  "success": false,
  "message": "Cannot delete current version",
  "statusCode": 403
}

// 403 - Cannot delete if only version
{
  "success": false,
  "message": "Cannot delete the only version of a note",
  "statusCode": 403
}
```

---

### GET /versions/notes/:noteId/stats

Get version statistics for a note.

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
  "stats": {
    "totalVersions": 5,
    "automaticVersions": 3,
    "manualVersions": 2,
    "totalWordCount": 1350,
    "totalCharacterChanges": 1250,
    "averageTimeBetweenVersions": "2.5 hours",
    "versionHistory": [
      {
        "version": 5,
        "createdAt": "2024-01-15T16:00:00.000Z",
        "wordCount": 1350,
        "changeType": "restore",
        "isAutomatic": false
      },
      {
        "version": 4,
        "createdAt": "2024-01-15T15:45:00.000Z",
        "wordCount": 1350,
        "changeType": "manual",
        "isAutomatic": false
      },
      {
        "version": 3,
        "createdAt": "2024-01-15T14:30:00.000Z",
        "wordCount": 1250,
        "changeType": "manual",
        "isAutomatic": false
      }
    ],
    "contributors": [
      {
        "userId": "cm4user123",
        "name": "John Doe",
        "versionCount": 5,
        "lastContribution": "2024-01-15T16:00:00.000Z"
      }
    ],
    "changeFrequency": {
      "daily": 2.5,
      "weekly": 17.5,
      "monthly": 70
    }
  }
}
```

---

### POST /versions/notes/:noteId/auto-version/configure

Configure automatic versioning rules for a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Note ID

**Request Body:**
```json
{
  "enabled": true,
  "rules": {
    "minWordChangePercent": 10,
    "minCharacterChanges": 100,
    "timeThreshold": 3600,
    "significantChangesOnly": true,
    "maxVersionsToKeep": 50
  }
}
```

**Request Fields:**
- `enabled`: Enable/disable automatic versioning
- `minWordChangePercent`: Minimum percentage of words changed (0-100)
- `minCharacterChanges`: Minimum number of characters changed
- `timeThreshold`: Minimum seconds between auto-versions
- `significantChangesOnly`: Only version for significant structural changes
- `maxVersionsToKeep`: Maximum versions to retain (older ones auto-deleted)

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "autoVersionConfig": {
    "enabled": true,
    "rules": {
      "minWordChangePercent": 10,
      "minCharacterChanges": 100,
      "timeThreshold": 3600,
      "significantChangesOnly": true,
      "maxVersionsToKeep": 50
    },
    "updatedAt": "2024-01-15T16:30:00.000Z"
  },
  "message": "Auto-versioning configuration updated successfully"
}
```

---

### GET /versions/user/activity

Get version activity summary for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `days` (number, optional, default: 30) - Number of days to analyze
- `limit` (number, optional, default: 20) - Maximum activities to return

**Success Response (200):**
```json
{
  "success": true,
  "period": {
    "days": 30,
    "from": "2023-12-16T00:00:00.000Z",
    "to": "2024-01-15T23:59:59.999Z"
  },
  "summary": {
    "totalVersionsCreated": 45,
    "manualVersions": 18,
    "automaticVersions": 27,
    "notesWithVersions": 12,
    "averageVersionsPerNote": 3.75,
    "totalWordsVersioned": 15680,
    "mostActiveDay": "2024-01-15",
    "versionsOnMostActiveDay": 8
  },
  "recentActivity": [
    {
      "id": "cm4ver125",
      "noteId": "cm4note123",
      "noteTitle": "React Hooks Guide",
      "version": 4,
      "changeLog": "Added comprehensive examples",
      "createdAt": "2024-01-15T15:45:00.000Z",
      "isAutomatic": false,
      "wordCount": 1350
    }
  ],
  "versionsByDay": {
    "2024-01-15": 8,
    "2024-01-14": 3,
    "2024-01-13": 5
  },
  "topVersionedNotes": [
    {
      "noteId": "cm4note123",
      "noteTitle": "React Hooks Guide",
      "versionCount": 5,
      "lastVersioned": "2024-01-15T16:00:00.000Z"
    }
  ]
}
```

## 🔧 Version Control Features

### Automatic Versioning

The system automatically creates versions when:
1. **Significant Content Changes**: >10% word count change or >100 characters
2. **Time Threshold**: At least 1 hour since last version
3. **Structural Changes**: Major reorganization detected
4. **Collaboration**: Multiple users editing the same note

### Version Lifecycle

```typescript
// Version creation triggers
const autoVersionTriggers = {
  contentChange: {
    minWordPercent: 10,      // 10% of words changed
    minCharacters: 100,      // 100 characters changed
    timeThreshold: 3600      // 1 hour since last version
  },
  collaboration: {
    userChange: true,        // Different user editing
    conflictResolution: true // Merge conflicts resolved
  },
  restoration: true,         // Version restored
  significantEdit: {
    structuralChange: true,  // Headers, lists reorganized
    majorAdditions: true     // Large content blocks added
  }
};
```

### Change Detection Algorithm

```typescript
const changeAnalysis = {
  wordLevelChanges: {
    additions: countNewWords(oldContent, newContent),
    deletions: countRemovedWords(oldContent, newContent),
    modifications: countChangedWords(oldContent, newContent)
  },
  structuralChanges: {
    headingChanges: detectHeadingModifications(oldContent, newContent),
    listChanges: detectListReorganization(oldContent, newContent),
    codeBlockChanges: detectCodeChanges(oldContent, newContent)
  },
  semanticChanges: {
    meaningShift: calculateSemanticDifference(oldContent, newContent),
    topicEvolution: analyzeTopicChanges(oldContent, newContent)
  }
};
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Get note versions:**
```bash
curl -X GET "http://localhost:3001/api/versions/notes/cm4note123?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create manual version:**
```bash
curl -X POST http://localhost:3001/api/versions/notes/cm4note123/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "changeLog": "Added comprehensive examples and better structure"
  }'
```

**Compare versions:**
```bash
curl -X GET "http://localhost:3001/api/versions/notes/cm4note123/compare?from=2&to=3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Restore version:**
```bash
curl -X POST http://localhost:3001/api/versions/cm4ver124/restore \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "createBackup": true,
    "changeLog": "Restored to working version before recent changes"
  }'
```

## 🎯 Advanced Features

### Smart Version Management

```typescript
// Intelligent version consolidation
const versionOptimization = {
  mergeSimilarVersions: {
    similarityThreshold: 0.95,    // Merge very similar versions
    timeWindow: 1800              // Within 30 minutes
  },
  archiveOldVersions: {
    keepRecentVersions: 10,       // Always keep recent 10
    archiveAfterDays: 90,         // Archive after 90 days
    deleteAfterDays: 365          // Delete after 1 year
  },
  prioritizeVersions: {
    manualVersions: 'high',       // Manual versions are important
    milestoneVersions: 'high',    // Tagged milestone versions
    automaticVersions: 'medium'   // Auto versions can be merged/deleted
  }
};
```

### Conflict Resolution

When restoring or merging versions:
- **Content Conflicts**: Show side-by-side comparison
- **Metadata Conflicts**: Preserve most recent metadata
- **Tag Conflicts**: Merge all unique tags
- **Version History**: Maintain complete audit trail

### Performance Optimizations

- **Differential Storage**: Store only changes between versions
- **Compression**: Compress older version content
- **Lazy Loading**: Load version content on-demand
- **Caching**: Cache frequently accessed versions

## ❌ Common Issues and Solutions

### Issue: "Too many versions created"
**Cause:** Auto-versioning rules too sensitive
**Solution:** Increase thresholds for automatic version creation

### Issue: "Version restore failed"
**Cause:** Concurrent edits or version conflicts
**Solution:** Refresh note and try restore again, or use manual merge

### Issue: "Cannot compare distant versions"
**Cause:** Very different content structure
**Solution:** Use intermediate versions for step-by-step comparison

### Issue: "Version history too large"
**Cause:** Many versions with large content
**Solution:** Configure version archival and cleanup policies

## 📈 Analytics and Insights

### Version Metrics
- **Version Velocity**: Versions created per day/week
- **Change Patterns**: Common types of changes made
- **Collaboration**: Multi-user version creation patterns
- **Content Growth**: How notes evolve over time

### Quality Indicators
- **Revision Ratio**: Manual vs automatic versions
- **Rollback Frequency**: How often users restore versions
- **Version Lifespan**: How long versions remain current
- **Change Significance**: Impact of each version

---

**Next:** [Activities API](./04-activities.md)

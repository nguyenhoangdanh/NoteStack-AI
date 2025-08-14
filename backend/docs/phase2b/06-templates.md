# Templates API

Note template system with variable processing, marketplace functionality, and usage analytics.

## 📋 Overview

The templates system provides pre-structured note templates with variable processing, sharing capabilities, and usage analytics. It enables users to create consistent note formats and share templates with others.

### Features
- ✅ Template creation with variable placeholders
- ✅ Variable processing and substitution
- ✅ Public template marketplace
- ✅ Template categories and tagging
- ✅ Usage analytics and popular templates
- ✅ Template versioning and updates
- ✅ Background template processing
- ✅ Import/export capabilities

## 🔐 Endpoints

### GET /templates

Get all templates for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `includePublic` (boolean, optional, default: true) - Include public templates
- `category` (string, optional) - Filter by category
- `sortBy` (string, optional, default: 'name') - Sort by: `name`, `usage`, `created`, `updated`
- `limit` (number, optional, default: 50) - Maximum templates to return

**Success Response (200):**
```json
{
  "success": true,
  "templates": [
    {
      "id": "cm4temp123",
      "name": "Meeting Notes Template",
      "description": "Structured template for meeting notes with agenda, attendees, and action items",
      "content": "# Meeting Notes - {{meetingTitle}}\n\n**Date:** {{date}}\n**Attendees:** {{attendees}}\n\n## Agenda\n{{agenda}}\n\n## Discussion\n{{discussion}}\n\n## Action Items\n{{actionItems}}\n\n## Next Steps\n{{nextSteps}}",
      "tags": ["meeting", "work", "productivity"],
      "isPublic": false,
      "ownerId": "cm4user123",
      "metadata": {
        "variables": [
          {
            "name": "meetingTitle",
            "type": "text",
            "required": true,
            "placeholder": "Enter meeting title"
          },
          {
            "name": "date",
            "type": "date",
            "required": true,
            "defaultValue": "{{today}}"
          },
          {
            "name": "attendees",
            "type": "list",
            "required": false,
            "placeholder": "List of attendees"
          },
          {
            "name": "agenda",
            "type": "text",
            "required": false,
            "placeholder": "Meeting agenda items"
          }
        ],
        "category": "Business",
        "estimatedTime": "5 minutes"
      },
      "createdAt": "2024-01-10T09:00:00.000Z",
      "updatedAt": "2024-01-12T15:30:00.000Z",
      "usageCount": 24,
      "owner": {
        "id": "cm4user123",
        "name": "John Doe",
        "image": "https://avatar.com/john.jpg"
      }
    },
    {
      "id": "cm4temp456",
      "name": "Daily Journal Template",
      "description": "Simple daily reflection and planning template",
      "content": "# Daily Journal - {{date}}\n\n## Morning Reflection\n**Mood:** {{mood}}\n**Energy Level:** {{energy}}\n\n## Today's Goals\n{{goals}}\n\n## Evening Review\n**Accomplishments:**\n{{accomplishments}}\n\n**Challenges:**\n{{challenges}}\n\n**Tomorrow's Priority:**\n{{tomorrowPriority}}",
      "tags": ["journal", "daily", "reflection", "personal"],
      "isPublic": true,
      "ownerId": "cm4user456",
      "metadata": {
        "variables": [
          {
            "name": "date",
            "type": "date",
            "required": true,
            "defaultValue": "{{today}}"
          },
          {
            "name": "mood",
            "type": "select",
            "options": ["Great", "Good", "Okay", "Tired", "Stressed"],
            "required": false
          },
          {
            "name": "energy",
            "type": "range",
            "min": 1,
            "max": 10,
            "required": false
          }
        ],
        "category": "Personal",
        "estimatedTime": "10 minutes"
      },
      "createdAt": "2024-01-08T14:20:00.000Z",
      "updatedAt": "2024-01-08T14:20:00.000Z",
      "usageCount": 156,
      "isPopular": true
    }
  ],
  "total": 2,
  "categories": [
    "Business",
    "Personal",
    "Education",
    "Research",
    "Creative"
  ]
}
```

**Response Fields:**
- `variables`: Template variable definitions with types and validation
- `usageCount`: Number of times template has been used
- `isPopular`: Boolean indicating if template is in top 10% usage
- `metadata`: Additional template configuration and settings

---

### POST /templates

Create a new template.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Project Planning Template",
  "description": "Comprehensive template for project planning and tracking",
  "content": "# {{projectName}} - Project Plan\n\n## Project Overview\n**Start Date:** {{startDate}}\n**End Date:** {{endDate}}\n**Team Members:** {{teamMembers}}\n**Budget:** {{budget}}\n\n## Objectives\n{{objectives}}\n\n## Milestones\n{{milestones}}\n\n## Resources Needed\n{{resources}}\n\n## Risk Assessment\n{{risks}}\n\n## Success Metrics\n{{successMetrics}}",
  "tags": ["project", "planning", "management"],
  "isPublic": false,
  "metadata": {
    "variables": [
      {
        "name": "projectName",
        "type": "text",
        "required": true,
        "placeholder": "Enter project name"
      },
      {
        "name": "startDate",
        "type": "date",
        "required": true
      },
      {
        "name": "endDate",
        "type": "date",
        "required": true
      },
      {
        "name": "teamMembers",
        "type": "list",
        "required": false,
        "placeholder": "List team members"
      },
      {
        "name": "budget",
        "type": "number",
        "required": false,
        "prefix": "$"
      }
    ],
    "category": "Business",
    "estimatedTime": "15 minutes"
  }
}
```

**Variable Types:**
- `text`: Single line text input
- `textarea`: Multi-line text input
- `date`: Date picker
- `number`: Numeric input
- `select`: Dropdown selection
- `range`: Slider input (1-10)
- `list`: Multi-item list input
- `checkbox`: Boolean checkbox

**Success Response (201):**
```json
{
  "success": true,
  "template": {
    "id": "cm4temp789",
    "name": "Project Planning Template",
    "description": "Comprehensive template for project planning and tracking",
    "content": "# {{projectName}} - Project Plan\n\n## Project Overview...",
    "tags": ["project", "planning", "management"],
    "isPublic": false,
    "ownerId": "cm4user123",
    "metadata": {
      "variables": [...],
      "category": "Business",
      "estimatedTime": "15 minutes"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "usageCount": 0
  },
  "message": "Template created successfully"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "success": false,
  "message": "Template name is required",
  "statusCode": 400
}

// 409 - Template Name Already Exists
{
  "success": false,
  "message": "Template with this name already exists",
  "statusCode": 409
}
```

---

### GET /templates/:id

Get a specific template by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Template ID

**Success Response (200):**
```json
{
  "success": true,
  "template": {
    "id": "cm4temp123",
    "name": "Meeting Notes Template",
    "description": "Structured template for meeting notes",
    "content": "# Meeting Notes - {{meetingTitle}}...",
    "tags": ["meeting", "work", "productivity"],
    "isPublic": false,
    "ownerId": "cm4user123",
    "metadata": {
      "variables": [...],
      "category": "Business",
      "estimatedTime": "5 minutes"
    },
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-12T15:30:00.000Z",
    "usageCount": 24,
    "owner": {
      "name": "John Doe",
      "image": "https://avatar.com/john.jpg"
    }
  }
}
```

---

### PUT /templates/:id

Update an existing template.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `id` (string) - Template ID

**Request Body:**
```json
{
  "name": "Updated Meeting Notes Template",
  "description": "Enhanced structured template for meeting notes with follow-up section",
  "content": "# Meeting Notes - {{meetingTitle}}\n\n**Date:** {{date}}\n**Attendees:** {{attendees}}\n\n## Agenda\n{{agenda}}\n\n## Discussion\n{{discussion}}\n\n## Action Items\n{{actionItems}}\n\n## Follow-up\n{{followup}}\n\n## Next Steps\n{{nextSteps}}",
  "tags": ["meeting", "work", "productivity", "enhanced"],
  "metadata": {
    "variables": [
      {
        "name": "meetingTitle",
        "type": "text",
        "required": true,
        "placeholder": "Enter meeting title"
      },
      {
        "name": "followup",
        "type": "textarea",
        "required": false,
        "placeholder": "Follow-up items and decisions"
      }
    ],
    "category": "Business",
    "estimatedTime": "7 minutes"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "template": {
    "id": "cm4temp123",
    "name": "Updated Meeting Notes Template",
    "description": "Enhanced structured template for meeting notes with follow-up section",
    "content": "# Meeting Notes - {{meetingTitle}}...",
    "tags": ["meeting", "work", "productivity", "enhanced"],
    "isPublic": false,
    "ownerId": "cm4user123",
    "metadata": {...},
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "usageCount": 24
  },
  "message": "Template updated successfully"
}
```

---

### DELETE /templates/:id

Delete a template.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Template ID

**Success Response (204):**
No content returned.

**Error Response (403):**
```json
{
  "success": false,
  "message": "Cannot delete template owned by another user",
  "statusCode": 403
}
```

---

### POST /templates/:id/use

Create a note from a template with variable processing.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `id` (string) - Template ID

**Request Body:**
```json
{
  "workspaceId": "cm4workspace123",
  "variables": {
    "meetingTitle": "Sprint Planning Meeting",
    "date": "2024-01-15",
    "attendees": ["John Doe", "Jane Smith", "Bob Wilson"],
    "agenda": "Sprint review, backlog refinement, capacity planning",
    "discussion": "Discussed user stories for next sprint...",
    "actionItems": "- Update story points\n- Schedule design review\n- Prepare demo",
    "nextSteps": "Start development on high-priority items"
  },
  "title": "Sprint Planning Meeting - January 15, 2024"
}
```

**Request Fields:**
- `workspaceId`: Workspace to create the note in
- `variables`: Key-value pairs for template variable substitution
- `title`: Optional custom title (if not provided, extracted from content)

**Success Response (201):**
```json
{
  "success": true,
  "note": {
    "id": "cm4note789",
    "title": "Sprint Planning Meeting - January 15, 2024",
    "content": "# Meeting Notes - Sprint Planning Meeting\n\n**Date:** 2024-01-15\n**Attendees:** John Doe, Jane Smith, Bob Wilson\n\n## Agenda\nSprint review, backlog refinement, capacity planning\n\n## Discussion\nDiscussed user stories for next sprint...\n\n## Action Items\n- Update story points\n- Schedule design review\n- Prepare demo\n\n## Next Steps\nStart development on high-priority items",
    "tags": ["meeting", "sprint-planning", "from-template"],
    "workspaceId": "cm4workspace123",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  },
  "template": {
    "id": "cm4temp123",
    "name": "Meeting Notes Template",
    "usageCount": 25
  },
  "variablesProcessed": {
    "meetingTitle": "Sprint Planning Meeting",
    "date": "2024-01-15",
    "attendees": "John Doe, Jane Smith, Bob Wilson",
    "agenda": "Sprint review, backlog refinement, capacity planning"
  },
  "message": "Note created from template successfully"
}
```

**Error Responses:**
```json
// 400 - Missing Required Variables
{
  "success": false,
  "message": "Missing required variables: meetingTitle, date",
  "statusCode": 400,
  "missingVariables": ["meetingTitle", "date"]
}

// 404 - Template Not Found
{
  "success": false,
  "message": "Template not found or not accessible",
  "statusCode": 404
}
```

---

### GET /templates/public

Get public templates from the marketplace.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `category` (string, optional) - Filter by category
- `popular` (boolean, optional) - Only popular templates
- `search` (string, optional) - Search in name and description
- `sortBy` (string, optional, default: 'usage') - Sort by: `usage`, `name`, `created`
- `limit` (number, optional, default: 20) - Maximum templates

**Success Response (200):**
```json
{
  "success": true,
  "templates": [
    {
      "id": "cm4temp456",
      "name": "Daily Journal Template",
      "description": "Simple daily reflection and planning template",
      "tags": ["journal", "daily", "reflection", "personal"],
      "isPublic": true,
      "metadata": {
        "category": "Personal",
        "estimatedTime": "10 minutes"
      },
      "createdAt": "2024-01-08T14:20:00.000Z",
      "usageCount": 156,
      "isPopular": true,
      "owner": {
        "name": "Jane Smith",
        "image": "https://avatar.com/jane.jpg"
      }
    }
  ],
  "total": 1,
  "popularCategories": [
    {
      "name": "Personal",
      "count": 45
    },
    {
      "name": "Business",
      "count": 32
    },
    {
      "name": "Education",
      "count": 28
    }
  ]
}
```

---

### POST /templates/:id/clone

Clone a public template to personal templates.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Template ID to clone

**Success Response (201):**
```json
{
  "success": true,
  "clonedTemplate": {
    "id": "cm4temp999",
    "name": "Daily Journal Template (Copy)",
    "description": "Simple daily reflection and planning template",
    "content": "# Daily Journal - {{date}}...",
    "tags": ["journal", "daily", "reflection", "personal"],
    "isPublic": false,
    "ownerId": "cm4user123",
    "metadata": {...},
    "createdAt": "2024-01-15T14:00:00.000Z",
    "usageCount": 0
  },
  "originalTemplate": {
    "id": "cm4temp456",
    "name": "Daily Journal Template",
    "usageCount": 157
  },
  "message": "Template cloned successfully"
}
```

---

### POST /templates/:id/publish

Publish a private template to the public marketplace.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Template ID to publish

**Success Response (200):**
```json
{
  "success": true,
  "template": {
    "id": "cm4temp123",
    "name": "Meeting Notes Template",
    "isPublic": true,
    "publishedAt": "2024-01-15T15:00:00.000Z"
  },
  "message": "Template published to marketplace successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Template must have description and at least one tag to be published",
  "statusCode": 400
}
```

---

### POST /templates/:id/unpublish

Remove a template from the public marketplace.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Template ID to unpublish

**Success Response (200):**
```json
{
  "success": true,
  "template": {
    "id": "cm4temp123",
    "name": "Meeting Notes Template",
    "isPublic": false,
    "unpublishedAt": "2024-01-15T16:00:00.000Z"
  },
  "message": "Template removed from marketplace"
}
```

---

### GET /templates/analytics

Get template usage analytics for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (string, optional, default: 'month') - Analysis period

**Success Response (200):**
```json
{
  "success": true,
  "period": "month",
  "analytics": {
    "totalTemplates": 12,
    "publicTemplates": 3,
    "totalUsage": 89,
    "averageUsagePerTemplate": 7.4,
    "mostUsedTemplates": [
      {
        "id": "cm4temp123",
        "name": "Meeting Notes Template",
        "usageCount": 24,
        "recentUsage": 8
      },
      {
        "id": "cm4temp456",
        "name": "Daily Journal Template",
        "usageCount": 18,
        "recentUsage": 6
      }
    ],
    "templatesByCategory": {
      "Business": 5,
      "Personal": 4,
      "Education": 2,
      "Research": 1
    },
    "usageByDay": {
      "2024-01-15": 8,
      "2024-01-14": 6,
      "2024-01-13": 4
    },
    "topVariables": [
      {
        "name": "date",
        "frequency": 45
      },
      {
        "name": "title",
        "frequency": 32
      },
      {
        "name": "attendees",
        "frequency": 18
      }
    ]
  }
}
```

---

### GET /templates/variables/suggestions

Get suggestions for template variables based on content.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `content` (string, required) - Template content to analyze

**Success Response (200):**
```json
{
  "success": true,
  "suggestions": [
    {
      "name": "projectName",
      "type": "text",
      "required": true,
      "confidence": 0.95,
      "context": "Found in title and multiple sections"
    },
    {
      "name": "startDate",
      "type": "date",
      "required": true,
      "confidence": 0.88,
      "context": "Date field in project overview"
    },
    {
      "name": "teamMembers",
      "type": "list",
      "required": false,
      "confidence": 0.72,
      "context": "List format suggested by content structure"
    }
  ],
  "detectedPlaceholders": [
    "{{projectName}}",
    "{{startDate}}",
    "{{teamMembers}}"
  ]
}
```

## 🔧 Template Processing Features

### Variable Processing Engine

The system supports various variable types with intelligent processing:

1. **Text Variables**: Simple string substitution
2. **Date Variables**: Format conversion and date math
3. **List Variables**: Array joining with customizable separators
4. **Conditional Variables**: Show/hide sections based on values
5. **Computed Variables**: Dynamic values based on other variables

```typescript
// Variable processing examples
const variableProcessors = {
  date: (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString();
  },
  list: (value: string[]) => {
    return value.join(', ');
  },
  today: () => new Date().toISOString().split('T')[0],
  user: (context: any) => context.user.name
};
```

### Smart Default Values

- `{{today}}`: Current date
- `{{user}}`: Current user name
- `{{workspace}}`: Current workspace name
- `{{timestamp}}`: Current timestamp
- `{{uuid}}`: Generated unique ID

### Advanced Template Syntax

```markdown
# {{title}} - {{date}}

{{#if urgent}}
⚠️ **URGENT** - This requires immediate attention
{{/if}}

## Attendees
{{#each attendees}}
- {{name}} ({{role}})
{{/each}}

## Summary
{{description | truncate:200}}

{{#unless private}}
*This note is shared publicly*
{{/unless}}
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Create template:**
```bash
curl -X POST http://localhost:3001/api/templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Status Update",
    "description": "Weekly project status report template",
    "content": "# {{projectName}} - Status Update\n\n**Date:** {{date}}\n**Status:** {{status}}\n\n## Progress\n{{progress}}\n\n## Blockers\n{{blockers}}",
    "tags": ["project", "status", "weekly"],
    "metadata": {
      "variables": [
        {
          "name": "projectName",
          "type": "text",
          "required": true
        },
        {
          "name": "status",
          "type": "select",
          "options": ["On Track", "At Risk", "Blocked"],
          "required": true
        }
      ]
    }
  }'
```

**Use template:**
```bash
curl -X POST http://localhost:3001/api/templates/cm4temp123/use \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "cm4workspace123",
    "variables": {
      "projectName": "AI Notes App",
      "date": "2024-01-15",
      "status": "On Track",
      "progress": "Completed user authentication and basic note CRUD"
    }
  }'
```

**Get public templates:**
```bash
curl -X GET "http://localhost:3001/api/templates/public?category=Business&popular=true&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Advanced Features

### Template Marketplace

- **Quality Scoring**: Templates rated by usage and user feedback
- **Featured Templates**: Curated high-quality templates
- **Template Collections**: Grouped templates for specific workflows
- **Version Management**: Track template updates and changes

### Dynamic Variables

```typescript
// Advanced variable processing
const dynamicVariables = {
  '{{today}}': () => new Date().toLocaleDateString(),
  '{{thisWeek}}': () => getWeekRange(new Date()),
  '{{nextMeeting}}': (context) => getNextMeetingDate(context.user),
  '{{randomId}}': () => generateUUID(),
  '{{wordCount}}': (content) => content.split(' ').length
};
```

### Template Analytics

- **Usage Patterns**: When and how templates are used
- **Variable Popularity**: Most commonly used variables
- **Success Metrics**: Template completion rates
- **User Preferences**: Preferred template categories and styles

## ❌ Common Issues and Solutions

### Issue: "Variable substitution failed"
**Cause:** Missing required variables or incorrect variable names
**Solution:** Validate variable names match template placeholders exactly

### Issue: "Template content too large"
**Cause:** Template exceeds content size limits
**Solution:** Break large templates into smaller, focused templates

### Issue: "Poor template discovery"
**Cause:** Inadequate tags or descriptions
**Solution:** Use descriptive tags and detailed descriptions for better searchability

### Issue: "Variable validation errors"
**Cause:** Invalid variable types or configurations
**Solution:** Follow variable type specifications and required field validation

## 🔄 Background Processing

### Queue System
- **Template Analysis**: Process template variables and structure
- **Usage Analytics**: Calculate template usage statistics
- **Content Optimization**: Suggest template improvements
- **Cleanup Operations**: Remove unused or outdated templates

### Maintenance Jobs
- **Daily**: Update usage statistics
- **Weekly**: Analyze popular templates and trends
- **Monthly**: Generate template performance reports
- **Quarterly**: Review and optimize template marketplace

---

**Next:** [Attachments API](./07-attachments.md)

# Attachments API

File upload and management system with OCR text extraction, multiple storage backends, and comprehensive file processing.

## 📋 Overview

The attachments system enables users to upload, manage, and process various file types associated with notes. It supports multiple storage backends, automatic text extraction via OCR, and comprehensive file management capabilities.

### Features
- ✅ Multi-format file upload (images, documents, archives)
- ✅ Multiple storage backends (Cloudflare R2, local storage)
- ✅ OCR text extraction from images and documents
- ✅ File type validation and security scanning
- ✅ Automatic thumbnail generation for images
- ✅ Background processing for large files
- ✅ File compression and optimization
- ✅ Batch upload operations

## 🔐 Endpoints

### POST /attachments/upload

Upload one or more files to a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `files[]` (File[]) - One or more files to upload (required)
- `noteId` (string) - Note ID to attach files to (required)

**Supported File Types:**
- **Images**: jpg, jpeg, png, gif, webp (max 10MB each)
- **Documents**: pdf, doc, docx, txt, md (max 50MB each)
- **Archives**: zip, rar, tar (max 100MB each)
- **Other**: json, csv, xml (max 25MB each)

**Success Response (201):**
```json
{
  "success": true,
  "attachments": [
    {
      "id": "cm4att123",
      "noteId": "cm4note123",
      "filename": "meeting-notes.pdf",
      "filepath": "attachments/2024/01/15/cm4att123_meeting-notes.pdf",
      "fileType": "application/pdf",
      "fileSize": 1048576,
      "uploadedBy": "cm4user123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "ocrResult": {
        "id": "cm4ocr123",
        "text": "Meeting Notes - January 15, 2024\n\nAgenda:\n1. Project updates\n2. Budget review...",
        "confidence": 0.95,
        "language": "en",
        "boundingBoxes": [
          {
            "text": "Meeting Notes",
            "x": 100,
            "y": 50,
            "width": 200,
            "height": 30,
            "confidence": 0.98
          }
        ],
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    },
    {
      "id": "cm4att124",
      "noteId": "cm4note123",
      "filename": "diagram.png",
      "filepath": "attachments/2024/01/15/cm4att124_diagram.png",
      "fileType": "image/png",
      "fileSize": 524288,
      "uploadedBy": "cm4user123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "thumbnailUrl": "https://storage.example.com/thumbnails/cm4att124_thumb.jpg",
      "ocrResult": {
        "id": "cm4ocr124",
        "text": "System Architecture Diagram\nDatabase -> API -> Frontend",
        "confidence": 0.87,
        "language": "en",
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    }
  ],
  "message": "Files uploaded successfully",
  "stats": {
    "totalFiles": 2,
    "totalSize": 1572864,
    "ocrProcessed": 2,
    "thumbnailsGenerated": 1
  }
}
```

**Response Fields:**
- `filepath`: Storage path/URL for the file
- `ocrResult`: Extracted text content (if applicable)
- `thumbnailUrl`: Generated thumbnail URL for images
- `boundingBoxes`: Text regions with coordinates (OCR)

**Error Responses:**
```json
// 400 - File too large
{
  "success": false,
  "message": "File size exceeds limit: 10MB max for images",
  "statusCode": 400
}

// 400 - Invalid file type
{
  "success": false,
  "message": "File type 'application/exe' not allowed",
  "statusCode": 400
}

// 404 - Note not found
{
  "success": false,
  "message": "Note not found or access denied",
  "statusCode": 404
}
```

---

### GET /attachments/note/:noteId

Get all attachments for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Query Parameters:**
- `includeOcr` (boolean, optional, default: true) - Include OCR results
- `fileType` (string, optional) - Filter by file type (image, document, archive)

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "attachments": [
    {
      "id": "cm4att123",
      "noteId": "cm4note123",
      "filename": "meeting-notes.pdf",
      "filepath": "attachments/2024/01/15/cm4att123_meeting-notes.pdf",
      "fileType": "application/pdf",
      "fileSize": 1048576,
      "uploadedBy": "cm4user123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "downloadUrl": "https://storage.example.com/attachments/cm4att123_meeting-notes.pdf",
      "user": {
        "id": "cm4user123",
        "name": "John Doe",
        "image": "https://avatar.com/john.jpg"
      },
      "ocrResult": {
        "text": "Meeting Notes - January 15, 2024...",
        "confidence": 0.95,
        "language": "en",
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    }
  ],
  "total": 1,
  "totalSize": 1048576,
  "groupedByType": {
    "images": 0,
    "documents": 1,
    "archives": 0,
    "other": 0
  }
}
```

---

### GET /attachments/:attachmentId

Get specific attachment details.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `attachmentId` (string) - Attachment ID

**Success Response (200):**
```json
{
  "success": true,
  "attachment": {
    "id": "cm4att123",
    "noteId": "cm4note123",
    "filename": "meeting-notes.pdf",
    "filepath": "attachments/2024/01/15/cm4att123_meeting-notes.pdf",
    "fileType": "application/pdf",
    "fileSize": 1048576,
    "uploadedBy": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "downloadUrl": "https://storage.example.com/attachments/cm4att123_meeting-notes.pdf",
    "previewUrl": "https://storage.example.com/previews/cm4att123_preview.jpg",
    "note": {
      "id": "cm4note123",
      "title": "Project Meeting Notes",
      "workspaceId": "cm4workspace123"
    },
    "user": {
      "id": "cm4user123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "ocrResult": {
      "id": "cm4ocr123",
      "text": "Meeting Notes - January 15, 2024\n\nAgenda:\n1. Project updates\n2. Budget review\n3. Timeline discussion\n\nKey Decisions:\n- Approved budget increase\n- Extended deadline to March 1st\n- Added two new team members\n\nAction Items:\n- Update project timeline (John)\n- Hire additional developers (HR)\n- Schedule design review (Jane)",
      "confidence": 0.95,
      "language": "en",
      "boundingBoxes": [
        {
          "text": "Meeting Notes",
          "x": 100,
          "y": 50,
          "width": 200,
          "height": 30,
          "confidence": 0.98
        },
        {
          "text": "January 15, 2024",
          "x": 100,
          "y": 80,
          "width": 150,
          "height": 20,
          "confidence": 0.97
        }
      ],
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  }
}
```

---

### GET /attachments/:attachmentId/download

Download attachment file.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `attachmentId` (string) - Attachment ID

**Success Response (200):**
Returns the file as binary data with appropriate headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="meeting-notes.pdf"
Content-Length: 1048576
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Attachment not found or access denied",
  "statusCode": 404
}
```

---

### DELETE /attachments/:attachmentId

Delete an attachment.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `attachmentId` (string) - Attachment ID

**Success Response (204):**
No content returned.

**Error Responses:**
```json
// 404 - Attachment not found
{
  "success": false,
  "message": "Attachment not found or access denied",
  "statusCode": 404
}

// 403 - Permission denied
{
  "success": false,
  "message": "Only the file uploader or note owner can delete attachments",
  "statusCode": 403
}
```

---

### POST /attachments/:attachmentId/process-ocr

Manually trigger OCR processing for an attachment.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `attachmentId` (string) - Attachment ID

**Success Response (202):**
```json
{
  "success": true,
  "message": "OCR processing queued",
  "attachmentId": "cm4att123",
  "estimatedTime": "1-3 minutes"
}
```

**Error Responses:**
```json
// 400 - File type not supported for OCR
{
  "success": false,
  "message": "OCR not supported for file type: audio/mp3",
  "statusCode": 400
}

// 409 - OCR already processed
{
  "success": false,
  "message": "OCR has already been processed for this attachment",
  "statusCode": 409
}
```

---

### POST /attachments/batch-upload

Upload multiple files in batch with progress tracking.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `files[]` (File[]) - Multiple files to upload (max 20 files)
- `noteId` (string) - Note ID to attach files to
- `processInBackground` (boolean, optional, default: true) - Process large files in background

**Success Response (202):**
```json
{
  "success": true,
  "batchId": "cm4batch123",
  "jobId": "cm4job456",
  "filesQueued": 15,
  "estimatedTime": "5-10 minutes",
  "message": "Batch upload queued for processing"
}
```

---

### GET /attachments/batch/:batchId/status

Check batch upload progress.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `batchId` (string) - Batch upload ID

**Success Response (200):**
```json
{
  "success": true,
  "batchId": "cm4batch123",
  "status": "PROCESSING",
  "progress": {
    "completed": 8,
    "total": 15,
    "percentage": 53,
    "currentFile": "document-09.pdf"
  },
  "results": {
    "successful": 7,
    "failed": 1,
    "pending": 7
  },
  "completedFiles": [
    {
      "filename": "image-01.jpg",
      "attachmentId": "cm4att201",
      "status": "SUCCESS"
    },
    {
      "filename": "large-document.pdf",
      "status": "FAILED",
      "error": "File corrupted"
    }
  ],
  "estimatedRemaining": "3-5 minutes"
}
```

---

### GET /attachments/search

Search attachments by filename or OCR content.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `q` (string, required) - Search query
- `fileType` (string, optional) - Filter by file type
- `hasOcr` (boolean, optional) - Only files with OCR text
- `dateFrom` (ISO string, optional) - Files uploaded from date
- `dateTo` (ISO string, optional) - Files uploaded to date
- `limit` (number, optional, default: 20) - Maximum results

**Success Response (200):**
```json
{
  "success": true,
  "query": "meeting agenda",
  "attachments": [
    {
      "id": "cm4att123",
      "filename": "meeting-notes.pdf",
      "fileType": "application/pdf",
      "fileSize": 1048576,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "note": {
        "id": "cm4note123",
        "title": "Project Meeting Notes"
      },
      "relevance": 0.92,
      "matchType": "OCR_CONTENT",
      "highlights": [
        "Meeting <mark>agenda</mark> for January 15th project review",
        "Discussed <mark>agenda</mark> items including budget and timeline"
      ],
      "ocrResult": {
        "confidence": 0.95,
        "language": "en"
      }
    }
  ],
  "total": 1,
  "facets": {
    "fileTypes": {
      "application/pdf": 1
    },
    "hasOcr": 1,
    "languages": {
      "en": 1
    }
  }
}
```

---

### GET /attachments/analytics

Get attachment usage analytics.

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
    "totalAttachments": 156,
    "totalStorage": 2147483648,
    "storageByType": {
      "images": 1073741824,
      "documents": 805306368,
      "archives": 268435456
    },
    "uploadsByDay": {
      "2024-01-15": 12,
      "2024-01-14": 8,
      "2024-01-13": 15
    },
    "topFileTypes": [
      {
        "type": "image/jpeg",
        "count": 45,
        "totalSize": 524288000
      },
      {
        "type": "application/pdf", 
        "count": 32,
        "totalSize": 671088640
      }
    ],
    "ocrStats": {
      "processedFiles": 89,
      "averageConfidence": 0.91,
      "languageDistribution": {
        "en": 78,
        "es": 8,
        "fr": 3
      }
    },
    "performance": {
      "averageUploadTime": 2.3,
      "averageOcrTime": 15.7,
      "successRate": 0.97
    }
  }
}
```

## 🔧 File Processing Features

### Storage Backend Selection

The system supports multiple storage backends:

1. **Cloudflare R2** (Primary)
   - Distributed CDN delivery
   - Automatic compression
   - Global edge caching
   - Cost-effective storage

2. **Local Storage** (Fallback)
   - Server filesystem storage  
   - Direct file serving
   - No external dependencies
   - Development/testing use

### OCR Text Extraction

**Supported Formats:**
- Images: JPG, PNG, GIF, WebP, TIFF
- Documents: PDF (scanned), DOCX (images)
- Archives: Extract and process contained images

**OCR Pipeline:**
```typescript
// OCR processing workflow
const ocrPipeline = {
  preprocessing: {
    imageOptimization: true,
    contrastEnhancement: true,
    noiseReduction: true,
    deskewing: true
  },
  textExtraction: {
    multiLanguage: true,
    layoutAnalysis: true,
    boundingBoxes: true,
    confidenceScoring: true
  },
  postprocessing: {
    spellCorrection: true,
    formatCleaning: true,
    structureDetection: true
  }
};
```

### File Security

**Validation Checks:**
- File type verification (MIME + extension)
- Magic number validation
- Virus scanning integration
- Size limit enforcement
- Content analysis for malicious patterns

**Security Features:**
```typescript
// Security scanning
const securityChecks = {
  mimeTypeValidation: true,
  magicNumberCheck: true,
  extensionVerification: true,
  malwareScanning: true,
  contentAnalysis: true,
  quarantineProcessing: true
};
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Upload single file:**
```bash
curl -X POST http://localhost:3001/api/attachments/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files[]=@/path/to/document.pdf" \
  -F "noteId=cm4note123"
```

**Upload multiple files:**
```bash
curl -X POST http://localhost:3001/api/attachments/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files[]=@/path/to/image1.jpg" \
  -F "files[]=@/path/to/document.pdf" \
  -F "files[]=@/path/to/archive.zip" \
  -F "noteId=cm4note123"
```

**Download file:**
```bash
curl -X GET http://localhost:3001/api/attachments/cm4att123/download \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output downloaded_file.pdf
```

**Search attachments:**
```bash
curl -X GET "http://localhost:3001/api/attachments/search?q=meeting+agenda&hasOcr=true&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Advanced Features

### Intelligent File Processing

```typescript
// Smart file categorization
const fileProcessor = {
  imageProcessing: {
    thumbnailGeneration: true,
    formatOptimization: true,
    metadataExtraction: true,
    colorAnalysis: true
  },
  documentProcessing: {
    textExtraction: true,
    structureAnalysis: true,
    languageDetection: true,
    summaryGeneration: true
  },
  archiveProcessing: {
    contentListing: true,
    recursiveExtraction: true,
    virusScanning: true,
    sizeAnalysis: true
  }
};
```

### Background Processing

- **Large File Handling**: Process files >10MB in background
- **Batch Operations**: Handle multiple file uploads efficiently  
- **OCR Queue**: Dedicated queue for text extraction
- **Thumbnail Generation**: Automatic image thumbnail creation
- **Content Analysis**: AI-powered file content analysis

### Storage Optimization

```typescript
// Storage optimization strategies
const optimizations = {
  compression: {
    images: 'webp_conversion',
    documents: 'pdf_optimization',
    archives: 'smart_compression'
  },
  deduplication: {
    hashBasedDetection: true,
    contentComparison: true,
    referenceSharing: true
  },
  lifecycle: {
    coldStorageAfterDays: 90,
    archivalAfterDays: 365,
    deletionPolicy: 'user_controlled'
  }
};
```

## ❌ Common Issues and Solutions

### Issue: "Upload fails for large files"
**Cause:** Server timeout or memory limits
**Solution:** Use batch upload with background processing

### Issue: "OCR accuracy is poor"
**Cause:** Low image quality or complex layouts
**Solution:** Enhance image preprocessing, adjust OCR parameters

### Issue: "Storage quota exceeded"
**Cause:** User approaching storage limits
**Solution:** Implement compression, cleanup old files, upgrade storage

### Issue: "File type not supported"
**Cause:** Restricted file type or missing MIME configuration
**Solution:** Check allowed file types list, update configuration

## 🔄 Background Processing

### Queue System
- **File Upload**: Handle large file uploads
- **OCR Processing**: Extract text from images/documents
- **Thumbnail Generation**: Create image previews
- **Content Analysis**: AI analysis of file content
- **Storage Cleanup**: Remove orphaned files

### Maintenance Jobs
- **Daily**: Generate thumbnails for new images
- **Weekly**: Process pending OCR jobs
- **Monthly**: Storage usage analysis and cleanup
- **Quarterly**: Archive old attachments to cold storage

## 📊 File Management Dashboard

### Analytics Features
- Storage usage by file type
- Upload trends over time
- OCR processing statistics
- Most accessed attachments
- File size distribution analysis

### Management Tools
- Bulk file operations
- Storage quota monitoring
- File type configuration
- OCR language settings
- Security policy management

---

**Next:** [Phase 3 Planning](../phase3/README.md)

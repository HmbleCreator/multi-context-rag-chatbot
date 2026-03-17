# API Documentation

Base URL: `http://localhost:3000`

## POST `/api/chat`

Generate a response with context and sources.

Request:
```json
{
  "message": "What are the grounding requirements?",
  "history": [
    { "role": "user", "content": "Hi", "timestamp": "2026-01-01T00:00:00Z" }
  ],
  "model": "deepseek-chat-v3-free"
}
```

Response:
```json
{
  "content": "According to NEC Article 250...",
  "context": "nec",
  "confidence": 0.95,
  "sources": [
    {
      "title": "NEC Article 250 - Grounding and Bonding",
      "content": "...",
      "context": "nec",
      "relevanceScore": 0.88,
      "section": "Article 250",
      "chunkId": "nec-2"
    }
  ],
  "suggestions": [
    "Tell me more about NEC Article 250 - Grounding and Bonding"
  ]
}
```

## GET `/api/search?q=...`

Returns top matches from the knowledge base.

Response:
```json
{
  "query": "grounding requirements",
  "context": "nec",
  "confidence": 0.9,
  "documents": [
    {
      "id": "nec-2",
      "title": "NEC Article 250 - Grounding and Bonding",
      "content": "...",
      "context": "nec",
      "section": "Article 250"
    }
  ]
}
```

## POST `/api/documents`

Uploads a PDF and ingests it into Pinecone.

Form Data:
- `file` (PDF)
- `category` (`nec` | `wattmonk` | `general`)

Response:
```json
{
  "success": true,
  "message": "Successfully processed 12 document chunks",
  "documentCount": 12,
  "filename": "example.pdf",
  "category": "nec"
}
```

## GET `/api/health`

Returns basic configuration status.

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "services": {
    "gemini": "configured"
  },
  "version": "1.0.0"
}
```

# RAG Chatbot - NEC & Wattmonk

Context-aware chatbot that routes questions to NEC codes, Wattmonk docs, or general chat. Includes search, PDF ingestion into Pinecone, source attribution, and provider selection.

## Features

- Multi-context handling (NEC / Wattmonk / General)
- Source attribution with citations
- Conversation memory (last 10 turns)
- Search panel for knowledge base
- PDF upload + Pinecone ingestion
- Confidence scoring and query suggestions
- Multiple LLM providers (Gemini / OpenRouter / NVIDIA)

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Vector DB**: Pinecone (optional)
- **LLMs**: Gemini / OpenRouter / NVIDIA

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm run dev
```

Open http://localhost:3000

## Environment Variables

See `.env.example` for full list.

Required:
- `GEMINI_API_KEY` or `OPENROUTER_API_KEY` or `NVIDIA_API_KEY`

Optional:
- `PINECONE_API_KEY`
- `PINECONE_INDEX`
- `PINECONE_HOST`
- `PINECONE_NAMESPACE`
- `PINECONE_TEXT_FIELD`
- `PINECONE_QUERY_FIELD`
- `PINECONE_ENABLED=false`

## Ingest Documents

### UI Upload
Use the **Upload documents** panel to add PDFs.

### CLI Ingestion
```bash
pnpm run ingest -- C:\path\to\file.pdf --category nec
```

## Documentation

- Architecture: `ARCHITECTURE.md`
- API: `API.md`
- User guide: `USER_GUIDE.md`
- Deployment: `DEPLOYMENT.md`
- Performance template: `PERFORMANCE.md`
- Submission checklist: `SUBMISSION.md`

## Troubleshooting

- **OpenRouter 404**: model slug not available for your key.
- **Gemini 429**: quota exceeded; switch providers.
- **Pinecone errors**: set `PINECONE_ENABLED=false` or verify `PINECONE_HOST` and integrated embedding field map.

## License

MIT

# Deployment Guide

## Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables:
   - `OPENROUTER_API_KEY` (recommended)
   - or `GEMINI_API_KEY`
   - or `NVIDIA_API_KEY`
   - `PINECONE_API_KEY`, `PINECONE_INDEX`, `PINECONE_HOST` (optional)
   - `PINECONE_NAMESPACE`, `PINECONE_TEXT_FIELD`, `PINECONE_QUERY_FIELD` (optional)
4. Deploy.

## Local Build

```bash
pnpm install
pnpm run build
pnpm run start
```

## Notes

- If you see provider 404 errors, your model slug is not available for your account.
- If Pinecone inference fails, set `PINECONE_ENABLED=false` or verify the integrated embedding field map.

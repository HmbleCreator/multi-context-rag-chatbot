# User Guide

## Overview

This chatbot answers:
- **NEC code** questions (electrical standards)
- **Wattmonk** company information
- **General** conversational questions

It automatically detects the context and shows sources when available.

## How To Use

### Ask a Question
1. Type your question in the chat box.
2. Press **Enter** to send (Shift+Enter for a new line).
3. Review the answer, confidence, and sources.

### Search the Knowledge Base
1. Use the **Knowledge search** panel on the left.
2. Enter a topic and hit **Search**.
3. Click **Ask about this** to turn a result into a chat question.

### Upload Documents (PDF)
1. Use **Upload documents**.
2. Select a PDF file.
3. Pick a category: `NEC`, `Wattmonk`, or `General`.
4. Upload to Pinecone and wait for confirmation.

### Switch Models
Use the model selector in the header to switch between providers.  
If a model is unavailable, you may see a provider error; switch to another model or provider.

## Tips

- Ask short, specific questions for best retrieval.
- For NEC, include article numbers if you know them (e.g., "Article 250").
- Upload PDFs before asking about new content.

## Troubleshooting

- **No sources shown**: likely no documents were retrieved.
- **Provider errors**: check API keys or switch provider.
- **Pinecone errors**: disable Pinecone or verify `PINECONE_HOST` and the integrated embedding field map.

## Keyboard Shortcuts

- **Enter**: send message
- **Shift + Enter**: new line


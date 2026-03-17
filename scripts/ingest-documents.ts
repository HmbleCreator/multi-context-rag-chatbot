import fs from 'fs';
import path from 'path';
import {
  extractTextFromPDF,
  chunkText,
  createDocumentsFromChunks,
  detectCategory,
} from '../lib/document-processor';
import { addDocuments } from '../lib/pinecone';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const files: string[] = [];
  let category: string | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--category' || arg === '-c') {
      category = args[i + 1];
      i += 1;
      continue;
    }
    if (arg.startsWith('--category=')) {
      category = arg.split('=')[1];
      continue;
    }
    files.push(arg);
  }

  return { files, category };
}

async function ingestFile(filePath: string, category?: string) {
  const absolute = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolute)) {
    throw new Error(`File not found: ${absolute}`);
  }

  const buffer = fs.readFileSync(absolute);
  const text = await extractTextFromPDF(buffer);
  const detected = category || detectCategory(text);
  const chunks = chunkText(text);
  const docs = createDocumentsFromChunks(chunks, {
    title: path.basename(filePath).replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
    source: path.basename(filePath),
    category: detected,
  });

  await addDocuments(docs);
  return docs.length;
}

async function main() {
  loadEnv();
  const { files, category } = parseArgs();

  if (files.length === 0) {
    console.log('Usage: pnpm run ingest -- <file1.pdf> <file2.pdf> [--category nec|wattmonk|general]');
    process.exit(1);
  }

  let total = 0;
  for (const file of files) {
    console.log(`Ingesting ${file}...`);
    const count = await ingestFile(file, category);
    total += count;
    console.log(`  -> ${count} chunks`);
  }

  console.log(`Done. Total chunks: ${total}`);
}

main().catch((err) => {
  console.error('Ingest failed:', err);
  process.exit(1);
});

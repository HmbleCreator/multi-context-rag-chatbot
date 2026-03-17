import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getContextColor(context: 'general' | 'nec' | 'wattmonk'): string {
  switch (context) {
    case 'nec':
      return 'bg-nec-100 text-nec-800 border-nec-200';
    case 'wattmonk':
      return 'bg-wattmonk-100 text-wattmonk-800 border-wattmonk-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getContextLabel(context: 'general' | 'nec' | 'wattmonk'): string {
  switch (context) {
    case 'nec':
      return 'NEC Code';
    case 'wattmonk':
      return 'Wattmonk';
    default:
      return 'General';
  }
}

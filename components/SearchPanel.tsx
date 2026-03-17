'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { ContextBadge } from './ContextIndicator';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  context: 'general' | 'nec' | 'wattmonk';
  section?: string;
}

interface SearchPanelProps {
  onAsk: (query: string) => void;
}

export function SearchPanel({ onAsk }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastContext, setLastContext] = useState<'general' | 'nec' | 'wattmonk'>('general');

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.documents || []);
      setLastContext(data.context || 'general');
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/70 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Knowledge search</h2>
        <span className="text-xs text-gray-500">NEC + Wattmonk</span>
      </div>
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="sr-only" htmlFor="kb-search">
              Search knowledge base
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
              <Search size={16} className="text-gray-400" />
              <input
                id="kb-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search NEC or Wattmonk topics..."
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              'flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors sm:w-auto',
              query.trim() && !isLoading
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-100 text-gray-400'
            )}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>

      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Search results</span>
            <ContextBadge context={lastContext} />
          </div>
          <div className="grid gap-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-900">{result.title}</div>
                  <ContextBadge context={result.context} />
                </div>
                {result.section && (
                  <div className="mt-1 text-[11px] text-gray-500">
                    Section: {result.section}
                  </div>
                )}
                <p className="mt-2 text-gray-600">{result.content}</p>
                <button
                  onClick={() => onAsk(result.title)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:underline"
                >
                  Ask about this
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

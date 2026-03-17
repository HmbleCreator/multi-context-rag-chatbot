'use client';

import { Message } from '@/types';
import { cn, formatTimestamp, getContextColor, getContextLabel } from '@/lib/utils';
import { User, Bot, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ContextBadge } from './ContextIndicator';

interface ChatMessageProps {
  message: Message;
  showSources?: boolean;
}

export function ChatMessage({ message, showSources = true }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3 px-2 py-3 animate-fade-in sm:px-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full',
          isUser
            ? 'bg-primary-500 text-white'
            : message.context === 'nec'
            ? 'bg-nec-500 text-white'
            : message.context === 'wattmonk'
            ? 'bg-wattmonk-500 text-white'
            : 'bg-gray-500 text-white'
        )}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      {/* Message Content */}
      <div className={cn('flex w-full max-w-4xl flex-col', isUser ? 'items-end' : 'items-start')}>
        {/* Context Badge */}
        {!isUser && message.context && message.context !== 'general' && (
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                getContextColor(message.context)
              )}
            >
              {getContextLabel(message.context)}
            </span>
            {message.confidence !== undefined && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Confidence {Math.round(message.confidence * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-primary-600 text-white shadow-primary-500/30'
              : 'bg-white/90 text-gray-900 ring-1 ring-gray-200/70'
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="mt-1 text-xs text-gray-400">
          {formatTimestamp(message.timestamp)}
        </span>

        {/* Sources */}
        {!isUser && showSources && message.sources && message.sources.length > 0 && (
          <details className="mt-2 w-full rounded-2xl border border-gray-200/70 bg-white/80 p-3 text-xs shadow-sm">
            <summary className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600">
              <BookOpen size={12} />
              Sources ({message.sources.length})
            </summary>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
              {message.sources.map((source, index) => {
                const sectionSlug = source.section
                  ? source.section.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  : 'section';
                const anchorId = `source-${message.id}-${index}-${sectionSlug}`;
                return (
                  <a
                    key={anchorId}
                    href={`#${anchorId}`}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 hover:bg-gray-100"
                  >
                    [{index + 1}] {source.section || source.title}
                  </a>
                );
              })}
            </div>
            <div className="mt-3 space-y-2">
              {message.sources.map((source, index) => {
                const sectionSlug = source.section
                  ? source.section.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  : 'section';
                const anchorId = `source-${message.id}-${index}-${sectionSlug}`;
                return (
                <div
                  key={`${source.title}-${index}`}
                  id={anchorId}
                  className="rounded-xl border border-gray-200 bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900">
                      [{index + 1}] {source.title}
                    </div>
                    <ContextBadge context={source.context} />
                  </div>
                  {source.section && (
                    <div className="mt-1 text-[11px] text-gray-500">
                      Section: {source.section}
                    </div>
                  )}
                  {source.chunkId && (
                    <div className="text-[11px] text-gray-400">
                      Chunk: {source.chunkId}
                    </div>
                  )}
                  <p className="mt-2 text-gray-600">{source.content}</p>
                </div>
              );})}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

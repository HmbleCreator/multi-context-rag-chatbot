'use client';

import { useState, ChangeEvent, FormEvent, DragEvent, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UploadPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<'nec' | 'wattmonk' | 'general'>('general');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setMessage(null);
    setError(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    if (dropped.length > 0) {
      setFiles(dropped);
      setMessage(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);
    setMessage(null);
    setError(null);

    try {
      let totalChunks = 0;
      let pineconeOk = true;
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const response = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Upload failed');
        }

        const data = await response.json();
        totalChunks += data.documentCount || 0;
        if (data.storedInPinecone === false) {
          pineconeOk = false;
          setError(
            data.pineconeError
              ? `Pinecone ingest failed: ${data.pineconeError}`
              : 'Pinecone ingest failed. Stored locally for this session.'
          );
        }
      }
      setMessage(
        pineconeOk
          ? `Uploaded ${files.length} file(s), ${totalChunks} chunks total. Stored in Pinecone.`
          : `Uploaded ${files.length} file(s), ${totalChunks} chunks total. Stored locally (Pinecone failed).`
      );
      setFiles([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Upload documents</h2>
        <span className="text-xs text-gray-500">PDF only</span>
      </div>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-xs">
        <div className="block">
          <span className="sr-only">Choose PDF</span>
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={cn(
              'flex items-center justify-center rounded-xl border border-dashed px-3 py-4 text-[11px] text-gray-500 transition-colors',
              isDragging ? 'border-primary-400 bg-primary-50/60 text-primary-700' : 'border-gray-200 bg-white'
            )}
          >
            Drag & drop PDFs here or click to browse.
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'nec' | 'wattmonk' | 'general')}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700"
          >
            <option value="general">General</option>
            <option value="nec">NEC</option>
            <option value="wattmonk">Wattmonk</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={files.length === 0 || isUploading}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
            files.length > 0 && !isUploading
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-100 text-gray-400'
          )}
        >
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {isUploading ? 'Uploading...' : 'Upload to Pinecone'}
        </button>

        {files.length > 0 && (
          <ul className="space-y-1 text-[11px] text-gray-500">
            {files.map((f) => (
              <li key={f.name} className="truncate">
                {f.name}
              </li>
            ))}
          </ul>
        )}
        {message && <p className="text-[11px] text-emerald-600">{message}</p>}
        {error && <p className="text-[11px] text-red-500">{error}</p>}
      </form>
    </div>
  );
}

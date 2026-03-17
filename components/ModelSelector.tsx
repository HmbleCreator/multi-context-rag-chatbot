'use client';

import { useState } from 'react';

export type AIModelProvider = 
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  | 'deepseek-chat-v3-free'
  | 'deepseek-r1-free'
  | 'llama-3.2-3b-free'
  | 'mixtral-8x7b-free'
  | 'qwen3-235b-free'
  | 'nvidia-deepseek-r1'
  | 'nvidia-qwen3';

interface AIModelOption {
  value: AIModelProvider;
  label: string;
  description: string;
  provider: 'gemini' | 'openrouter' | 'nvidia';
}

const AI_MODELS: AIModelOption[] = [
  {
    value: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    description: 'Fast, 1M context, free',
    provider: 'gemini'
  },
  {
    value: 'gemini-2.0-pro',
    label: 'Gemini 2.0 Pro',
    description: 'More capable, 1M context',
    provider: 'gemini'
  },
  {
    value: 'deepseek-chat-v3-free',
    label: 'DeepSeek V3',
    description: 'Fast, strong reasoning',
    provider: 'openrouter'
  },
  {
    value: 'deepseek-r1-free',
    label: 'DeepSeek R1',
    description: 'Advanced reasoning model',
    provider: 'openrouter'
  },
  {
    value: 'llama-3.2-3b-free',
    label: 'Llama 3.2 3B',
    description: 'Lightweight, efficient',
    provider: 'openrouter'
  },
  {
    value: 'mixtral-8x7b-free',
    label: 'Mixtral 8x7B',
    description: 'Fast, multilingual',
    provider: 'openrouter'
  },
  {
    value: 'qwen3-235b-free',
    label: 'Qwen 3 235B',
    description: 'Large, powerful',
    provider: 'openrouter'
  },
  {
    value: 'nvidia-deepseek-r1',
    label: 'NVIDIA DeepSeek R1',
    description: 'Fast reasoning via NVIDIA',
    provider: 'nvidia'
  },
  {
    value: 'nvidia-qwen3',
    label: 'NVIDIA Qwen3',
    description: 'Fast via NVIDIA NIM',
    provider: 'nvidia'
  }
];

export function ModelSelector({
  onModelChange,
  selectedModel
}: {
  onModelChange: (model: AIModelProvider) => void;
  selectedModel: AIModelProvider;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const selectedModelOption = AI_MODELS.find(option => option.value === selectedModel);
  
  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
      >
        <div className="flex-1">
          <span className="font-medium">{selectedModelOption?.label || 'Select AI Model'}</span>
          <p className="text-xs text-gray-500 mt-1">{selectedModelOption?.description || ''}</p>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-[60]">
          {AI_MODELS.map(option => (
            <div
              key={option.value}
              onClick={() => {
                onModelChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${selectedModel === option.value ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-primary-100 rounded-full text-primary-600">
                  {option.provider === 'gemini' ? 'G' : option.provider === 'openrouter' ? 'O' : 'N'}
                </div>
                <div>
                  <span className="font-medium block">{option.label}</span>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

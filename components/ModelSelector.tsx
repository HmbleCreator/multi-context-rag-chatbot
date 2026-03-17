'use client';

import { useState } from 'react';

export type AIModelProvider = 
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  | 'openrouter-auto'
  | 'deepseek-v3'
  | 'deepseek-r1'
  | 'qwen-3-8b'
  | 'llama-3-8b'
  | 'minimax-m2.5'
  | 'nvidia-nemotron-3-super'
  | 'nvidia-qwen3'
  | 'nvidia-kimi-k2';

interface AIModelOption {
  value: AIModelProvider;
  label: string;
  description: string;
  provider: 'gemini' | 'openrouter' | 'nvidia';
}

const AI_MODELS: AIModelOption[] = [
  // Gemini
  {
    value: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    description: 'gemini-2.0-flash (Google)',
    provider: 'gemini'
  },
  {
    value: 'gemini-2.0-pro',
    label: 'Gemini 2.0 Pro',
    description: 'gemini-2.0-pro (Google)',
    provider: 'gemini'
  },
  // OpenRouter
  {
    value: 'openrouter-auto',
    label: 'Auto (Best Free)',
    description: 'openrouter/auto - automatically selects best free model',
    provider: 'openrouter'
  },
  {
    value: 'deepseek-v3',
    label: 'DeepSeek V3',
    description: 'deepseek/deepseek-chat',
    provider: 'openrouter'
  },
  {
    value: 'deepseek-r1',
    label: 'DeepSeek R1',
    description: 'deepseek/deepseek-r1',
    provider: 'openrouter'
  },
  {
    value: 'qwen-3-8b',
    label: 'Qwen 3 8B',
    description: 'qwen/qwen3-8b-instruct',
    provider: 'openrouter'
  },
  {
    value: 'llama-3-8b',
    label: 'Llama 3 8B',
    description: 'meta-llama/llama-3-8b-instruct',
    provider: 'openrouter'
  },
  {
    value: 'minimax-m2.5',
    label: 'MiniMax M2.5',
    description: 'minimax/minimax-m2.5',
    provider: 'openrouter'
  },
  // NVIDIA
  {
    value: 'nvidia-nemotron-3-super',
    label: 'NVIDIA Nemotron 3 Super',
    description: 'nvidia/nemotron-3-super-120b-a12b',
    provider: 'nvidia'
  },
  {
    value: 'nvidia-qwen3',
    label: 'NVIDIA Qwen3.5 122B',
    description: 'qwen/qwen3.5-122b-a10b',
    provider: 'nvidia'
  },
  {
    value: 'nvidia-kimi-k2',
    label: 'NVIDIA Kimi K2 Thinking',
    description: 'moonshotai/kimi-k2-thinking',
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
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-[60] max-h-80 overflow-y-auto">
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

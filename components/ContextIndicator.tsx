'use client';

import { ContextType } from '@/types';
import { cn, getContextLabel } from '@/lib/utils';
import { Zap, Sun, MessageCircle } from 'lucide-react';

interface ContextIndicatorProps {
  context: ContextType;
  confidence?: number;
}

const contextConfig = {
  nec: {
    icon: Zap,
    label: 'NEC Code',
    description: 'Answering from electrical code guidelines',
    color: 'bg-nec-500',
    bgColor: 'bg-nec-50',
    textColor: 'text-nec-700',
    borderColor: 'border-nec-200',
  },
  wattmonk: {
    icon: Sun,
    label: 'Wattmonk',
    description: 'Answering from company documentation',
    color: 'bg-wattmonk-500',
    bgColor: 'bg-wattmonk-50',
    textColor: 'text-wattmonk-700',
    borderColor: 'border-wattmonk-200',
  },
  general: {
    icon: MessageCircle,
    label: 'General',
    description: 'General conversation',
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
  },
};

export function ContextIndicator({ context, confidence }: ContextIndicatorProps) {
  const config = contextConfig[context];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all',
        config.bgColor,
        config.textColor,
        config.borderColor
      )}
    >
      <Icon size={14} className={cn('shrink-0', config.color, 'text-white rounded-full p-0.5')} />
      <span className="font-medium">{config.label}</span>
      {confidence !== undefined && confidence > 0 && (
        <span className="text-xs opacity-70">({Math.round(confidence * 100)}%)</span>
      )}
    </div>
  );
}

export function ContextBadge({ context }: { context: ContextType }) {
  const config = contextConfig[context];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        config.bgColor,
        config.textColor
      )}
    >
      <Icon size={10} />
      {getContextLabel(context)}
    </span>
  );
}

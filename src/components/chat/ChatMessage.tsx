'use client';

import React from 'react';
import { Bot, User, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import FadeIn from '@/components/animations/FadeIn';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <FadeIn direction={isUser ? 'left' : 'right'} duration={0.25} className="w-full">
      <div
        className={cn(
          'flex gap-4 w-full group',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-1 transition-transform group-hover:scale-105',
            isUser
              ? 'bg-[#11151C] border-[rgba(255,255,255,0.08)] text-[#A8B3C7]'
              : 'bg-[rgba(212,175,55,0.1)] border-[rgba(212,175,55,0.2)] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.15)]'
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            'flex flex-col gap-1 max-w-[85%]',
            isUser ? 'items-end' : 'items-start'
          )}
        >
          <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-label px-1">
            {isUser ? 'You' : 'Legal Copilot'}
          </span>
          
          <div
            className={cn(
              'p-4 text-[13px] leading-relaxed',
              isUser
                ? 'bg-[#11151C] text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] rounded-2xl rounded-tr-sm'
                : 'bg-[rgba(212,175,55,0.03)] border border-[rgba(212,175,55,0.15)] text-[#A8B3C7] rounded-2xl rounded-tl-sm font-sans'
            )}
          >
            {/* Minimal markdown-style rendering for bot responses */}
            {message.content.split('\n').map((paragraph, idx) => {
              if (!paragraph.trim()) return <div key={idx} className="h-2" />;
              
              // Highlight bold text (markdown **text**)
              const formattedText = paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="text-[#F8FAFC] font-semibold">{part.slice(2, -2)}</strong>;
                }
                return part;
              });

              return (
                <p key={idx} className="mb-1.5 last:mb-0">
                  {formattedText}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

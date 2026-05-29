'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { TabItem } from '@/lib/types';

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 p-1 rounded-xl bg-[#11151C] border border-[rgba(255,255,255,0.06)]',
        className
      )}
      role="tablist"
      aria-label="Tab navigation"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40',
              isActive ? 'text-[#F8FAFC]' : 'text-[#667085] hover:text-[#A8B3C7]'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#1A202B] border border-[rgba(255,255,255,0.1)] rounded-lg"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className={cn('w-4 h-4', isActive && 'text-[#D4AF37]')} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

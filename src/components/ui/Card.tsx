'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

type CardVariant = 'surface' | 'elevated' | 'command' | 'risk';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  glowing?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: CardVariant;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles: Record<CardVariant, string> = {
  surface: 'bg-[#1A202B] border-[rgba(255,255,255,0.08)]',
  elevated: 'bg-[#171C25] border-[rgba(255,255,255,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.3)]',
  command: 'bg-[#11151C] border-[rgba(255,255,255,0.06)] shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
  risk: 'bg-[#1A202B] border-[rgba(255,255,255,0.06)]',
};

export default function Card({
  children,
  hoverable = false,
  glowing = false,
  className,
  padding = 'md',
  variant = 'surface',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -3, scale: 1.005 } : undefined}
      transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        'rounded-xl border transition-all duration-250',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && 'cursor-pointer hover:border-[rgba(255,255,255,0.14)] hover:bg-[#242B36]',
        glowing && 'shadow-[0_0_30px_rgba(212,175,55,0.1)]',
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  glowing?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  hoverable = false,
  glowing = false,
  className,
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        'glass-card',
        paddingStyles[padding],
        hoverable && 'cursor-pointer',
        glowing && 'glow-primary',
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

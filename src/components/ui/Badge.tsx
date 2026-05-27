import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const glowStyles: Record<BadgeVariant, string> = {
  default: 'shadow-[0_0_12px_rgba(100,116,139,0.15)]',
  success: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  warning: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  danger: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]',
  info: 'shadow-[0_0_12px_rgba(59,130,246,0.2)]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  glow = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        glow && glowStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

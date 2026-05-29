import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(255,255,255,0.06)] text-[#A8B3C7] border-[rgba(255,255,255,0.1)]',
  success: 'bg-[rgba(16,185,129,0.1)] text-[#10B981] border-[rgba(16,185,129,0.2)]',
  warning: 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.2)]',
  danger: 'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.2)]',
  info: 'bg-[rgba(59,130,246,0.1)] text-[#3B82F6] border-[rgba(59,130,246,0.2)]',
  gold: 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border-[rgba(212,175,55,0.2)]',
};

const glowStyles: Record<BadgeVariant, string> = {
  default: 'shadow-[0_0_10px_rgba(100,116,139,0.1)]',
  success: 'shadow-[0_0_10px_rgba(16,185,129,0.15)]',
  warning: 'shadow-[0_0_10px_rgba(245,158,11,0.15)]',
  danger: 'shadow-[0_0_10px_rgba(239,68,68,0.15)]',
  info: 'shadow-[0_0_10px_rgba(59,130,246,0.15)]',
  gold: 'shadow-[0_0_10px_rgba(212,175,55,0.15)]',
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
        'inline-flex items-center font-semibold rounded-full border whitespace-nowrap tracking-wide',
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

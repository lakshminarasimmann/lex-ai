'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#D4AF37] text-[#090B0F] shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:bg-[#E0C04A] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] border-[#D4AF37]/30 font-bold',
  secondary:
    'bg-[#171C25] text-[#A8B3C7] border-[rgba(255,255,255,0.08)] hover:bg-[#1A202B] hover:text-[#F8FAFC] hover:border-[rgba(255,255,255,0.14)]',
  ghost:
    'bg-transparent text-[#A8B3C7] border-transparent hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F8FAFC]',
  danger:
    'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.15)] hover:border-[rgba(239,68,68,0.3)]',
  outline:
    'bg-transparent text-[#A8B3C7] border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.14)] hover:text-[#F8FAFC]',
  gold:
    'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B0F] shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:from-[#E0C04A] hover:to-[#D4AF37] border-transparent font-bold',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015, y: disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center font-medium border transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090B0F]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        isLoading && 'cursor-wait',
        className
      )}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading && (
        <span className="spinner mr-1.5" aria-hidden="true" />
      )}
      {!isLoading && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}

import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'card' | 'avatar' | 'chart';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  lines?: number;
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-4 rounded-md skeleton-shimmer',
        className
      )}
    />
  );
}

function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-1/3 h-5" />
          <SkeletonLine className="w-1/2 h-3" />
        </div>
      </div>
      <TextSkeleton lines={2} />
      <div className="flex gap-2">
        <SkeletonLine className="w-16 h-6 rounded-full" />
        <SkeletonLine className="w-20 h-6 rounded-full" />
      </div>
    </div>
  );
}

function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="w-10 h-10 rounded-full skeleton-shimmer" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-24 h-4" />
        <SkeletonLine className="w-16 h-3" />
      </div>
    </div>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6', className)}>
      <SkeletonLine className="w-32 h-5 mb-4" />
      <div className="flex items-end gap-2 h-32">
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md skeleton-shimmer"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Skeleton({
  variant = 'text',
  className,
  lines,
}: SkeletonProps) {
  switch (variant) {
    case 'card':
      return <CardSkeleton className={className} />;
    case 'avatar':
      return <AvatarSkeleton className={className} />;
    case 'chart':
      return <ChartSkeleton className={className} />;
    default:
      return <TextSkeleton lines={lines} className={className} />;
  }
}

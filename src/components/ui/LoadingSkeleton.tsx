import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  lines?: number
  className?: string
  type?: 'text' | 'card' | 'table' | 'avatar'
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-200',
        className,
      )}
    />
  )
}

export default function LoadingSkeleton({
  lines = 3,
  className,
  type = 'text',
}: LoadingSkeletonProps) {
  if (type === 'avatar') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <SkeletonLine className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-1/3" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={cn('space-y-3 rounded-xl border border-surface-200 p-4', className)}>
        <SkeletonLine className="h-5 w-1/4" />
        <SkeletonLine className="h-8 w-1/3" />
        <SkeletonLine className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2">
          <SkeletonLine className="h-6 w-16 rounded-full" />
          <SkeletonLine className="h-6 w-12 rounded-full" />
        </div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className={cn('space-y-0 overflow-hidden rounded-xl border border-surface-200', className)}>
        <div className="border-b border-surface-200 bg-surface-50 px-4 py-3">
          <div className="flex gap-4">
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-4 w-16" />
            <SkeletonLine className="h-4 w-20" />
          </div>
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-4 px-4 py-3',
              i < lines - 1 && 'border-b border-surface-100',
            )}
          >
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-4 w-16" />
            <SkeletonLine className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={cn(
            'h-3.5',
            i === 0 && 'w-full',
            i === 1 && 'w-[85%]',
            i === 2 && 'w-[70%]',
            i > 2 && 'w-[50%]',
          )}
        />
      ))}
    </div>
  )
}

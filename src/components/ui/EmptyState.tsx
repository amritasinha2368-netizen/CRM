import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-surface-100 p-4">
        <Icon className="h-10 w-10 text-surface-300" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-surface-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-surface-500">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

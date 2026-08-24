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
    <div className={cn('flex flex-col items-center justify-center py-12 text-center rounded-xl bg-[#282828] border border-[#3E3E3E] shadow-lg', className)}>
      <div className="mb-4 rounded-full bg-[#303030] p-4 border border-[#3E3E3E]">
        <Icon className="h-10 w-10 text-[#FFA116]" />
      </div>
      <h3 className="mb-1 text-sm font-bold text-white">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-xs font-medium text-slate-400">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

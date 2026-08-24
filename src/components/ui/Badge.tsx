import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border border-slate-700 font-extrabold',
  primary: 'bg-amber-950/80 text-[#FBBF24] border border-amber-500/50 font-black',
  success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-extrabold',
  warning: 'bg-amber-950/60 text-amber-300 border border-amber-500/40 font-extrabold',
  danger: 'bg-rose-950/80 text-rose-300 border border-rose-500/50 font-extrabold',
  info: 'bg-blue-950/80 text-blue-300 border border-blue-500/50 font-extrabold',
}

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  primary: 'bg-[#FBBF24]',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-blue-400',
}

export default function Badge({
  variant = 'default',
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold backdrop-blur-xs shadow-xs',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotStyles[variant])} />
      )}
      {children}
    </span>
  )
}

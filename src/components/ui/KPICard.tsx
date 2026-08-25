import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: number
  change: number
  changeType: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: string
  prefix?: string
  suffix?: string
}

export default function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = 'blue',
  prefix,
  suffix,
}: KPICardProps) {
  const ChangeIcon = changeType === 'up' ? TrendingUp : changeType === 'down' ? TrendingDown : Minus
  const changeColor =
    changeType === 'up'
      ? 'text-[#2CBB5D]'
      : changeType === 'down'
      ? 'text-[#FF2D55]'
      : 'text-slate-400'

  const colorStyles: Record<string, { border: string; bg: string; text: string; cardBorder: string }> = {
    blue: { cardBorder: 'border-sky-500/30', border: 'border-sky-500/40', bg: 'bg-sky-500/15', text: 'text-sky-400' },
    primary: { cardBorder: 'border-blue-500/30', border: 'border-blue-500/40', bg: 'bg-blue-500/15', text: 'text-blue-400' },
    emerald: { cardBorder: 'border-emerald-500/30', border: 'border-emerald-500/40', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
    success: { cardBorder: 'border-emerald-500/30', border: 'border-emerald-500/40', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
    warning: { cardBorder: 'border-amber-500/30', border: 'border-amber-500/40', bg: 'bg-amber-500/15', text: 'text-amber-400' },
    amber: { cardBorder: 'border-amber-500/30', border: 'border-amber-500/40', bg: 'bg-amber-500/15', text: 'text-amber-400' },
    purple: { cardBorder: 'border-purple-500/30', border: 'border-purple-500/40', bg: 'bg-purple-500/15', text: 'text-purple-400' },
    indigo: { cardBorder: 'border-indigo-500/30', border: 'border-indigo-500/40', bg: 'bg-indigo-500/15', text: 'text-indigo-400' },
    teal: { cardBorder: 'border-teal-500/30', border: 'border-teal-500/40', bg: 'bg-teal-500/15', text: 'text-teal-400' },
    rose: { cardBorder: 'border-rose-500/30', border: 'border-rose-500/40', bg: 'bg-rose-500/15', text: 'text-rose-400' },
    cyan: { cardBorder: 'border-cyan-500/30', border: 'border-cyan-500/40', bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  }

  const themeStyle = colorStyles[color] || colorStyles.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-[#282828] p-5 shadow-lg transition-all duration-200',
        themeStyle.cardBorder
      )}
    >
      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              className="text-3xl font-extrabold tracking-tight text-white"
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
            <span className={cn('inline-flex items-center gap-1 font-mono font-bold', changeColor)}>
              <ChangeIcon className="h-3.5 w-3.5" />
              {Math.abs(change)}%
            </span>
            <span className="font-normal text-slate-400">vs last month</span>
          </div>
        </div>
        <div className={cn('rounded-xl border p-3 shadow-sm transition-transform group-hover:scale-105', themeStyle.bg, themeStyle.border, themeStyle.text)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}

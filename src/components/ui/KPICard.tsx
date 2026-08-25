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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-blue-500/30 bg-[#282828] p-5 shadow-lg hover:border-blue-400 transition-all duration-200"
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
        <div className="rounded-lg bg-blue-600 text-white border border-blue-400 p-3 shadow-md transition-all">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}

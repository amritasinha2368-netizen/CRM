import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import { cn } from '@/lib/utils'
import { MouseGlow } from './MouseGlow'

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

const colorMap: Record<string, {
  iconBg: string
  iconText: string
  glow: string
}> = {
  primary: { iconBg: 'bg-primary-50', iconText: 'text-primary-600', glow: 'rgba(156, 39, 176, 0.06)' },
  success: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', glow: 'rgba(16, 185, 129, 0.06)' },
  warning: { iconBg: 'bg-amber-50', iconText: 'text-amber-600', glow: 'rgba(245, 158, 11, 0.06)' },
  danger: { iconBg: 'bg-rose-50', iconText: 'text-rose-600', glow: 'rgba(239, 68, 68, 0.06)' },
  blue: { iconBg: 'bg-blue-50', iconText: 'text-blue-600', glow: 'rgba(59, 130, 246, 0.06)' },
}

export default function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = 'primary',
  prefix,
  suffix,
}: KPICardProps) {
  const colors = colorMap[color] || colorMap.primary
  const ChangeIcon = changeType === 'up' ? TrendingUp : changeType === 'down' ? TrendingDown : Minus
  const changeColor = changeType === 'up' ? 'text-emerald-600 bg-emerald-50' : changeType === 'down' ? 'text-rose-600 bg-rose-50' : 'text-surface-500 bg-surface-50'

  return (
    <MouseGlow color={colors.glow} size={300} opacity={0.8}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group relative overflow-hidden rounded-2xl border border-surface-200/60 bg-white p-5 shadow-sm hover:shadow-lg hover:shadow-surface-900/5 transition-all duration-300"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Corner accent */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-500/5 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 opacity-50" />

        <div className="relative flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                className="text-3xl font-extrabold tracking-tight text-surface-900"
              />
            </div>
            <div className={cn('mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', changeColor)}>
              <ChangeIcon className="h-3.5 w-3.5" />
              <span>{Math.abs(change)}%</span>
              <span className="font-medium text-surface-400">vs last month</span>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className={cn('rounded-2xl p-3 transition-all duration-300', colors.iconBg)}
          >
            <Icon className={cn('h-6 w-6', colors.iconText)} />
          </motion.div>
        </div>
      </motion.div>
    </MouseGlow>
  )
}

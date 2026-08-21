import * as TabsPrimitive from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Tab {
  value: string
  label: string
  icon?: LucideIcon
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onChange} className={className}>
      <TabsPrimitive.List className="flex gap-1 border-b border-surface-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = value === tab.value
          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'text-primary-600'
                  : 'text-surface-500 hover:text-surface-700',
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.count != null && (
                <span
                  className={cn(
                    'ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-surface-100 text-surface-500',
                  )}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}

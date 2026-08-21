import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  loading?: boolean
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data found',
  loading = false,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
  })

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set())
      onSelectionChange?.([])
    } else {
      const all = new Set(data.map((_, i) => i))
      setSelected(all)
      onSelectionChange?.(data)
    }
  }

  const toggleSelect = (index: number) => {
    const next = new Set(selected)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setSelected(next)
    onSelectionChange?.(data.filter((_, i) => next.has(i)))
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-surface-200">
        <div className="border-b border-surface-200 bg-surface-50 px-4 py-3">
          <div className="flex gap-4">
            {columns.map((col) => (
              <div key={col.key} className="h-4 animate-pulse rounded bg-surface-200" style={{ width: col.width || '100px' }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn('flex gap-4 px-4 py-3.5', i < 4 && 'border-b border-surface-100')}>
            {columns.map((col) => (
              <div key={col.key} className="h-4 animate-pulse rounded bg-surface-100" style={{ width: col.width || '100px' }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-surface-200 bg-surface-50">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === data.length && data.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500/20"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500',
                  col.sortable && 'cursor-pointer select-none hover:text-surface-700',
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && (
                    <span className="text-surface-400">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-10 w-10 text-surface-300" />
                    <p className="text-sm text-surface-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  className={cn(
                    'border-b border-surface-100 transition-colors duration-150 last:border-b-0',
                    i % 2 === 0 ? 'bg-white' : 'bg-surface-50/50',
                    onRowClick && 'cursor-pointer hover:bg-primary-50/50',
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => toggleSelect(i)}
                        className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500/20"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-surface-700">
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

import { cn } from '@/lib/utils'

type StatusType = 'lead' | 'application' | 'payment' | 'document' | 'followup'

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const statusConfig: Record<StatusType, Record<string, { label: string; bg: string; text: string; dot: string }>> = {
  lead: {
    new: { label: 'New', bg: 'bg-amber-950/60 border border-amber-500/40', text: 'text-amber-300', dot: 'bg-amber-400 animate-pulse' },
    assigned: { label: 'Assigned', bg: 'bg-blue-950/60 border border-blue-500/40', text: 'text-blue-300', dot: 'bg-blue-400' },
    contacted: { label: 'Contacted', bg: 'bg-cyan-950/60 border border-cyan-500/40', text: 'text-cyan-300', dot: 'bg-cyan-400' },
    interested: { label: 'Interested', bg: 'bg-yellow-950/60 border border-yellow-500/40', text: 'text-yellow-300', dot: 'bg-yellow-400' },
    counselling: { label: 'Counselling', bg: 'bg-indigo-950/60 border border-indigo-500/40', text: 'text-indigo-300', dot: 'bg-indigo-400' },
    visit: { label: 'Visit', bg: 'bg-teal-950/60 border border-teal-500/40', text: 'text-teal-300', dot: 'bg-teal-400' },
    application: { label: 'Application', bg: 'bg-amber-950/80 border border-amber-500/50', text: 'text-[#FBBF24]', dot: 'bg-[#FBBF24]' },
    documents: { label: 'Documents', bg: 'bg-orange-950/60 border border-orange-500/40', text: 'text-orange-300', dot: 'bg-orange-400' },
    payment: { label: 'Payment', bg: 'bg-emerald-950/60 border border-emerald-500/40', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    enrolled: { label: 'Enrolled', bg: 'bg-emerald-950/80 border border-emerald-500/60', text: 'text-emerald-300 font-extrabold', dot: 'bg-emerald-400' },
    lost: { label: 'Lost', bg: 'bg-rose-950/60 border border-rose-500/40', text: 'text-rose-300', dot: 'bg-rose-400' },
  },
  application: {
    draft: { label: 'Draft', bg: 'bg-slate-800 border border-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
    submitted: { label: 'Submitted', bg: 'bg-blue-950/60 border border-blue-500/40', text: 'text-blue-300', dot: 'bg-blue-400' },
    documents_pending: { label: 'Documents Pending', bg: 'bg-orange-950/60 border border-orange-500/40', text: 'text-orange-300', dot: 'bg-orange-400' },
    verified: { label: 'Verified', bg: 'bg-cyan-950/60 border border-cyan-500/40', text: 'text-cyan-300', dot: 'bg-cyan-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-950/60 border border-emerald-500/40', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    enrolled: { label: 'Enrolled', bg: 'bg-emerald-950/80 border border-emerald-500/60', text: 'text-emerald-300 font-extrabold', dot: 'bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-rose-950/60 border border-rose-500/40', text: 'text-rose-300', dot: 'bg-rose-400' },
  },
  payment: {
    paid: { label: 'Paid', bg: 'bg-emerald-950/80 border border-emerald-500/60', text: 'text-emerald-300 font-extrabold', dot: 'bg-emerald-400' },
    partial: { label: 'Partial', bg: 'bg-amber-950/60 border border-amber-500/40', text: 'text-amber-300', dot: 'bg-amber-400' },
    pending: { label: 'Pending', bg: 'bg-orange-950/60 border border-orange-500/40', text: 'text-orange-300', dot: 'bg-orange-400' },
    overdue: { label: 'Overdue', bg: 'bg-rose-950/80 border border-rose-500/60', text: 'text-rose-300 font-extrabold', dot: 'bg-rose-400' },
  },
  document: {
    pending: { label: 'Pending', bg: 'bg-amber-950/60 border border-amber-500/40', text: 'text-amber-300', dot: 'bg-amber-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-950/80 border border-emerald-500/60', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-rose-950/60 border border-rose-500/40', text: 'text-rose-300', dot: 'bg-rose-400' },
    missing: { label: 'Missing', bg: 'bg-slate-800 border border-slate-700', text: 'text-slate-400', dot: 'bg-slate-500' },
  },
  followup: {
    pending: { label: 'Pending', bg: 'bg-blue-950/60 border border-blue-500/40', text: 'text-blue-300', dot: 'bg-blue-400' },
    completed: { label: 'Completed', bg: 'bg-emerald-950/80 border border-emerald-500/60', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    overdue: { label: 'Overdue', bg: 'bg-rose-950/80 border border-rose-500/60', text: 'text-rose-300', dot: 'bg-rose-400' },
    snoozed: { label: 'Snoozed', bg: 'bg-slate-800 border border-slate-700', text: 'text-slate-400', dot: 'bg-slate-500' },
  },
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config = statusConfig[type]?.[status]
  if (!config) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-bold text-slate-300', className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {status}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-extrabold backdrop-blur-xs shadow-xs',
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  )
}

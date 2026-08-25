import { cn } from '@/lib/utils'

type StatusType = 'lead' | 'application' | 'payment' | 'document' | 'followup'

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const statusConfig: Record<StatusType, Record<string, { label: string; bg: string; text: string; dot: string }>> = {
  lead: {
    new: { label: 'New Lead', bg: 'bg-sky-500/15 border border-sky-500/30', text: 'text-sky-300', dot: 'bg-sky-400 animate-pulse' },
    assigned: { label: 'Assigned Counsellor', bg: 'bg-blue-500/15 border border-blue-500/30', text: 'text-blue-300', dot: 'bg-blue-400' },
    contacted: { label: 'Contacted Lead', bg: 'bg-cyan-500/15 border border-cyan-500/30', text: 'text-cyan-300', dot: 'bg-cyan-400' },
    interested: { label: 'Interested Student', bg: 'bg-emerald-500/15 border border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    counselling: { label: 'Counselling Session', bg: 'bg-purple-500/15 border border-purple-500/30', text: 'text-purple-300', dot: 'bg-purple-400' },
    visit: { label: 'Visited Campus / Portal', bg: 'bg-indigo-500/15 border border-indigo-500/30', text: 'text-indigo-300', dot: 'bg-indigo-400' },
    application: { label: 'Application Submitted', bg: 'bg-teal-500/15 border border-teal-500/30', text: 'text-teal-300', dot: 'bg-teal-400' },
    documents: { label: 'Documents Verified', bg: 'bg-violet-500/15 border border-violet-500/30', text: 'text-violet-300', dot: 'bg-violet-400' },
    payment: { label: 'Payment Pending', bg: 'bg-amber-500/15 border border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-400' },
    enrolled: { label: 'Student Enrolled', bg: 'bg-emerald-500/20 border border-emerald-500/40', text: 'text-emerald-300 font-extrabold', dot: 'bg-emerald-400' },
    lost: { label: 'Lead Closed / Lost', bg: 'bg-rose-500/15 border border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-400' },
  },
  application: {
    draft: { label: 'Draft', bg: 'bg-[#303030] border border-[#3E3E3E]', text: 'text-slate-400', dot: 'bg-slate-400' },
    submitted: { label: 'Submitted', bg: 'bg-cyan-500/15 border border-cyan-500/30', text: 'text-cyan-300', dot: 'bg-cyan-400' },
    documents_pending: { label: 'Documents Pending', bg: 'bg-amber-500/15 border border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-400' },
    verified: { label: 'Verified', bg: 'bg-indigo-500/15 border border-indigo-500/30', text: 'text-indigo-300', dot: 'bg-indigo-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-500/15 border border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    enrolled: { label: 'Enrolled', bg: 'bg-emerald-500/20 border border-emerald-500/40', text: 'text-emerald-300 font-extrabold', dot: 'bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-rose-500/15 border border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-400' },
  },
  payment: {
    paid: { label: 'Paid', bg: 'bg-emerald-500/20 border border-emerald-500/40', text: 'text-emerald-300 font-extrabold', dot: 'bg-emerald-400' },
    partial: { label: 'Partial', bg: 'bg-amber-500/15 border border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-400' },
    pending: { label: 'Pending', bg: 'bg-sky-500/15 border border-sky-500/30', text: 'text-sky-300', dot: 'bg-sky-400' },
    overdue: { label: 'Overdue', bg: 'bg-rose-500/20 border border-rose-500/40', text: 'text-rose-300 font-extrabold', dot: 'bg-rose-400' },
  },
  document: {
    pending: { label: 'Pending', bg: 'bg-amber-500/15 border border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-500/15 border border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-rose-500/15 border border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-400' },
    missing: { label: 'Missing', bg: 'bg-[#303030] border border-[#3E3E3E]', text: 'text-slate-400', dot: 'bg-slate-400' },
  },
  followup: {
    pending: { label: 'Pending', bg: 'bg-sky-500/15 border border-sky-500/30', text: 'text-sky-300', dot: 'bg-sky-400' },
    completed: { label: 'Completed', bg: 'bg-emerald-500/15 border border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    overdue: { label: 'Overdue', bg: 'bg-rose-500/15 border border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-400' },
    snoozed: { label: 'Snoozed', bg: 'bg-[#303030] border border-[#3E3E3E]', text: 'text-slate-400', dot: 'bg-slate-400' },
  },
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config = statusConfig[type]?.[status]
  if (!config) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-[#303030] border border-[#3E3E3E] px-2.5 py-0.5 text-xs font-bold text-slate-300', className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {status}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-bold',
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

import { cn } from '@/lib/utils'

type StatusType = 'lead' | 'application' | 'payment' | 'document' | 'followup'

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const statusConfig: Record<StatusType, Record<string, { label: string; bg: string; text: string; dot: string }>> = {
  lead: {
    new: { label: 'New Lead', bg: 'bg-sky-100 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30', text: 'text-sky-950 dark:text-sky-300 font-extrabold', dot: 'bg-sky-600 dark:bg-sky-400 animate-pulse' },
    assigned: { label: 'Assigned Counsellor', bg: 'bg-blue-100 dark:bg-blue-500/15 border border-blue-300 dark:border-blue-500/30', text: 'text-blue-950 dark:text-blue-300 font-extrabold', dot: 'bg-blue-600 dark:bg-blue-400' },
    contacted: { label: 'Contacted Lead', bg: 'bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30', text: 'text-cyan-950 dark:text-cyan-300 font-extrabold', dot: 'bg-cyan-600 dark:bg-cyan-400' },
    interested: { label: 'Interested Student', bg: 'bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30', text: 'text-emerald-950 dark:text-emerald-300 font-extrabold', dot: 'bg-emerald-600 dark:bg-emerald-400' },
    counselling: { label: 'Counselling Session', bg: 'bg-purple-100 dark:bg-purple-500/15 border border-purple-300 dark:border-purple-500/30', text: 'text-purple-950 dark:text-purple-300 font-extrabold', dot: 'bg-purple-600 dark:bg-purple-400' },
    visit: { label: 'Visited Campus / Portal', bg: 'bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-300 dark:border-indigo-500/30', text: 'text-indigo-950 dark:text-indigo-300 font-extrabold', dot: 'bg-indigo-600 dark:bg-indigo-400' },
    application: { label: 'Application Submitted', bg: 'bg-teal-100 dark:bg-teal-500/15 border border-teal-300 dark:border-teal-500/30', text: 'text-teal-950 dark:text-teal-300 font-extrabold', dot: 'bg-teal-600 dark:bg-teal-400' },
    documents: { label: 'Documents Verified', bg: 'bg-violet-100 dark:bg-violet-500/15 border border-violet-300 dark:border-violet-500/30', text: 'text-violet-950 dark:text-violet-300 font-extrabold', dot: 'bg-violet-600 dark:bg-violet-400' },
    payment: { label: 'Payment Pending', bg: 'bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30', text: 'text-amber-950 dark:text-amber-300 font-extrabold', dot: 'bg-amber-600 dark:bg-amber-400' },
    enrolled: { label: 'Student Enrolled', bg: 'bg-emerald-200/80 dark:bg-emerald-500/20 border border-emerald-400 dark:border-emerald-500/40', text: 'text-emerald-950 dark:text-emerald-300 font-black', dot: 'bg-emerald-700 dark:bg-emerald-400' },
    lost: { label: 'Lead Closed / Lost', bg: 'bg-rose-100 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30', text: 'text-rose-950 dark:text-rose-300 font-extrabold', dot: 'bg-rose-600 dark:bg-rose-400' },
  },
  application: {
    draft: { label: 'Draft', bg: 'bg-slate-100 dark:bg-[#303030] border border-slate-300 dark:border-[#3E3E3E]', text: 'text-slate-900 dark:text-slate-400 font-bold', dot: 'bg-slate-600 dark:bg-slate-400' },
    submitted: { label: 'Submitted', bg: 'bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30', text: 'text-cyan-950 dark:text-cyan-300 font-extrabold', dot: 'bg-cyan-600 dark:bg-cyan-400' },
    documents_pending: { label: 'Documents Pending', bg: 'bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30', text: 'text-amber-950 dark:text-amber-300 font-extrabold', dot: 'bg-amber-600 dark:bg-amber-400' },
    verified: { label: 'Verified', bg: 'bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-300 dark:border-indigo-500/30', text: 'text-indigo-950 dark:text-indigo-300 font-extrabold', dot: 'bg-indigo-600 dark:bg-indigo-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30', text: 'text-emerald-950 dark:text-emerald-300 font-extrabold', dot: 'bg-emerald-600 dark:bg-emerald-400' },
    enrolled: { label: 'Enrolled', bg: 'bg-emerald-200/80 dark:bg-emerald-500/20 border border-emerald-400 dark:border-emerald-500/40', text: 'text-emerald-950 dark:text-emerald-300 font-black', dot: 'bg-emerald-700 dark:bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-rose-100 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30', text: 'text-rose-950 dark:text-rose-300 font-extrabold', dot: 'bg-rose-600 dark:bg-rose-400' },
  },
  payment: {
    paid: { label: 'Paid', bg: 'bg-emerald-200/80 dark:bg-emerald-500/20 border border-emerald-400 dark:border-emerald-500/40', text: 'text-emerald-950 dark:text-emerald-300 font-black', dot: 'bg-emerald-700 dark:bg-emerald-400' },
    partial: { label: 'Partial', bg: 'bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30', text: 'text-amber-950 dark:text-amber-300 font-extrabold', dot: 'bg-amber-600 dark:bg-amber-400' },
    pending: { label: 'Pending', bg: 'bg-sky-100 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30', text: 'text-sky-950 dark:text-sky-300 font-extrabold', dot: 'bg-sky-600 dark:bg-sky-400' },
    overdue: { label: 'Overdue', bg: 'bg-rose-200/80 dark:bg-rose-500/20 border border-rose-400 dark:border-rose-500/40', text: 'text-rose-950 dark:text-rose-300 font-black', dot: 'bg-rose-700 dark:bg-rose-400' },
  },
  document: {
    pending: { label: 'Pending', bg: 'bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30', text: 'text-amber-950 dark:text-amber-300 font-extrabold', dot: 'bg-amber-600 dark:bg-amber-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30', text: 'text-emerald-950 dark:text-emerald-300 font-extrabold', dot: 'bg-emerald-600 dark:bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-rose-100 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30', text: 'text-rose-950 dark:text-rose-300 font-extrabold', dot: 'bg-rose-600 dark:bg-rose-400' },
    missing: { label: 'Missing', bg: 'bg-slate-100 dark:bg-[#303030] border border-slate-300 dark:border-[#3E3E3E]', text: 'text-slate-900 dark:text-slate-400 font-bold', dot: 'bg-slate-600 dark:bg-slate-400' },
  },
  followup: {
    pending: { label: 'Pending', bg: 'bg-sky-100 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30', text: 'text-sky-950 dark:text-sky-300 font-extrabold', dot: 'bg-sky-600 dark:bg-sky-400' },
    completed: { label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30', text: 'text-emerald-950 dark:text-emerald-300 font-extrabold', dot: 'bg-emerald-600 dark:bg-emerald-400' },
    overdue: { label: 'Overdue', bg: 'bg-rose-100 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30', text: 'text-rose-950 dark:text-rose-300 font-extrabold', dot: 'bg-rose-600 dark:bg-rose-400' },
    snoozed: { label: 'Snoozed', bg: 'bg-slate-100 dark:bg-[#303030] border border-slate-300 dark:border-[#3E3E3E]', text: 'text-slate-900 dark:text-slate-400 font-bold', dot: 'bg-slate-600 dark:bg-slate-400' },
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

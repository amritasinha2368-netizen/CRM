import { cn } from '@/lib/utils'

type StatusType = 'lead' | 'application' | 'payment' | 'document' | 'followup'

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const statusConfig: Record<StatusType, Record<string, { label: string; bg: string; text: string; dot: string }>> = {
  lead: {
    new: { label: 'New', bg: 'bg-[#3A2E12] border border-[#FFA116]/40', text: 'text-[#FFA116]', dot: 'bg-[#FFA116] animate-pulse' },
    assigned: { label: 'Assigned', bg: 'bg-[#1E293B] border border-[#007AFF]/40', text: 'text-[#38BDF8]', dot: 'bg-[#38BDF8]' },
    contacted: { label: 'Contacted', bg: 'bg-[#1E293B] border border-[#007AFF]/40', text: 'text-[#38BDF8]', dot: 'bg-[#38BDF8]' },
    interested: { label: 'Interested', bg: 'bg-[#132E1F] border border-[#2CBB5D]/40', text: 'text-[#2CBB5D]', dot: 'bg-[#2CBB5D]' },
    counselling: { label: 'Counselling', bg: 'bg-[#3A2E12] border border-[#FFB800]/40', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    visit: { label: 'Visit', bg: 'bg-[#1E293B] border border-[#007AFF]/40', text: 'text-[#38BDF8]', dot: 'bg-[#38BDF8]' },
    application: { label: 'Application', bg: 'bg-[#3A2E12] border border-[#FFA116]/40', text: 'text-[#FFA116]', dot: 'bg-[#FFA116]' },
    documents: { label: 'Documents', bg: 'bg-[#3A2E12] border border-[#FFB800]/40', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    payment: { label: 'Payment', bg: 'bg-[#132E1F] border border-[#2CBB5D]/40', text: 'text-[#2CBB5D]', dot: 'bg-[#2CBB5D]' },
    enrolled: { label: 'Enrolled', bg: 'bg-[#132E1F] border border-[#2CBB5D]/60', text: 'text-[#2CBB5D] font-extrabold', dot: 'bg-[#2CBB5D]' },
    lost: { label: 'Lost', bg: 'bg-[#3B181A] border border-[#FF2D55]/40', text: 'text-[#FF2D55]', dot: 'bg-[#FF2D55]' },
  },
  application: {
    draft: { label: 'Draft', bg: 'bg-[#303030] border border-[#3E3E3E]', text: 'text-slate-400', dot: 'bg-slate-400' },
    submitted: { label: 'Submitted', bg: 'bg-[#1E293B] border border-[#007AFF]/40', text: 'text-[#38BDF8]', dot: 'bg-[#38BDF8]' },
    documents_pending: { label: 'Documents Pending', bg: 'bg-[#3A2E12] border border-[#FFB800]/40', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    verified: { label: 'Verified', bg: 'bg-[#1E293B] border border-[#007AFF]/40', text: 'text-[#38BDF8]', dot: 'bg-[#38BDF8]' },
    approved: { label: 'Approved', bg: 'bg-[#132E1F] border border-[#2CBB5D]/40', text: 'text-[#2CBB5D]', dot: 'bg-[#2CBB5D]' },
    enrolled: { label: 'Enrolled', bg: 'bg-[#132E1F] border border-[#2CBB5D]/60', text: 'text-[#2CBB5D] font-extrabold', dot: 'bg-[#2CBB5D]' },
    rejected: { label: 'Rejected', bg: 'bg-[#3B181A] border border-[#FF2D55]/40', text: 'text-[#FF2D55]', dot: 'bg-[#FF2D55]' },
  },
  payment: {
    paid: { label: 'Paid', bg: 'bg-[#132E1F] border border-[#2CBB5D]/60', text: 'text-[#2CBB5D] font-extrabold', dot: 'bg-[#2CBB5D]' },
    partial: { label: 'Partial', bg: 'bg-[#3A2E12] border border-[#FFB800]/40', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    pending: { label: 'Pending', bg: 'bg-[#3A2E12] border border-[#FFA116]/40', text: 'text-[#FFA116]', dot: 'bg-[#FFA116]' },
    overdue: { label: 'Overdue', bg: 'bg-[#3B181A] border border-[#FF2D55]/60', text: 'text-[#FF2D55] font-extrabold', dot: 'bg-[#FF2D55]' },
  },
  document: {
    pending: { label: 'Pending', bg: 'bg-[#3A2E12] border border-[#FFB800]/40', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    approved: { label: 'Approved', bg: 'bg-[#132E1F] border border-[#2CBB5D]/60', text: 'text-[#2CBB5D]', dot: 'bg-[#2CBB5D]' },
    rejected: { label: 'Rejected', bg: 'bg-[#3B181A] border border-[#FF2D55]/40', text: 'text-[#FF2D55]', dot: 'bg-[#FF2D55]' },
    missing: { label: 'Missing', bg: 'bg-[#303030] border border-[#3E3E3E]', text: 'text-slate-400', dot: 'bg-slate-400' },
  },
  followup: {
    pending: { label: 'Pending', bg: 'bg-[#1E293B] border border-[#007AFF]/40', text: 'text-[#38BDF8]', dot: 'bg-[#38BDF8]' },
    completed: { label: 'Completed', bg: 'bg-[#132E1F] border border-[#2CBB5D]/60', text: 'text-[#2CBB5D]', dot: 'bg-[#2CBB5D]' },
    overdue: { label: 'Overdue', bg: 'bg-[#3B181A] border border-[#FF2D55]/60', text: 'text-[#FF2D55]', dot: 'bg-[#FF2D55]' },
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

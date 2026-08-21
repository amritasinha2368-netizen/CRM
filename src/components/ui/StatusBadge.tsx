import { cn } from '@/lib/utils'

type StatusType = 'lead' | 'application' | 'payment' | 'document' | 'followup'

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const statusConfig: Record<StatusType, Record<string, { label: string; bg: string; text: string; dot: string }>> = {
  lead: {
    new: { label: 'New', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    assigned: { label: 'Assigned', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    contacted: { label: 'Contacted', bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
    interested: { label: 'Interested', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    counselling: { label: 'Counselling', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    visit: { label: 'Visit', bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
    application: { label: 'Application', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    documents: { label: 'Documents', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    payment: { label: 'Payment', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    enrolled: { label: 'Enrolled', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    lost: { label: 'Lost', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  },
  application: {
    draft: { label: 'Draft', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
    submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    documents_pending: { label: 'Documents Pending', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    verified: { label: 'Verified', bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
    approved: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    enrolled: { label: 'Enrolled', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  },
  payment: {
    paid: { label: 'Paid', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    partial: { label: 'Partial', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    pending: { label: 'Pending', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    overdue: { label: 'Overdue', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  },
  document: {
    pending: { label: 'Pending', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    approved: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    missing: { label: 'Missing', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  },
  followup: {
    pending: { label: 'Pending', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    completed: { label: 'Completed', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    overdue: { label: 'Overdue', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    snoozed: { label: 'Snoozed', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  },
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config = statusConfig[type]?.[status]
  if (!config) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600', className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        {status}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

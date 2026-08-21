import { useState, useMemo } from 'react'
import {
  ArrowLeft, Phone, MessageCircle, Mail, Pencil, MapPin, GraduationCap, Calendar, Tag,
  PhoneCall, PhoneIncoming, PhoneOutgoing, MessageSquare, FileText, FolderOpen, CreditCard,
  ArrowRight, UserPlus, Clock, ChevronDown, ChevronUp, Upload, ExternalLink, CheckCircle2,
  AlertCircle, XCircle, TrendingUp, Star,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn, formatDate, formatDateTime, formatCurrency, getRelativeTime, getInitials, formatTime } from '@/lib/utils'
import { useAppStore } from '@/store'
import { leads, courses, batches, users, calls, activities, documents, applications, payments } from '@/data/mockData'
import StatusBadge from '@/components/ui/StatusBadge'
import Badge from '@/components/ui/Badge'
import Tabs from '@/components/ui/Tabs'
import type { LeadStatus, Activity as ActivityType, AISummary } from '@/types'

const activityIcons: Record<ActivityType['type'], { icon: typeof Phone; color: string; bg: string }> = {
  call: { icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-100' },
  whatsapp: { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100' },
  sms: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  email: { icon: Mail, color: 'text-orange-600', bg: 'bg-orange-100' },
  note: { icon: FileText, color: 'text-surface-600', bg: 'bg-surface-100' },
  follow_up: { icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100' },
  document: { icon: FolderOpen, color: 'text-teal-600', bg: 'bg-teal-100' },
  payment: { icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
  status_change: { icon: ArrowRight, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  assignment: { icon: UserPlus, color: 'text-primary-600', bg: 'bg-primary-100' },
}

const applicationStatusSteps = [
  { key: 'draft', label: 'Draft' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'documents_pending', label: 'Docs Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'approved', label: 'Approved' },
  { key: 'enrolled', label: 'Enrolled' },
]

const sentimentColors = {
  positive: 'text-success-600 bg-success-50',
  neutral: 'text-surface-600 bg-surface-100',
  negative: 'text-danger-600 bg-danger-50',
}

const interestColors = {
  high: 'text-success-600 bg-success-50',
  medium: 'text-warning-600 bg-warning-50',
  low: 'text-danger-600 bg-danger-50',
}

const docTypeIcons: Record<string, string> = {
  'Photo': '📷',
  'ID Proof': '🪪',
  'Marksheets': '📄',
  'Certificate': '🎓',
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-success-600'
  if (score >= 60) return 'text-primary-600'
  if (score >= 40) return 'text-warning-600'
  return 'text-danger-600'
}

function getScoreBg(score: number) {
  if (score >= 80) return 'stroke-success-500'
  if (score >= 60) return 'stroke-primary-500'
  if (score >= 40) return 'stroke-warning-500'
  return 'stroke-danger-500'
}

export default function LeadProfile() {
  const navigate = useNavigate()
  const { leadId } = useParams<{ leadId: string }>()
  const { leads: storeLeads } = useAppStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [noteText, setNoteText] = useState('')
  const [expandedAiCalls, setExpandedAiCalls] = useState<Set<string>>(new Set())
  const [docTypeFilter, setDocTypeFilter] = useState('')
  const [docStatusFilter, setDocStatusFilter] = useState('')

  const allLeads = storeLeads.length > 0 ? storeLeads : leads
  const lead = allLeads.find((l) => l.id === leadId)

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className="mb-4 h-12 w-12 text-surface-300" />
        <h2 className="text-lg font-semibold text-surface-900">Lead not found</h2>
        <p className="mt-1 text-sm text-surface-500">The lead you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/leads')}
          className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Back to Leads
        </button>
      </div>
    )
  }

  const course = courses.find((c) => c.id === lead.courseId)
  const batch = batches.find((b) => b.id === lead.batchId)
  const assignedUser = users.find((u) => u.id === lead.assignedTo)
  const leadCalls = calls.filter((c) => c.leadId === lead.id)
  const leadActivities = activities.filter((a) => a.leadId === lead.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const leadDocuments = documents.filter((d) => d.leadId === lead.id)
  const leadApplication = applications.find((a) => a.leadId === lead.id)
  const leadPayment = payments.find((p) => p.leadId === lead.id)

  const filteredDocs = useMemo(() => {
    let result = leadDocuments
    if (docTypeFilter) result = result.filter((d) => d.type === docTypeFilter)
    if (docStatusFilter) result = result.filter((d) => d.status === docStatusFilter)
    return result
  }, [leadDocuments, docTypeFilter, docStatusFilter])

  const docTypes = [...new Set(leadDocuments.map((d) => d.type))]

  const toggleAiCall = (callId: string) => {
    setExpandedAiCalls((prev) => {
      const next = new Set(prev)
      if (next.has(callId)) next.delete(callId)
      else next.add(callId)
      return next
    })
  }

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity', count: leadActivities.length },
    { value: 'calls', label: 'Calls', count: leadCalls.length },
    { value: 'documents', label: 'Documents', count: leadDocuments.length },
    { value: 'application', label: 'Application' },
    { value: 'payments', label: 'Payments' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/leads')}
            className="mt-1 rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-surface-900">{lead.name}</h1>
              <StatusBadge status={lead.status} type="lead" />
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-surface-500">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{lead.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.city}</span>
            </div>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-500">Score:</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-surface-100">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        lead.leadScore >= 80 ? 'bg-success-500' : lead.leadScore >= 60 ? 'bg-primary-500' : lead.leadScore >= 40 ? 'bg-warning-500' : 'bg-danger-500',
                      )}
                      style={{ width: `${lead.leadScore}%` }}
                    />
                  </div>
                  <span className={cn('text-xs font-semibold', getScoreColor(lead.leadScore))}>{lead.leadScore}</span>
                </div>
              </div>
              {assignedUser && (
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[9px] font-bold text-primary-700">
                    {getInitials(assignedUser.name)}
                  </div>
                  <span className="text-xs text-surface-600">{assignedUser.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`tel:${lead.phone}`)}
            className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3.5 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
          >
            <Phone className="h-4 w-4" /> Call
          </button>
          <button
            onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\s/g, '')}`)}
            className="flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-3.5 py-2 text-sm font-medium text-success-700 transition-colors hover:bg-success-100"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button
            onClick={() => toast.success('Email compose')}
            className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3.5 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
          >
            <Mail className="h-4 w-4" /> Email
          </button>
          <button
            onClick={() => toast.success('Edit lead')}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        </div>
      </div>

      <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab lead={lead} course={course} batch={batch} assignedUser={assignedUser} />
          )}
          {activeTab === 'activity' && (
            <ActivityTab activities={leadActivities} noteText={noteText} setNoteText={setNoteText} />
          )}
          {activeTab === 'calls' && (
            <CallsTab calls={leadCalls} expandedAiCalls={expandedAiCalls} toggleAiCall={toggleAiCall} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab
              documents={filteredDocs}
              docTypeFilter={docTypeFilter}
              setDocTypeFilter={setDocTypeFilter}
              docStatusFilter={docStatusFilter}
              setDocStatusFilter={setDocStatusFilter}
              docTypes={docTypes}
            />
          )}
          {activeTab === 'application' && (
            <ApplicationTab lead={lead} application={leadApplication} course={course} batch={batch} />
          )}
          {activeTab === 'payments' && (
            <PaymentsTab payment={leadPayment} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
function OverviewTab({ lead, course, batch, assignedUser }: { lead: any; course: any; batch: any; assignedUser: any }) {
  const statusTimeline: LeadStatus[] = ['new', 'assigned', 'contacted', 'interested', 'counselling', 'visit', 'application', 'documents', 'payment', 'enrolled']
  const currentIdx = statusTimeline.indexOf(lead.status)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-900">Contact Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow icon={Phone} label="Phone" value={lead.phone} />
            {lead.alternatePhone && <DetailRow icon={Phone} label="Alt. Phone" value={lead.alternatePhone} />}
            <DetailRow icon={Mail} label="Email" value={lead.email} />
            <DetailRow icon={MapPin} label="City" value={lead.city} />
            {lead.address && <DetailRow icon={MapPin} label="Address" value={lead.address} />}
            <DetailRow icon={GraduationCap} label="Qualification" value={lead.qualification} />
          </div>
        </div>

        <div className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-900">Course Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow icon={GraduationCap} label="Course" value={course?.name || '-'} />
            <DetailRow icon={MapPin} label="Center" value={lead.centerId} />
            {batch && <DetailRow icon={Calendar} label="Batch" value={batch.name} />}
            <DetailRow icon={Tag} label="Source" value={lead.source.replace('_', ' ')} />
            {lead.assignedTo && <DetailRow icon={UserPlus} label="Assigned To" value={assignedUser?.name || '-'} />}
          </div>
        </div>

        {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
          <div className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-surface-900">UTM Parameters</h3>
            <div className="grid grid-cols-3 gap-4">
              {lead.utmSource && <DetailRow label="Source" value={lead.utmSource} />}
              {lead.utmMedium && <DetailRow label="Medium" value={lead.utmMedium} />}
              {lead.utmCampaign && <DetailRow label="Campaign" value={lead.utmCampaign} />}
            </div>
          </div>
        )}

        {lead.message && (
          <div className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="mb-2 text-sm font-semibold text-surface-900">Enquiry Message</h3>
            <p className="text-sm text-surface-600">{lead.message}</p>
          </div>
        )}

        {lead.tags && lead.tags.length > 0 && (
          <div className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-surface-900">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag: string) => (
                <Badge key={tag} variant="primary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-surface-200 bg-white p-5 text-center">
          <h3 className="mb-4 text-sm font-semibold text-surface-900">Lead Score</h3>
          <div className="relative mx-auto h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-100" />
              <circle
                cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                strokeDasharray={`${(lead.leadScore / 100) * 327} 327`}
                strokeLinecap="round"
                className={cn('transition-all duration-700', getScoreBg(lead.leadScore))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-2xl font-bold', getScoreColor(lead.leadScore))}>{lead.leadScore}</span>
              <span className="text-[10px] text-surface-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-900">Status Progression</h3>
          <div className="space-y-0">
            {statusTimeline.map((status, idx) => {
              const isPast = idx < currentIdx
              const isCurrent = idx === currentIdx
              return (
                <div key={status} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                        isPast ? 'bg-primary-600 text-white' :
                        isCurrent ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500/30' :
                        'bg-surface-100 text-surface-400',
                      )}
                    >
                      {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    {idx < statusTimeline.length - 1 && (
                      <div className={cn('w-0.5 h-6', isPast ? 'bg-primary-400' : 'bg-surface-200')} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={cn('text-xs font-medium capitalize', isCurrent ? 'text-primary-700' : isPast ? 'text-surface-600' : 'text-surface-400')}>
                      {status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon?: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-surface-400" />}
      <div>
        <p className="text-[11px] font-medium text-surface-400">{label}</p>
        <p className="text-sm text-surface-700">{value}</p>
      </div>
    </div>
  )
}
function ActivityTab({ activities, noteText, setNoteText }: { activities: ActivityType[]; noteText: string; setNoteText: (v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-surface-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-100">
            <FileText className="h-4 w-4 text-surface-400" />
          </div>
          <div className="flex-1">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm placeholder:text-surface-400 focus:border-primary-300 focus:bg-white focus:outline-none resize-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    toast.success('Note added')
                    setNoteText('')
                  }
                }}
                disabled={!noteText.trim()}
                className={cn(
                  'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                  noteText.trim()
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-surface-100 text-surface-400 cursor-not-allowed',
                )}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative ml-4">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-surface-200" />
        <div className="space-y-6">
          {activities.map((activity, i) => {
            const config = activityIcons[activity.type]
            const Icon = config.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.4) }}
                className="relative flex items-start gap-4 pl-6"
              >
                <div className={cn('absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white', config.bg)}>
                  <Icon className={cn('h-3 w-3', config.color)} />
                </div>
                <div className="flex-1 rounded-lg border border-surface-100 bg-white p-3 shadow-sm">
                  <p className="text-sm text-surface-700">{activity.description}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-surface-400">
                    <span>{formatDateTime(activity.timestamp)}</span>
                    <span>{users.find((u) => u.id === activity.userId)?.name || 'System'}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
          {activities.length === 0 && (
            <div className="py-8 text-center text-sm text-surface-400">No activities recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
function CallsTab({ calls: leadCalls, expandedAiCalls, toggleAiCall }: { calls: any[]; expandedAiCalls: Set<string>; toggleAiCall: (id: string) => void }) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m + 'm ' + s + 's'
  }

  return (
    <div className="space-y-4">
      {leadCalls.length === 0 ? (
        <div className="rounded-xl border border-surface-200 bg-white py-12 text-center">
          <Phone className="mx-auto mb-3 h-10 w-10 text-surface-300" />
          <p className="text-sm text-surface-500">No calls recorded for this lead.</p>
        </div>
      ) : (
        leadCalls.map((call, i) => {
          const counsellor = users.find((u) => u.id === call.counsellorId)
          const isAiExpanded = expandedAiCalls.has(call.id)
          return (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.3) }}
              className="rounded-xl border border-surface-200 bg-white"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    call.direction === 'inbound' ? 'bg-blue-100' : 'bg-primary-100',
                  )}>
                    {call.direction === 'inbound'
                      ? <PhoneIncoming className="h-4 w-4 text-blue-600" />
                      : <PhoneOutgoing className="h-4 w-4 text-primary-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-surface-900">
                        {call.direction === 'inbound' ? 'Inbound' : 'Outbound'} Call
                      </span>
                      <Badge variant={call.disposition === 'Connected' ? 'success' : call.disposition === 'Not Interested' ? 'danger' : 'warning'}>
                        {call.disposition}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.duration)}
                      </span>
                      <span>{formatDateTime(call.startTime)}</span>
                      {counsellor && <span>by {counsellor.name}</span>}
                    </div>
                    {call.notes && (
                      <p className="mt-2 text-sm text-surface-600">{call.notes}</p>
                    )}
                  </div>
                </div>

                {call.aiSummary && (
                  <div className="mt-3 border-t border-surface-100 pt-3">
                    <button
                      onClick={() => toggleAiCall(call.id)}
                      className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      <Star className="h-4 w-4" />
                      AI Call Intelligence
                      {isAiExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>

              {call.aiSummary && (
                <AnimatePresence>
                  {isAiExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <AiCallIntelligence summary={call.aiSummary} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          )
        })
      )}
    </div>
  )
}
function AiCallIntelligence({ summary }: { summary: AISummary }) {
  const scoreLabels: Record<string, string> = {
    greeting: 'Greeting',
    discovery: 'Discovery',
    courseExplanation: 'Course Explanation',
    objectionHandling: 'Objection Handling',
    accuracy: 'Accuracy',
    closing: 'Closing',
  }

  const scoreColors: Record<string, string> = {
    greeting: 'bg-blue-500',
    discovery: 'bg-indigo-500',
    courseExplanation: 'bg-primary-500',
    objectionHandling: 'bg-amber-500',
    accuracy: 'bg-success-500',
    closing: 'bg-green-500',
  }

  const overallScore = summary.callScore.overall

  return (
    <div className="border-t border-surface-100 bg-surface-50/50 p-4 space-y-5">
      {/* Transcript */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-surface-700">Transcript</h4>
        <div className="max-h-40 overflow-y-auto rounded-lg border border-surface-200 bg-white p-3 text-xs leading-relaxed text-surface-600 whitespace-pre-wrap">
          {summary.transcript}
        </div>
      </div>

      {/* Summary */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-surface-700">AI Summary</h4>
        <p className="rounded-lg border border-surface-200 bg-white p-3 text-sm text-surface-700">{summary.summary}</p>
      </div>

      {/* Sentiment & Interest */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-surface-200 bg-white p-3">
          <p className="mb-1 text-[11px] font-medium text-surface-500">Sentiment</p>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', sentimentColors[summary.sentiment])}>
            {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
          </span>
        </div>
        <div className="rounded-lg border border-surface-200 bg-white p-3">
          <p className="mb-1 text-[11px] font-medium text-surface-500">Interest Level</p>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', interestColors[summary.interestLevel])}>
            {summary.interestLevel.charAt(0).toUpperCase() + summary.interestLevel.slice(1)}
          </span>
        </div>
      </div>

      {/* Objections */}
      {summary.objections.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold text-surface-700">Objections</h4>
          <div className="space-y-1.5">
            {summary.objections.map((obj, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-warning-600" />
                <span className="text-xs text-warning-700">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Best Action */}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
        <p className="mb-1 text-[11px] font-medium text-primary-600">Next Best Action</p>
        <p className="text-sm text-primary-700">{summary.nextBestAction}</p>
      </div>

      {/* Call Score Breakdown */}
      <div>
        <h4 className="mb-3 text-xs font-semibold text-surface-700">Call Score Breakdown</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(summary.callScore).filter(([k]) => k !== 'overall').map(([key, score]) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] text-surface-600">{scoreLabels[key] || key}</span>
                <span className="text-[11px] font-semibold text-surface-700">{score}/100</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: score + '%' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={cn('h-full rounded-full', scoreColors[key] || 'bg-primary-500')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Score */}
      <div className="flex items-center justify-center rounded-xl border border-surface-200 bg-white p-4">
        <div className="relative h-20 w-20">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-100" />
            <circle
              cx="40" cy="40" r="34" fill="none" strokeWidth="6"
              strokeDasharray={(overallScore / 100) * 214 + ' 214'}
              strokeLinecap="round"
              className={cn(
                overallScore >= 80 ? 'stroke-success-500' :
                overallScore >= 60 ? 'stroke-primary-500' :
                overallScore >= 40 ? 'stroke-warning-500' : 'stroke-danger-500'
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-lg font-bold', getScoreColor(overallScore))}>{overallScore}</span>
            <span className="text-[9px] text-surface-400">/ 100</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-semibold text-surface-900">Overall Score</p>
          <p className="text-xs text-surface-500">
            {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'Needs Improvement' : 'Poor'}
          </p>
        </div>
      </div>
    </div>
  )
}
function DocumentsTab({
  documents,
  docTypeFilter,
  setDocTypeFilter,
  docStatusFilter,
  setDocStatusFilter,
  docTypes,
}: {
  documents: any[]
  docTypeFilter: string
  setDocTypeFilter: (v: string) => void
  docStatusFilter: string
  setDocStatusFilter: (v: string) => void
  docTypes: string[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
          >
            <option value="">All Types</option>
            {docTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={docStatusFilter}
            onChange={(e) => setDocStatusFilter(e.target.value)}
            className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="missing">Missing</option>
          </select>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Upload className="h-4 w-4" /> Upload
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border border-surface-200 bg-white py-12 text-center">
          <FolderOpen className="mx-auto mb-3 h-10 w-10 text-surface-300" />
          <p className="text-sm text-surface-500">No documents found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.3) }}
              className="rounded-xl border border-surface-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{docTypeIcons[doc.type] || '📁'}</span>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{doc.name}</p>
                    <p className="text-[11px] text-surface-400">{doc.type}</p>
                  </div>
                </div>
                <StatusBadge status={doc.status} type="document" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-surface-400">
                <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                <span>v{doc.version}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-surface-200 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-50">
                  <ExternalLink className="h-3 w-3" /> View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
function ApplicationTab({ lead, application, course, batch }: { lead: any; application: any; course: any; batch: any }) {
  const currentStepIdx = application ? applicationStatusSteps.findIndex((s) => s.key === application.status) : -1

  if (!application) {
    return (
      <div className="rounded-xl border border-surface-200 bg-white py-12 text-center">
        <FileText className="mx-auto mb-3 h-10 w-10 text-surface-300" />
        <p className="text-sm text-surface-500">No application found for this lead.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Stepper */}
      <div className="rounded-xl border border-surface-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-surface-900">Application Status</h3>
        <div className="flex items-center justify-between">
          {applicationStatusSteps.map((step, idx) => {
            const isPast = idx < currentStepIdx
            const isCurrent = idx === currentStepIdx
            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      isPast ? 'bg-primary-600 text-white' :
                      isCurrent ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500/30' :
                      'bg-surface-100 text-surface-400',
                    )}
                  >
                    {isPast ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span className={cn('mt-1.5 text-[10px] font-medium text-center', isCurrent ? 'text-primary-700' : isPast ? 'text-surface-600' : 'text-surface-400')}>
                    {step.label}
                  </span>
                </div>
                {idx < applicationStatusSteps.length - 1 && (
                  <div className={cn('mx-1 h-0.5 flex-1', isPast ? 'bg-primary-400' : 'bg-surface-200')} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-900">Application Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Application ID</span>
              <span className="font-medium text-surface-900">{application.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Applied On</span>
              <span className="text-surface-700">{formatDate(application.applicationDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Course</span>
              <span className="text-surface-700">{course?.name || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Batch</span>
              <span className="text-surface-700">{batch?.name || '-'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-900">Fee Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Total Fee</span>
              <span className="font-medium text-surface-900">{formatCurrency(application.totalFee)}</span>
            </div>
            {application.scholarship > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Scholarship</span>
                <span className="text-success-600">-{formatCurrency(application.scholarship)}</span>
              </div>
            )}
            {application.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Discount</span>
                <span className="text-success-600">-{formatCurrency(application.discount)}</span>
              </div>
            )}
            <div className="border-t border-surface-100 pt-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-surface-700">Net Fee</span>
                <span className="font-bold text-surface-900">
                  {formatCurrency(application.totalFee - (application.scholarship || 0) - (application.discount || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
function PaymentsTab({ payment }: { payment: any }) {
  if (!payment) {
    return (
      <div className="rounded-xl border border-surface-200 bg-white py-12 text-center">
        <CreditCard className="mx-auto mb-3 h-10 w-10 text-surface-300" />
        <p className="text-sm text-surface-500">No payment records found for this lead.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-[11px] font-medium text-surface-500">Total Fee</p>
          <p className="mt-1 text-lg font-bold text-surface-900">{formatCurrency(payment.totalFee)}</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-[11px] font-medium text-surface-500">Paid</p>
          <p className="mt-1 text-lg font-bold text-success-600">{formatCurrency(payment.paidAmount)}</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-[11px] font-medium text-surface-500">Pending</p>
          <p className="mt-1 text-lg font-bold text-warning-600">{formatCurrency(payment.pendingAmount)}</p>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <p className="text-[11px] font-medium text-surface-500">Scholarship + Discount</p>
          <p className="mt-1 text-lg font-bold text-primary-600">{formatCurrency(payment.scholarship + payment.discount)}</p>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="rounded-xl border border-surface-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-surface-900">Payment Progress</h3>
          <StatusBadge status={payment.status} type="payment" />
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: payment.totalFee > 0 ? ((payment.paidAmount / payment.totalFee) * 100) + '%' : '0%' }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-success-500 to-success-400"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-surface-500">
          <span>{payment.paidAmount > 0 ? Math.round((payment.paidAmount / payment.totalFee) * 100) : 0}% paid</span>
          <span>{formatCurrency(payment.paidAmount)} of {formatCurrency(payment.totalFee)}</span>
        </div>
      </div>

      {/* Installments */}
      <div className="rounded-xl border border-surface-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-surface-900">Installment Timeline</h3>
        <div className="space-y-3">
          {payment.installments.map((inst: any, i: number) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.3) }}
              className={cn(
                'flex items-center justify-between rounded-lg border p-4 transition-colors',
                inst.status === 'paid' ? 'border-success-200 bg-success-50/50' :
                inst.status === 'overdue' ? 'border-danger-200 bg-danger-50/50' :
                'border-surface-200 bg-white',
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold',
                  inst.status === 'paid' ? 'bg-success-100 text-success-700' :
                  inst.status === 'overdue' ? 'bg-danger-100 text-danger-700' :
                  'bg-surface-100 text-surface-600',
                )}>
                  {inst.status === 'paid' ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">{formatCurrency(inst.amount)}</p>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span>Due: {formatDate(inst.dueDate)}</span>
                    {inst.paidDate && <span>Paid: {formatDate(inst.paidDate)}</span>}
                    {inst.method && <span>via {inst.method}</span>}
                    {inst.transactionId && <span className="font-mono text-surface-400">{inst.transactionId}</span>}
                  </div>
                </div>
              </div>
              <StatusBadge status={inst.status} type="payment" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

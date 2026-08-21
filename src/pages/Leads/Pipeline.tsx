import { useState, useMemo } from 'react'
import { Plus, Search, Phone, User, Clock, X } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn, getInitials, getRelativeTime } from '@/lib/utils'
import { useAppStore } from '@/store'
import { leads as mockLeads, courses, users } from '@/data/mockData'
import { SearchInput } from '@/components/ui/SearchInput'
import Badge from '@/components/ui/Badge'
import type { Lead, LeadStatus, LeadSource } from '@/types'

interface Stage {
  id: LeadStatus
  label: string
  color: string
  gradient: string
  dotColor: string
}

const stages: Stage[] = [
  { id: 'new', label: 'New', color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', dotColor: 'bg-blue-500' },
  { id: 'assigned', label: 'Assigned', color: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600', dotColor: 'bg-indigo-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600', dotColor: 'bg-cyan-500' },
  { id: 'interested', label: 'Interested', color: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600', dotColor: 'bg-emerald-500' },
  { id: 'counselling', label: 'Counselling', color: 'bg-teal-500', gradient: 'from-teal-500 to-teal-600', dotColor: 'bg-teal-500' },
  { id: 'visit', label: 'Visit', color: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600', dotColor: 'bg-amber-500' },
  { id: 'application', label: 'Application', color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600', dotColor: 'bg-orange-500' },
  { id: 'documents', label: 'Documents', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600', dotColor: 'bg-yellow-500' },
  { id: 'payment', label: 'Payment', color: 'bg-amber-600', gradient: 'from-amber-600 to-amber-700', dotColor: 'bg-amber-600' },
  { id: 'enrolled', label: 'Enrolled', color: 'bg-green-600', gradient: 'from-green-500 to-green-600', dotColor: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500', gradient: 'from-red-500 to-red-600', dotColor: 'bg-red-500' },
]

const sourceLabels: Record<LeadSource, string> = {
  website: 'Website', google_ads: 'Google Ads', meta_ads: 'Meta Ads', instagram: 'Instagram',
  whatsapp: 'WhatsApp', walk_in: 'Walk-in', referral: 'Referral', event: 'Event',
  csv_import: 'CSV', api: 'API', landing_page: 'Landing Page', other: 'Other',
}

const sourceBadgeVariant: Record<LeadSource, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  website: 'info', google_ads: 'primary', meta_ads: 'primary', instagram: 'warning',
  whatsapp: 'success', walk_in: 'default', referral: 'success', event: 'primary',
  csv_import: 'default', api: 'info', landing_page: 'info', other: 'default',
}

export default function Pipeline() {
  const navigate = useNavigate()
  const { leads: storeLeads, updateLead } = useAppStore()
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const allLeads = storeLeads.length > 0 ? storeLeads : mockLeads

  const filteredLeads = useMemo(() => {
    let result = allLeads
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) => l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.email.toLowerCase().includes(q)
      )
    }
    if (courseFilter) result = result.filter((l) => l.courseId === courseFilter)
    if (sourceFilter) result = result.filter((l) => l.source === sourceFilter)
    return result
  }, [allLeads, search, courseFilter, sourceFilter])

  const leadsByStage = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {} as Record<LeadStatus, Lead[]>
    stages.forEach((s) => { grouped[s.id] = [] })
    filteredLeads.forEach((lead) => {
      if (grouped[lead.status]) grouped[lead.status].push(lead)
    })
    return grouped
  }, [filteredLeads])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const destStageId = result.destination.droppableId as LeadStatus
    const leadId = result.draggableId
    const lead = allLeads.find((l) => l.id === leadId)
    if (lead && lead.status !== destStageId) {
      updateLead(leadId, { status: destStageId, updatedAt: new Date().toISOString() })
      toast.success(`Moved "${lead.name}" to ${destStageId.charAt(0).toUpperCase() + destStageId.slice(1)}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Pipeline</h1>
          <p className="mt-1 text-sm text-surface-500">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} across {stages.length} stages
          </p>
        </div>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72">
          <SearchInput placeholder="Search pipeline..." value={search} onChange={setSearch} />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
        >
          <option value="">All Sources</option>
          {(Object.keys(sourceLabels) as LeadSource[]).map((s) => (
            <option key={s} value={s}>{sourceLabels[s]}</option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex w-[300px] min-w-[300px] flex-col">
              {/* Column Header */}
              <div className={cn('rounded-t-xl bg-gradient-to-r px-4 py-3', stage.gradient)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{stage.label}</span>
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold text-white">
                      {leadsByStage[stage.id]?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex-1 space-y-2.5 rounded-b-xl border border-t-0 border-surface-200 p-2.5 transition-colors min-h-[200px]',
                      snapshot.isDraggingOver ? 'bg-primary-50/50' : 'bg-surface-50',
                    )}
                  >
                    {(leadsByStage[stage.id] || []).map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            className={cn(
                              'cursor-pointer rounded-lg border border-surface-200 bg-white p-3 transition-all',
                              snapshot.isDragging
                                ? 'shadow-lg ring-2 ring-primary-500/20 rotate-[2deg]'
                                : 'shadow-sm hover:shadow-md',
                            )}
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                                  {getInitials(lead.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-surface-900 truncate">{lead.name}</p>
                                  <p className="text-[11px] text-surface-400">{lead.id}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mb-2 flex items-center gap-1.5 text-xs text-surface-500">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                            <p className="mb-2 text-xs text-surface-600 truncate">
                              {courses.find((c) => c.id === lead.courseId)?.name || '-'}
                            </p>
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-[10px] text-surface-400">
                                <span>Score</span>
                                <span className="font-medium text-surface-600">{lead.leadScore}</span>
                              </div>
                              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-surface-100">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                    lead.leadScore >= 80 ? 'bg-success-500' :
                                    lead.leadScore >= 60 ? 'bg-primary-500' :
                                    lead.leadScore >= 40 ? 'bg-warning-500' : 'bg-danger-500'
                                  )}
                                  style={{ width: `${lead.leadScore}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant={sourceBadgeVariant[lead.source]} className="text-[10px]">
                                {sourceLabels[lead.source]}
                              </Badge>
                              <div className="flex items-center gap-1 text-[10px] text-surface-400">
                                <Clock className="h-3 w-3" />
                                {getRelativeTime(lead.enquiryDate)}
                              </div>
                            </div>
                            {lead.assignedTo && (
                              <div className="mt-2 flex items-center gap-1.5 border-t border-surface-100 pt-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[8px] font-bold text-primary-700">
                                  {getInitials(users.find((u) => u.id === lead.assignedTo)?.name || '')}
                                </div>
                                <span className="text-[10px] text-surface-500 truncate">
                                  {users.find((u) => u.id === lead.assignedTo)?.name || ''}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {(!leadsByStage[stage.id] || leadsByStage[stage.id].length === 0) && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-2 rounded-full bg-surface-100 p-2">
                          <User className="h-5 w-5 text-surface-300" />
                        </div>
                        <p className="text-xs text-surface-400">No leads</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm"
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-surface-200 bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-surface-900">Quick Add Lead</h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <QuickAddForm onClose={() => setShowQuickAdd(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function QuickAddForm({ onClose }: { onClose: () => void }) {
  const { addLead } = useAppStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [courseId, setCourseId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      toast.error('Name and phone are required')
      return
    }
    const now = new Date().toISOString()
    addLead({
      id: `L${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name,
      phone,
      email: email || `${name.split(' ')[0].toLowerCase()}@placeholder.com`,
      city: 'Not specified',
      qualification: 'Not specified',
      courseId: courseId || 'CR001',
      centerId: 'C01',
      source: 'other',
      status: 'new',
      leadScore: 40,
      enquiryDate: now,
      createdAt: now,
      updatedAt: now,
    })
    toast.success(`Lead "${name}" added`)
    onClose()
  }

  const inputClasses = 'w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:bg-white focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-surface-600">Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} placeholder="Full name" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-surface-600">Phone *</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} placeholder="+91 98XXX XXXXX" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-surface-600">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="email@example.com" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-surface-600">Course</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClasses}>
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-surface-600 hover:bg-surface-100">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          Add Lead
        </button>
      </div>
    </form>
  )
}

import { useState, useMemo } from 'react'
import { Plus, Phone, Clock } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn, getInitials, getRelativeTime } from '@/lib/utils'
import { useAppStore } from '@/store'
import { leads as mockLeads, courses } from '@/data/mockData'
import { SearchInput } from '@/components/ui/SearchInput'
import Badge from '@/components/ui/Badge'
import type { Lead, LeadStatus, LeadSource } from '@/types'

interface Stage {
  id: LeadStatus
  label: string
  gradient: string
}

const stages: Stage[] = [
  { id: 'new', label: 'New Lead', gradient: 'from-sky-500 to-blue-600' },
  { id: 'assigned', label: 'Assigned Counsellor', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'contacted', label: 'Contacted Lead', gradient: 'from-cyan-500 to-teal-600' },
  { id: 'interested', label: 'Interested Student', gradient: 'from-emerald-500 to-green-600' },
  { id: 'counselling', label: 'Counselling Session', gradient: 'from-purple-500 to-violet-600' },
  { id: 'visit', label: 'Visited Campus / Portal', gradient: 'from-pink-500 to-rose-600' },
  { id: 'application', label: 'Application Submitted', gradient: 'from-teal-500 to-cyan-600' },
  { id: 'documents', label: 'Documents Verified', gradient: 'from-violet-500 to-purple-600' },
  { id: 'payment', label: 'Payment Pending', gradient: 'from-amber-500 to-orange-600' },
  { id: 'enrolled', label: 'Student Enrolled', gradient: 'from-emerald-600 to-teal-700' },
  { id: 'lost', label: 'Lead Closed / Lost', gradient: 'from-rose-500 to-red-600' },
]

const AVATAR_COLOR_PALETTES = [
  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  'bg-violet-500/20 text-violet-300 border border-violet-500/30',
];

const getAvatarStyle = (index: number) => {
  return AVATAR_COLOR_PALETTES[index % AVATAR_COLOR_PALETTES.length];
};

const getScoreBarStyle = (index: number) => {
  const palettes = [
    { bar: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]', text: 'text-emerald-400' },
    { bar: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]', text: 'text-sky-400' },
    { bar: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.4)]', text: 'text-purple-400' },
    { bar: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]', text: 'text-amber-400' },
    { bar: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.4)]', text: 'text-teal-400' },
    { bar: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]', text: 'text-rose-400' },
    { bar: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.4)]', text: 'text-indigo-400' },
    { bar: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]', text: 'text-cyan-400' },
    { bar: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.4)]', text: 'text-violet-400' },
    { bar: 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.4)]', text: 'text-fuchsia-400' },
  ];
  return palettes[index % palettes.length];
};

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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Pipeline</h1>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} across {stages.length} stages
          </p>
        </div>
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-md cursor-pointer"
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
          className="rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Sources</option>
          {(Object.keys(sourceLabels) as LeadSource[]).map((s) => (
            <option key={s} value={s}>{sourceLabels[s]}</option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
          {stages.map((stage) => (
            <div key={stage.id} className="flex w-[300px] min-w-[300px] flex-col">
              {/* Column Header */}
              <div className={cn('rounded-t-xl bg-gradient-to-r px-4 py-3 shadow-md', stage.gradient)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">{stage.label}</span>
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1A1A1A]/30 px-1.5 text-[10px] font-black text-white">
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
                      'flex-1 space-y-3 rounded-b-xl border border-t-0 border-[#3E3E3E] p-3 transition-colors min-h-[220px]',
                      snapshot.isDraggingOver ? 'bg-[#303030]' : 'bg-[#1A1A1A]',
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
                              'cursor-pointer rounded-xl border border-[#3E3E3E] bg-[#282828] p-3.5 transition-all shadow-md',
                              snapshot.isDragging
                                ? 'shadow-2xl border-[#FFA116] ring-2 ring-[#FFA116]/30 rotate-[2deg]'
                                : 'hover:border-[#555555] hover:bg-[#303030]',
                            )}
                          >
                            {(() => {
                              const scoreStyle = getScoreBarStyle(index);
                              return (
                                <>
                                  <div className="mb-2 flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black shadow-xs', getAvatarStyle(index))}>
                                        {getInitials(lead.name)}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                                        <p className="text-[10px] text-sky-400 font-mono">{lead.id}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mb-2 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                                    <Phone className="h-3 w-3 text-slate-400" />
                                    {lead.phone}
                                  </div>
                                  <p className="mb-2 text-xs text-white font-bold truncate">
                                    {courses.find((c) => c.id === lead.courseId)?.name || '-'}
                                  </p>
                                  <div className="mb-2.5">
                                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                                      <span>Score</span>
                                      <span className={cn('font-mono font-bold', scoreStyle.text)}>{lead.leadScore}</span>
                                    </div>
                                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#1A1A1A] light:bg-[#E2E8F0]">
                                      <div
                                        className={cn('h-full rounded-full transition-all', scoreStyle.bar)}
                                        style={{ width: `${lead.leadScore}%` }}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                            <div className="flex items-center justify-between pt-1 border-t border-[#3E3E3E]">
                              <Badge variant={sourceBadgeVariant[lead.source]} className="text-[10px]">
                                {sourceLabels[lead.source]}
                              </Badge>
                              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                <Clock className="h-3 w-3 text-slate-400" />
                                {getRelativeTime(lead.updatedAt)}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Download, UserPlus, Filter, X, Eye, Phone, PhoneCall,
  MessageCircle, MoreVertical, Trash2, CheckSquare, Square,
  ChevronLeft, ChevronRight, Inbox, UserCheck, FileSpreadsheet, Send, Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import { courses, users } from '@/data/mockData'
import StatusBadge from '@/components/ui/StatusBadge'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import AddLeadModal from './AddLeadModal'
import toast from 'react-hot-toast'
import type { LeadSource, LeadStatus } from '@/types'

const AVATAR_COLOR_PALETTES = [
  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  'bg-violet-500/20 text-violet-300 border border-violet-500/30',
];

const getAvatarStyle = (str?: string) => {
  const safeStr = str || 'Lead';
  let hash = 0;
  for (let i = 0; i < safeStr.length; i++) {
    hash = safeStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTES.length;
  return AVATAR_COLOR_PALETTES[index];
};

const sourceLabels: Record<string, string> = {
  website: 'Website', google_ads: 'Google Ads', meta_ads: 'Meta Ads', instagram: 'Instagram',
  whatsapp: 'WhatsApp', walk_in: 'Walk-in', referral: 'Referral', event: 'Event',
  csv_import: 'CSV', api: 'API', landing_page: 'Landing Page', other: 'Other',
  cold_call: 'Cold Call', direct: 'Direct',
}

const sourceBadgeVariant: Record<LeadSource, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  google_ads: 'info',
  meta_ads: 'primary',
  website: 'info',
  referral: 'success',
  instagram: 'warning',
  landing_page: 'info',
  whatsapp: 'success',
  event: 'warning',
  cold_call: 'default',
  walk_in: 'success',
  direct: 'default',
}

const statusOptions: LeadStatus[] = [
  'new', 'assigned', 'contacted', 'interested', 'counselling',
  'visit', 'application', 'documents', 'payment', 'enrolled', 'lost',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function LeadsList() {
  const navigate = useNavigate()
  const { leads, counsellors, deleteLead } = useAppStore()

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [assignedFilter, setAssignedFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)

  const cities = useMemo(() => Array.from(new Set(leads.map((l) => l.city))), [leads])

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (search) {
        const q = search.toLowerCase()
        const matchName = lead.name.toLowerCase().includes(q)
        const matchPhone = lead.phone.includes(q)
        const matchEmail = lead.email.toLowerCase().includes(q)
        const matchId = lead.id.toLowerCase().includes(q)
        if (!matchName && !matchPhone && !matchEmail && !matchId) return false
      }
      if (courseFilter && lead.courseId !== courseFilter) return false
      if (statusFilter && lead.status !== statusFilter) return false
      if (sourceFilter && lead.source !== sourceFilter) return false
      if (cityFilter && lead.city !== cityFilter) return false
      if (assignedFilter && lead.assignedTo !== assignedFilter) return false
      return true
    })
  }, [leads, search, courseFilter, statusFilter, sourceFilter, cityFilter, assignedFilter])

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredLeads, page])

  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; clear: () => void }[] = []
    if (courseFilter) {
      const c = courses.find((x) => x.id === courseFilter)
      list.push({ key: 'course', label: `Course: ${c?.name || courseFilter}`, clear: () => setCourseFilter('') })
    }
    if (statusFilter) {
      list.push({ key: 'status', label: `Status: ${statusFilter}`, clear: () => setStatusFilter('') })
    }
    if (sourceFilter) {
      list.push({ key: 'source', label: `Source: ${sourceLabels[sourceFilter as LeadSource] || sourceFilter}`, clear: () => setSourceFilter('') })
    }
    if (cityFilter) {
      list.push({ key: 'city', label: `City: ${cityFilter}`, clear: () => setCityFilter('') })
    }
    if (assignedFilter) {
      const u = users.find((x) => x.id === assignedFilter)
      list.push({ key: 'assigned', label: `Counsellor: ${u?.name || assignedFilter}`, clear: () => setAssignedFilter('') })
    }
    return list
  }, [courseFilter, statusFilter, sourceFilter, cityFilter, assignedFilter])

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedLeads.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedLeads.map((l) => l.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleBulkAssign = () => {
    toast.success(`Assigned ${selectedIds.size} leads`)
    setSelectedIds(new Set())
  }
  const handleBulkExport = () => {
    toast.success(`Exported ${selectedIds.size} leads`)
    setSelectedIds(new Set())
  }
  const handleBulkMessage = () => {
    toast.success(`Messaging ${selectedIds.size} leads`)
    setSelectedIds(new Set())
  }
  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteLead(id))
    toast.success(`Deleted ${selectedIds.size} leads`)
    setSelectedIds(new Set())
  }

  const clearAllFilters = () => {
    setCourseFilter('')
    setStatusFilter('')
    setSourceFilter('')
    setCityFilter('')
    setAssignedFilter('')
    setSearch('')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-[#2CBB5D]'
    if (score >= 60) return 'bg-[#FFA116]'
    if (score >= 40) return 'bg-[#FFB800]'
    return 'bg-[#FF2D55]'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Leads</h1>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#3E3E3E] bg-[#282828] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#383838] hover:text-sky-400"
          >
            <Upload className="h-4 w-4 text-sky-400" />
            Import
          </button>
          <button
            onClick={() => toast.success('Exporting leads...')}
            className="flex items-center gap-2 rounded-lg border border-[#3E3E3E] bg-[#282828] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#383838] hover:text-emerald-400"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            Export
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-md cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by name, phone, email, or ID..."
              value={search}
              onChange={setSearch}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer',
              showFilters || activeFilters.length > 0
                ? 'border-sky-500/30 bg-sky-500/15 text-sky-400'
                : 'border-[#3E3E3E] bg-[#282828] text-white hover:bg-[#303030]',
            )}
          >
            <Filter className="h-4 w-4 text-sky-400" />
            Filters
            {activeFilters.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#3E3E3E] bg-[#282828] p-4 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-300">Course</label>
                  <select
                    value={courseFilter}
                    onChange={(e) => { setCourseFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-1.5 text-xs text-white focus:border-[#FFA116] focus:outline-none"
                  >
                    <option value="">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#FFA116]">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-1.5 text-xs text-white focus:border-[#FFA116] focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#FFA116]">Source</label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => { setSourceFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-1.5 text-xs text-white focus:border-[#FFA116] focus:outline-none"
                  >
                    <option value="">All Sources</option>
                    {(Object.keys(sourceLabels) as LeadSource[]).map((s) => (
                      <option key={s} value={s}>{sourceLabels[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#FFA116]">City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => { setCityFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-1.5 text-xs text-white focus:border-[#FFA116] focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#FFA116]">Counsellor</label>
                  <select
                    value={assignedFilter}
                    onChange={(e) => { setAssignedFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3 py-1.5 text-xs text-white focus:border-[#FFA116] focus:outline-none"
                  >
                    <option value="">All Counsellors</option>
                    {counsellors.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((f) => (
              <motion.span
                key={f.key}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#383838] border border-[#FFA116] px-2.5 py-1 text-xs font-bold text-[#FFA116]"
              >
                {f.label}
                <button onClick={f.clear} className="rounded-full p-0.5 hover:bg-[#555555] text-white">
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#FF2D55] hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-[#FFA116] bg-[#303030] p-3 shadow-lg"
          >
            <span className="text-xs font-black text-[#FFA116]">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkAssign}
                className="flex items-center gap-1.5 rounded-lg bg-[#282828] border border-[#3E3E3E] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#383838]"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#FFA116]" />
                Assign
              </button>
              <button
                onClick={handleBulkExport}
                className="flex items-center gap-1.5 rounded-lg bg-[#282828] border border-[#3E3E3E] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#383838]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#FFA116]" />
                Export
              </button>
              <button
                onClick={handleBulkMessage}
                className="flex items-center gap-1.5 rounded-lg bg-[#282828] border border-[#3E3E3E] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#383838]"
              >
                <Send className="h-3.5 w-3.5 text-[#FFA116]" />
                Message
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 rounded-lg bg-[#3B181A] border border-[#FF2D55] px-3 py-1.5 text-xs font-bold text-[#FF2D55] transition-colors hover:bg-[#FF2D55] hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-[#383838] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      {paginatedLeads.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No leads found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <button
              onClick={clearAllFilters}
              className="rounded-lg bg-[#FFA116] px-4 py-2 text-xs font-black text-[#1A1A1A] hover:bg-[#E08800]"
            >
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                <th className="w-10 px-4 py-3.5 whitespace-nowrap">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {selectedIds.size === paginatedLeads.length && paginatedLeads.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-[#FFA116]" />
                    ) : (
                      <Square className="h-4 w-4 text-[#555555]" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Lead</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Phone</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Email</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Course</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Source</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Score</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Assigned</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Enquiry</th>
                <th className="w-10 px-4 py-3.5 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3E3E3E]">
              {paginatedLeads.map((lead, i) => {
                const course = courses.find((c) => c.id === lead.courseId)
                const assignedUser = users.find((u) => u.id === lead.assignedTo)
                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.2) }}
                    className={cn(
                      'transition-colors hover:bg-[#303030] cursor-pointer',
                      selectedIds.has(lead.id) ? 'bg-[#303030]' : i % 2 === 0 ? 'bg-[#282828]' : 'bg-[#222222]',
                    )}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleSelect(lead.id)}>
                        {selectedIds.has(lead.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Square className="h-4 w-4 text-[#555555]" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black shadow-xs', getAvatarStyle(lead.name))}>
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white whitespace-nowrap">{lead.name}</p>
                          <p className="text-xs text-sky-400 font-mono whitespace-nowrap">{lead.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 whitespace-nowrap font-mono font-bold text-slate-200">
                        <span>{lead.phone}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${lead.phone}`)
                          }}
                          className="rounded p-0.5 text-slate-400 transition-colors hover:bg-[#132E1F] hover:text-[#2CBB5D]"
                          title="Click to call"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap font-medium">{lead.email}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-white font-bold whitespace-nowrap">{course?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={lead.status} type="lead" />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge variant={sourceBadgeVariant[lead.source]}>
                        {sourceLabels[lead.source]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#1A1A1A]">
                          <div
                            className={cn('h-full rounded-full transition-all', getScoreColor(lead.leadScore))}
                            style={{ width: `${lead.leadScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-sky-400 font-mono">{lead.leadScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {assignedUser ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#383838] border border-[#555555] text-[10px] font-bold text-sky-400">
                            {getInitials(assignedUser.name)}
                          </div>
                          <span className="text-xs text-slate-200 font-bold whitespace-nowrap">{assignedUser.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 whitespace-nowrap">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 font-medium whitespace-nowrap">{formatDate(lead.enquiryDate)}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === lead.id ? null : lead.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#383838] hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === lead.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-[#3E3E3E] bg-[#282828] py-1 shadow-2xl"
                            >
                              <button
                                onClick={() => { navigate(`/leads/${lead.id}`); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-[#383838] hover:text-[#FFA116]"
                              >
                                <Eye className="h-4 w-4" /> View
                              </button>
                              <button
                                onClick={() => { toast.success('Edit mode'); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-[#383838] hover:text-[#FFA116]"
                              >
                                <Pencil className="h-4 w-4" /> Edit
                              </button>
                              <button
                                onClick={() => { window.open(`tel:${lead.phone}`); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-[#383838] hover:text-[#FFA116]"
                              >
                                <PhoneCall className="h-4 w-4" /> Call
                              </button>
                              <button
                                onClick={() => { window.open(`https://wa.me/${lead.phone.replace(/\s+/g, '').replace('+', '')}`); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-[#383838] hover:text-[#2CBB5D]"
                              >
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                              </button>
                              <div className="my-1 border-t border-[#3E3E3E]" />
                              <button
                                onClick={() => { deleteLead(lead.id); toast.success('Lead deleted'); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-[#FF2D55] hover:bg-[#3B181A]"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-bold text-slate-400">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors border border-[#3E3E3E]',
                page === 1 ? 'cursor-not-allowed text-slate-600 bg-[#1A1A1A]' : 'text-white bg-[#282828] hover:bg-[#383838] hover:text-[#FFA116]',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-colors border border-[#3E3E3E]',
                    pageNum === page
                      ? 'bg-[#FFA116] text-[#1A1A1A] border-[#FFA116]'
                      : 'bg-[#282828] text-white hover:bg-[#383838]',
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors border border-[#3E3E3E]',
                page === totalPages ? 'cursor-not-allowed text-slate-600 bg-[#1A1A1A]' : 'text-white bg-[#282828] hover:bg-[#383838] hover:text-[#FFA116]',
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      {/* Import Modal */}
      <ImportModal open={importModalOpen} onOpenChange={setImportModalOpen} />
    </div>
  )
}

function ImportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-2xl text-white"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Import Leads</h3>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-[#383838] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors',
                dragOver ? 'border-[#FFA116] bg-[#303030]' : 'border-[#3E3E3E] bg-[#1A1A1A]',
              )}
            >
              <Upload className={cn('mb-3 h-10 w-10', dragOver ? 'text-[#FFA116]' : 'text-slate-500')} />
              <p className="text-sm font-bold text-white">Drop your CSV file here</p>
              <p className="mt-1 text-xs text-slate-400">or click to browse</p>
              <input type="file" accept=".csv" className="hidden" id="csv-upload" />
              <label
                htmlFor="csv-upload"
                className="mt-4 cursor-pointer rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-4 py-2 text-xs font-black text-[#1A1A1A] shadow-md"
              >
                Select File
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#383838]"
              >
                Cancel
              </button>
              <button
                onClick={() => { toast.success('Import started'); onOpenChange(false) }}
                className="rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-4 py-2 text-xs font-black text-[#1A1A1A]"
              >
                Import
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useMemo, useCallback } from 'react'
import {
  UserPlus, Upload, Download, Users, MessageSquare, Search, Filter, X, ChevronLeft, ChevronRight,
  Phone, MoreVertical, Eye, Pencil, Trash2, PhoneCall, MessageCircle, Inbox, ArrowUpDown,
  CheckSquare, Square, FileSpreadsheet, Send, UserCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn, formatDate, getInitials, generateId } from '@/lib/utils'
import { useAppStore } from '@/store'
import { leads as mockLeads, courses, batches, users } from '@/data/mockData'
import { SearchInput } from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import AddLeadModal from './AddLeadModal'
import type { Lead, LeadStatus, LeadSource } from '@/types'

const ITEMS_PER_PAGE = 12

const sourceBadgeVariant: Record<LeadSource, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  website: 'info',
  google_ads: 'primary',
  meta_ads: 'primary',
  instagram: 'warning',
  whatsapp: 'success',
  walk_in: 'default',
  referral: 'success',
  event: 'primary',
  csv_import: 'default',
  api: 'info',
  landing_page: 'info',
  other: 'default',
}

const sourceLabels: Record<LeadSource, string> = {
  website: 'Website',
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  walk_in: 'Walk-in',
  referral: 'Referral',
  event: 'Event',
  csv_import: 'CSV Import',
  api: 'API',
  landing_page: 'Landing Page',
  other: 'Other',
}

const statusOptions: LeadStatus[] = [
  'new', 'assigned', 'contacted', 'interested', 'counselling',
  'visit', 'application', 'documents', 'payment', 'enrolled', 'lost',
]

export default function LeadsList() {
  const navigate = useNavigate()
  const { leads: storeLeads, deleteLead } = useAppStore()
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [assignedFilter, setAssignedFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const filteredLeads = useMemo(() => {
    let result = storeLeads.length > 0 ? storeLeads : mockLeads
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      )
    }
    if (courseFilter) result = result.filter((l) => l.courseId === courseFilter)
    if (statusFilter) result = result.filter((l) => l.status === statusFilter)
    if (sourceFilter) result = result.filter((l) => l.source === sourceFilter)
    if (cityFilter) result = result.filter((l) => l.city.toLowerCase().includes(cityFilter.toLowerCase()))
    if (assignedFilter) result = result.filter((l) => l.assignedTo === assignedFilter)
    return result
  }, [storeLeads, search, courseFilter, statusFilter, sourceFilter, cityFilter, assignedFilter])

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  const paginatedLeads = filteredLeads.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const cities = useMemo(() => [...new Set(mockLeads.map((l) => l.city))].sort(), [])
  const counsellors = useMemo(() => users.filter((u) => u.role === 'counsellor'), [])

  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; clear: () => void }[] = []
    if (courseFilter) {
      const course = courses.find((c) => c.id === courseFilter)
      filters.push({ key: 'course', label: course?.name || courseFilter, clear: () => setCourseFilter('') })
    }
    if (statusFilter) filters.push({ key: 'status', label: statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1), clear: () => setStatusFilter('') })
    if (sourceFilter) filters.push({ key: 'source', label: sourceLabels[sourceFilter as LeadSource] || sourceFilter, clear: () => setSourceFilter('') })
    if (cityFilter) filters.push({ key: 'city', label: cityFilter, clear: () => setCityFilter('') })
    if (assignedFilter) {
      const user = users.find((u) => u.id === assignedFilter)
      filters.push({ key: 'assigned', label: user?.name || assignedFilter, clear: () => setAssignedFilter('') })
    }
    return filters
  }, [courseFilter, statusFilter, sourceFilter, cityFilter, assignedFilter])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedLeads.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedLeads.map((l) => l.id)))
    }
  }, [paginatedLeads, selectedIds.size])

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteLead(id))
    toast.success(`${selectedIds.size} leads deleted`)
    setSelectedIds(new Set())
  }

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedIds.size} leads`)
    setSelectedIds(new Set())
  }

  const handleBulkAssign = () => {
    toast.success(`Assigning ${selectedIds.size} leads`)
    setSelectedIds(new Set())
  }

  const handleBulkMessage = () => {
    toast.success(`Messaging ${selectedIds.size} leads`)
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
    if (score >= 80) return 'bg-success-500'
    if (score >= 60) return 'bg-primary-500'
    if (score >= 40) return 'bg-warning-500'
    return 'bg-danger-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Leads</h1>
          <p className="mt-1 text-sm text-surface-500">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3.5 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            onClick={() => toast.success('Exporting leads...')}
            className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3.5 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
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
              'flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
              showFilters || activeFilters.length > 0
                ? 'border-primary-200 bg-primary-50 text-primary-700'
                : 'border-surface-200 bg-white text-surface-700 hover:bg-surface-50',
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white">
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
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-surface-200 bg-surface-50 p-4 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-surface-500">Course</label>
                  <select
                    value={courseFilter}
                    onChange={(e) => { setCourseFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none"
                  >
                    <option value="">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-surface-500">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-surface-500">Source</label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => { setSourceFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none"
                  >
                    <option value="">All Sources</option>
                    {(Object.keys(sourceLabels) as LeadSource[]).map((s) => (
                      <option key={s} value={s}>{sourceLabels[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-surface-500">City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => { setCityFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-surface-500">Counsellor</label>
                  <select
                    value={assignedFilter}
                    onChange={(e) => { setAssignedFilter(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none"
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
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
              >
                {f.label}
                <button onClick={f.clear} className="rounded-full p-0.5 hover:bg-primary-100">
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium text-surface-500 hover:text-surface-700"
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
            className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 p-3"
          >
            <span className="text-sm font-medium text-primary-700">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkAssign}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Assign
              </button>
              <button
                onClick={handleBulkExport}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Export
              </button>
              <button
                onClick={handleBulkMessage}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50"
              >
                <Send className="h-3.5 w-3.5" />
                Message
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-danger-600 shadow-sm transition-colors hover:bg-danger-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600"
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
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="w-10 px-4 py-3 whitespace-nowrap">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {selectedIds.size === paginatedLeads.length && paginatedLeads.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-primary-600" />
                    ) : (
                      <Square className="h-4 w-4 text-surface-300" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Lead</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Course</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Source</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Score</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Assigned</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 whitespace-nowrap">Enquiry</th>
                <th className="w-10 px-4 py-3 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead, i) => {
                const course = courses.find((c) => c.id === lead.courseId)
                const assignedUser = users.find((u) => u.id === lead.assignedTo)
                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                    className={cn(
                      'border-b border-surface-100 transition-colors last:border-b-0',
                      selectedIds.has(lead.id) ? 'bg-primary-50/50' : i % 2 === 0 ? 'bg-white' : 'bg-surface-50/50',
                      'hover:bg-primary-50/30 cursor-pointer',
                    )}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleSelect(lead.id)}>
                        {selectedIds.has(lead.id) ? (
                          <CheckSquare className="h-4 w-4 text-primary-600" />
                        ) : (
                          <Square className="h-4 w-4 text-surface-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-surface-900 whitespace-nowrap">{lead.name}</p>
                          <p className="text-xs text-surface-400 font-mono whitespace-nowrap">{lead.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 whitespace-nowrap font-mono font-bold text-slate-800">
                        <span>{lead.phone}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${lead.phone}`)
                          }}
                          className="rounded p-0.5 text-surface-400 transition-colors hover:bg-success-50 hover:text-success-600"
                          title="Click to call"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-600 whitespace-nowrap font-medium">{lead.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-surface-700 font-bold whitespace-nowrap">{course?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={lead.status} type="lead" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={sourceBadgeVariant[lead.source]}>
                        {sourceLabels[lead.source]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-100">
                          <div
                            className={cn('h-full rounded-full transition-all', getScoreColor(lead.leadScore))}
                            style={{ width: `${lead.leadScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-surface-600 font-mono">{lead.leadScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {assignedUser ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[10px] font-semibold text-primary-700">
                            {getInitials(assignedUser.name)}
                          </div>
                          <span className="text-xs text-surface-700 font-bold whitespace-nowrap">{assignedUser.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-surface-400 whitespace-nowrap">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-surface-500 font-medium whitespace-nowrap">{formatDate(lead.enquiryDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === lead.id ? null : lead.id)}
                          className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === lead.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
                            >
                              <button
                                onClick={() => { navigate(`/leads/${lead.id}`); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                              >
                                <Eye className="h-4 w-4" /> View
                              </button>
                              <button
                                onClick={() => { toast.success('Edit mode'); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                              >
                                <Pencil className="h-4 w-4" /> Edit
                              </button>
                              <button
                                onClick={() => { window.open(`tel:${lead.phone}`); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                              >
                                <PhoneCall className="h-4 w-4" /> Call
                              </button>
                              <button
                                onClick={() => { window.open(`https://wa.me/${lead.phone.replace(/\s+/g, '').replace('+', '')}`); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                              >
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                              </button>
                              <div className="my-1 border-t border-surface-100" />
                              <button
                                onClick={() => { deleteLead(lead.id); toast.success('Lead deleted'); setActiveDropdown(null) }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-500">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                page === 1 ? 'cursor-not-allowed text-surface-300' : 'text-surface-600 hover:bg-surface-100',
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
                    'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                    pageNum === page
                      ? 'bg-primary-600 text-white'
                      : 'text-surface-600 hover:bg-surface-100',
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
                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                page === totalPages ? 'cursor-not-allowed text-surface-300' : 'text-surface-600 hover:bg-surface-100',
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-surface-200 bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Import Leads</h3>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600"
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
                dragOver ? 'border-primary-400 bg-primary-50' : 'border-surface-200 bg-surface-50',
              )}
            >
              <Upload className={cn('mb-3 h-10 w-10', dragOver ? 'text-primary-500' : 'text-surface-300')} />
              <p className="text-sm font-medium text-surface-700">Drop your CSV file here</p>
              <p className="mt-1 text-xs text-surface-400">or click to browse</p>
              <input type="file" accept=".csv" className="hidden" id="csv-upload" />
              <label
                htmlFor="csv-upload"
                className="mt-4 cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm border border-surface-200 hover:bg-surface-50"
              >
                Select File
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100"
              >
                Cancel
              </button>
              <button
                onClick={() => { toast.success('Import started'); onOpenChange(false) }}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
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

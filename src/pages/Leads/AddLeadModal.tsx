import { useState, useMemo } from 'react'
import { X, ChevronRight, ChevronLeft, User, BookOpen, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import { useAppStore } from '@/store'
import { leads, courses, batches, users } from '@/data/mockData'
import { generateId } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Lead, LeadSource } from '@/types'

interface AddLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  phone: string
  alternatePhone: string
  email: string
  city: string
  address: string
  qualification: string
  courseId: string
  centerId: string
  batchId: string
  source: LeadSource | ''
  campaignId: string
  message: string
  tags: string
  assignedTo: string
  leadScore: number
}

const steps = [
  { label: 'Personal', icon: User },
  { label: 'Academic', icon: BookOpen },
  { label: 'Additional', icon: MessageSquare },
]

const sourceOptions: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'meta_ads', label: 'Meta Ads' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'referral', label: 'Referral' },
  { value: 'event', label: 'Event' },
  { value: 'csv_import', label: 'CSV Import' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'other', label: 'Other' },
]

export default function AddLeadModal({ open, onOpenChange }: AddLeadModalProps) {
  const { addLead } = useAppStore()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    city: '',
    address: '',
    qualification: '',
    courseId: '',
    centerId: '',
    batchId: '',
    source: '',
    campaignId: '',
    message: '',
    tags: '',
    assignedTo: '',
    leadScore: 50,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredBatches = useMemo(() => {
    if (!formData.courseId || !formData.centerId) return []
    return batches.filter(
      (b) => b.courseId === formData.courseId && b.centerId === formData.centerId && b.isActive
    )
  }, [formData.courseId, formData.centerId])

  const filteredCourses = useMemo(() => {
    if (!formData.centerId) return courses.filter((c) => c.isActive)
    return courses.filter((c) => c.isActive && c.centerIds.includes(formData.centerId))
  }, [formData.centerId])

  const counsellors = useMemo(() => {
    return users.filter((u) => u.role === 'counsellor' && u.isActive)
  }, [])

  const duplicateWarning = useMemo(() => {
    const phoneMatch = leads.find((l) => l.phone === formData.phone)
    const emailMatch = leads.find((l) => formData.email && l.email === formData.email)
    if (phoneMatch) return `Phone number already exists for lead: ${phoneMatch.name}`
    if (emailMatch) return `Email already exists for lead: ${emailMatch.name}`
    return null
  }, [formData.phone, formData.email])

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'centerId') {
        next.courseId = ''
        next.batchId = ''
      }
      if (field === 'courseId') {
        next.batchId = ''
      }
      return next
    })
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (s === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }
    if (s === 1) {
      if (!formData.courseId) newErrors.courseId = 'Course is required'
      if (!formData.source) newErrors.source = 'Source is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    if (!validateStep(step)) return

    const now = new Date().toISOString()
    const newLead: Lead = {
      id: generateId(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      alternatePhone: formData.alternatePhone.trim() || undefined,
      email: formData.email.trim(),
      city: formData.city.trim(),
      address: formData.address.trim() || undefined,
      qualification: formData.qualification.trim() || 'Not specified',
      courseId: formData.courseId,
      centerId: formData.centerId || courses.find((c) => c.id === formData.courseId)?.centerIds[0] || '',
      batchId: formData.batchId || undefined,
      source: (formData.source as LeadSource) || 'other',
      campaignId: formData.campaignId || undefined,
      message: formData.message.trim() || undefined,
      enquiryDate: now,
      status: 'new',
      leadScore: formData.leadScore,
      assignedTo: formData.assignedTo || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      createdAt: now,
      updatedAt: now,
    }

    addLead(newLead)
    toast.success(`Lead ${newLead.name} added successfully`)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setStep(0)
    setFormData({
      name: '',
      phone: '',
      alternatePhone: '',
      email: '',
      city: '',
      address: '',
      qualification: '',
      courseId: '',
      centerId: '',
      batchId: '',
      source: '',
      campaignId: '',
      message: '',
      tags: '',
      assignedTo: '',
      leadScore: 50,
    })
    setErrors({})
  }

  const inputClasses = cn(
    'w-full rounded-lg border border-surface-200 bg-surface-50 px-3.5 py-2.5 text-sm text-surface-900',
    'placeholder:text-surface-400 transition-all duration-200',
    'focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-500/10 focus:outline-none',
  )

  const errorClasses = 'border-danger-300 focus:border-danger-400 focus:ring-danger-500/10'

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add New Lead" size="lg">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                    i < step
                      ? 'bg-primary-600 text-white'
                      : i === step
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500/30'
                        : 'bg-surface-100 text-surface-500',
                  )}
                >
                  {i < step ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <s.icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium',
                    i <= step ? 'text-surface-900' : 'text-surface-400',
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'h-px w-8 transition-colors duration-300',
                    i < step ? 'bg-primary-400' : 'bg-surface-200',
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className={cn(inputClasses, errors.name && errorClasses)}
                  />
                  {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className={cn(inputClasses, errors.phone && errorClasses)}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-danger-600">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="email@example.com"
                  className={cn(inputClasses, errors.email && errorClasses)}
                />
                {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. Mumbai"
                    className={cn(inputClasses, errors.city && errorClasses)}
                  />
                  {errors.city && <p className="mt-1 text-xs text-danger-600">{errors.city}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Alternate Phone</label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => updateField('alternatePhone', e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Full address"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Center</label>
                  <select
                    value={formData.centerId}
                    onChange={(e) => updateField('centerId', e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">All Centers</option>
                    {[...new Set(courses.flatMap((c) => c.centerIds))].map((cid) => (
                      <option key={cid} value={cid}>
                        {cid === 'C01' ? 'Mumbai' : cid === 'C02' ? 'Delhi' : cid === 'C03' ? 'Bangalore' : cid}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Course *</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => updateField('courseId', e.target.value)}
                    className={cn(inputClasses, errors.courseId && errorClasses)}
                  >
                    <option value="">Select course</option>
                    {filteredCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && <p className="mt-1 text-xs text-danger-600">{errors.courseId}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Batch</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => updateField('batchId', e.target.value)}
                    className={inputClasses}
                    disabled={!formData.courseId}
                  >
                    <option value="">Select batch</option>
                    {filteredBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.enrolled}/{b.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Source *</label>
                  <select
                    value={formData.source}
                    onChange={(e) => updateField('source', e.target.value)}
                    className={cn(inputClasses, errors.source && errorClasses)}
                  >
                    <option value="">Select source</option>
                    {sourceOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.source && <p className="mt-1 text-xs text-danger-600">{errors.source}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => updateField('qualification', e.target.value)}
                  placeholder="e.g. B.Tech, BCA, MBA"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {duplicateWarning && (
                <div className="flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 p-3">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-warning-600" />
                  <p className="text-sm text-warning-700">{duplicateWarning}</p>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">Message / Notes</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Any additional notes or enquiry details..."
                  rows={3}
                  className={cn(inputClasses, 'resize-none')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Assign Counsellor</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => updateField('assignedTo', e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Unassigned</option>
                    {counsellors.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-600">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                    placeholder="e.g. hot, referral, vip"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">
                  Lead Score: <span className="font-semibold text-primary-600">{formData.leadScore}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={formData.leadScore}
                  onChange={(e) => updateField('leadScore', Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-surface-400">
                  <span>Low (0)</span>
                  <span>Medium (50)</span>
                  <span>High (100)</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between border-t border-surface-100 pt-4">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            step === 0
              ? 'cursor-not-allowed text-surface-300'
              : 'text-surface-600 hover:bg-surface-100',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100"
          >
            Cancel
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Add Lead
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

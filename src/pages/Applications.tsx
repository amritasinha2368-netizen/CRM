import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Filter, Eye, CheckCircle2, XCircle, Clock,
  ChevronRight, ChevronDown, GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { applications, leads, courses, batches, centers } from '@/data/mockData';
import { formatCurrency, formatDate, getRelativeTime } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import toast from 'react-hot-toast';
import type { Application } from '@/types';

const statusSteps = ['draft', 'submitted', 'documents_pending', 'verified', 'approved', 'enrolled'];

export default function Applications() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredApps = useMemo(() => {
    let result = [...applications];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(app => {
        const lead = leads.find(l => l.id === app.leadId);
        return lead?.name.toLowerCase().includes(q);
      });
    }
    if (filterStatus !== 'all') {
      result = result.filter(app => app.status === filterStatus);
    }
    return result.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
  }, [searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return counts;
  }, []);

  const handleApprove = (app: Application) => {
    toast.success(`Application ${app.id} approved`);
    setShowDetailModal(false);
  };
  const handleReject = (app: Application) => {
    toast.error(`Application ${app.id} rejected`);
    setShowDetailModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Applications</h1>
          <p className="text-sm text-surface-500">Track and manage student applications</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Applications" value={applications.length} change={10} changeType="up" icon={FileText} color="primary" />
        <KPICard title="Approved" value={statusCounts['approved'] || 0} change={5} changeType="up" icon={CheckCircle2} color="success" />
        <KPICard title="Pending Review" value={(statusCounts['submitted'] || 0) + (statusCounts['documents_pending'] || 0)} change={3} changeType="neutral" icon={Clock} color="warning" />
        <KPICard title="Enrolled" value={statusCounts['enrolled'] || 0} change={8} changeType="up" icon={GraduationCap} color="blue" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput placeholder="Search applications..." value={searchQuery} onChange={setSearchQuery} className="w-full sm:w-72" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border border-[#3E3E3E] bg-[#282828] px-3.5 py-2 text-xs font-bold text-white focus:border-sky-500 focus:outline-none shadow-sm">
          <option value="all">All Status</option>
          {statusSteps.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState icon={FileText} title="No applications found" description="No applications match your filters" />
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app, idx) => {
            const lead = leads.find(l => l.id === app.leadId);
            const course = courses.find(c => c.id === app.courseId);
            const batch = batches.find(b => b.id === app.batchId);
            const center = centers.find(c => c.id === app.centerId);
            const currentStepIdx = statusSteps.indexOf(app.status);

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.02 }}
                className="rounded-xl border border-[#3E3E3E] bg-[#282828] hover:bg-[#303030] p-4 shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => { setSelectedApp(app); setShowDetailModal(true); }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
                    <FileText className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white truncate">{lead?.name}</h3>
                      <StatusBadge status={app.status} type="application" />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
                      <span>{course?.name}</span>
                      <span className="text-slate-500">•</span>
                      <span>{batch?.name}</span>
                      <span className="text-slate-500">•</span>
                      <span>{center?.name}</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-mono">{formatDate(app.applicationDate)}</span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-surface-900">{formatCurrency(app.totalFee)}</p>
                    {(app.scholarship || app.discount) ? (
                      <p className="text-xs text-success-600">
                        -{formatCurrency((app.scholarship || 0) + (app.discount || 0))} off
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight className="h-4 w-4 text-surface-400 shrink-0" />
                </div>

                {app.status !== 'rejected' && currentStepIdx >= 0 && (
                  <div className="mt-3.5 flex items-center gap-1.5">
                    {statusSteps.map((step, i) => {
                      const isFilled = i <= currentStepIdx;
                      let barStyle = 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]';
                      if (app.status === 'documents_pending') {
                        barStyle = 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
                      } else if (app.status === 'verified' || app.status === 'approved' || app.status === 'enrolled') {
                        barStyle = 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
                      }

                      return (
                        <div key={step} className="flex items-center gap-1 flex-1" title={`${step.replace(/_/g, ' ')} (${isFilled ? 'Completed' : 'Pending'})`}>
                          <div className={cn(
                            'h-2 flex-1 rounded-full transition-all duration-300',
                            isFilled ? barStyle : 'bg-[#1A1A1A] border border-[#3E3E3E]'
                          )} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={showDetailModal} onOpenChange={setShowDetailModal} title="Application Details" size="lg">
        {selectedApp && (() => {
          const lead = leads.find(l => l.id === selectedApp.leadId);
          const course = courses.find(c => c.id === selectedApp.courseId);
          const batch = batches.find(b => b.id === selectedApp.batchId);
          const center = centers.find(c => c.id === selectedApp.centerId);
          const currentStepIdx = statusSteps.indexOf(selectedApp.status);

          return (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-600">
                  {lead?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">{lead?.name}</h3>
                  <p className="text-sm text-surface-500">{lead?.email} &middot; {lead?.phone}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={selectedApp.status} type="application" />
                </div>
              </div>

              {selectedApp.status !== 'rejected' && (
                <div className="flex items-center gap-2">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex items-center gap-1 flex-1">
                      <div className={cn('text-[9px] text-center w-full', i <= currentStepIdx ? 'text-primary-600 font-medium' : 'text-surface-400')}>
                        {step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedApp.status !== 'rejected' && (
                <div className="flex items-center gap-1">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex-1">
                      <div className={cn('h-2 rounded-full', i <= currentStepIdx ? 'bg-primary-500' : 'bg-surface-100')} />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Course</p>
                  <p className="text-sm font-medium text-surface-900">{course?.name}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Batch</p>
                  <p className="text-sm font-medium text-surface-900">{batch?.name} ({batch?.timing})</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Center</p>
                  <p className="text-sm font-medium text-surface-900">{center?.name}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Applied On</p>
                  <p className="text-sm font-medium text-surface-900">{formatDate(selectedApp.applicationDate)}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Total Fee</p>
                  <p className="text-sm font-medium text-surface-900">{formatCurrency(selectedApp.totalFee)}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Scholarship / Discount</p>
                  <p className="text-sm font-medium text-surface-900">
                    {formatCurrency(selectedApp.scholarship || 0)} / {formatCurrency(selectedApp.discount || 0)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Close</button>
                {selectedApp.status !== 'enrolled' && selectedApp.status !== 'rejected' && (
                  <>
                    <button onClick={() => handleReject(selectedApp)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-danger-600 border border-danger-200 hover:bg-danger-50 rounded-lg transition-colors">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                    <button onClick={() => handleApprove(selectedApp)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors">
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

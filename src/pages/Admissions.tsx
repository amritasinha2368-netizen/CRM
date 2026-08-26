import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, FileText, CheckCircle2, XCircle, Clock,
  ArrowRight, Eye, UserPlus, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { applications, leads, courses, batches, centers } from '@/data/mockData';
import { formatCurrency, formatDate, getRelativeTime } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { Application } from '@/types';

export default function Admissions() {
  const { currentUser } = useAppStore();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { total: applications.length };
    applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return counts;
  }, []);

  const recentApplications = useMemo(() =>
    [...applications].sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()).slice(0, 8),
    []
  );

  const pipelineStages = [
    { label: 'Total', count: statusCounts.total || 0, color: 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm' },
    { label: 'Submitted', count: statusCounts['submitted'] || 0, color: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm' },
    { label: 'Docs Pending', count: statusCounts['documents_pending'] || 0, color: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm' },
    { label: 'Verified', count: statusCounts['verified'] || 0, color: 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm' },
    { label: 'Approved', count: statusCounts['approved'] || 0, color: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm' },
    { label: 'Enrolled', count: statusCounts['enrolled'] || 0, color: 'bg-gradient-to-r from-emerald-600 to-teal-700 shadow-sm' },
    { label: 'Rejected', count: statusCounts['rejected'] || 0, color: 'bg-gradient-to-r from-rose-500 to-red-600 shadow-sm' },
  ];

  const maxPipeline = Math.max(...pipelineStages.map(s => s.count), 1);

  const handleConvert = (app: Application) => {
    toast.success(`Lead converted to student for ${app.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Admissions</h1>
          <p className="text-sm text-surface-500">Manage the complete admission pipeline</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Total Applications" value={statusCounts.total || 0} change={10} changeType="up" icon={FileText} color="primary" />
        <KPICard title="Approved" value={statusCounts['approved'] || 0} change={5} changeType="up" icon={CheckCircle2} color="success" />
        <KPICard title="Enrolled" value={statusCounts['enrolled'] || 0} change={8} changeType="up" icon={GraduationCap} color="blue" />
        <KPICard title="Rejected" value={statusCounts['rejected'] || 0} change={2} changeType="down" icon={XCircle} color="danger" />
        <KPICard title="Pending" value={(statusCounts['submitted'] || 0) + (statusCounts['documents_pending'] || 0) + (statusCounts['draft'] || 0)} change={0} changeType="neutral" icon={Clock} color="warning" />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-surface-900 mb-4">Applications Pipeline</h2>
        <div className="space-y-3">
          {pipelineStages.map((stage, idx) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-surface-500 w-28 text-right">{stage.label}</span>
              <div className="flex-1 h-6 bg-slate-100 dark:bg-surface-50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.count / maxPipeline) * 100}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className={cn('h-full rounded-full flex items-center justify-end pr-2', stage.color)}
                >
                  {stage.count > 0 && (
                    <span className="text-[10px] font-black text-white drop-shadow-xs">{stage.count}</span>
                  )}
                </motion.div>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-surface-700 w-8 text-right">{stage.count}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-surface-900">Recent Admissions</h2>
        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Student</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Course</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Batch</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Date</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app, idx) => {
                const lead = leads.find(l => l.id === app.leadId);
                const course = courses.find(c => c.id === app.courseId);
                const batch = batches.find(b => b.id === app.batchId);

                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                          {lead?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-surface-900">{lead?.name}</p>
                          <p className="text-xs text-surface-400">{lead?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-700">{course?.name}</td>
                    <td className="px-4 py-3 text-surface-700">{batch?.name}</td>
                    <td className="px-4 py-3 text-surface-500 text-xs">{formatDate(app.applicationDate)}</td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} type="application" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedApp(app); setShowDetailModal(true); }} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {(app.status === 'approved' || app.status === 'documents_pending' || app.status === 'verified') && (
                          <button onClick={() => handleConvert(app)} className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary-700 transition-colors">
                            <UserPlus className="h-3 w-3" />
                            Convert
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showDetailModal} onOpenChange={setShowDetailModal} title="Admission Details" size="lg">
        {selectedApp && (() => {
          const lead = leads.find(l => l.id === selectedApp.leadId);
          const course = courses.find(c => c.id === selectedApp.courseId);
          const batch = batches.find(b => b.id === selectedApp.batchId);
          const center = centers.find(c => c.id === selectedApp.centerId);

          return (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-600">
                  {lead?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">{lead?.name}</h3>
                  <p className="text-sm text-surface-500">{lead?.email}</p>
                </div>
                <div className="ml-auto"><StatusBadge status={selectedApp.status} type="application" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Course</p>
                  <p className="text-sm font-medium text-surface-900">{course?.name}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Batch</p>
                  <p className="text-sm font-medium text-surface-900">{batch?.name}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Center</p>
                  <p className="text-sm font-medium text-surface-900">{center?.name}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Total Fee</p>
                  <p className="text-sm font-medium text-surface-900">{formatCurrency(selectedApp.totalFee)}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Scholarship</p>
                  <p className="text-sm font-medium text-success-600">{formatCurrency(selectedApp.scholarship || 0)}</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Discount</p>
                  <p className="text-sm font-medium text-success-600">{formatCurrency(selectedApp.discount || 0)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Close</button>
                {(selectedApp.status === 'approved' || selectedApp.status === 'verified') && (
                  <button onClick={() => { handleConvert(selectedApp); setShowDetailModal(false); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
                    <UserPlus className="h-4 w-4" /> Convert to Student
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

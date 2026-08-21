import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Plus, Play, Pause, Clock, CheckCircle2, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight, History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { automations } from '@/data/mockData';
import { formatDate, getRelativeTime } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { Automation } from '@/types';

export default function Automations() {
  const { currentUser } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedAutomation, setExpandedAutomation] = useState<string | null>(null);
  const [automationStates, setAutomationStates] = useState<Record<string, boolean>>(
    Object.fromEntries(automations.map(a => [a.id, a.isActive]))
  );

  const toggleAutomation = (id: string) => {
    setAutomationStates(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success(automationStates[id] ? 'Automation disabled' : 'Automation enabled');
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Automations</h1>
          <p className="text-sm text-surface-500">Create and manage automated workflows</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
          <Plus className="h-4 w-4" />
          Create Automation
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100">
              <Zap className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{automations.length}</p>
              <p className="text-xs text-surface-500">Total Automations</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <Play className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{Object.values(automationStates).filter(Boolean).length}</p>
              <p className="text-xs text-surface-500">Active</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{automations.reduce((s, a) => s + a.runsCount, 0)}</p>
              <p className="text-xs text-surface-500">Total Runs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {automations.map((automation, idx) => {
          const isActive = automationStates[automation.id];
          const isExpanded = expandedAutomation === automation.id;

          return (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className={cn(
                'rounded-xl border bg-white shadow-sm overflow-hidden transition-all duration-200',
                isActive ? 'border-surface-200 hover:shadow-md' : 'border-surface-100 opacity-75'
              )}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', isActive ? 'bg-success-100' : 'bg-surface-100')}>
                    <Zap className={cn('h-5 w-5', isActive ? 'text-success-600' : 'text-surface-400')} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-surface-900">{automation.name}</h3>
                      <Badge variant={isActive ? 'success' : 'default'}>{isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-surface-500">{automation.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Trigger: {automation.trigger}</span>
                      <span>{automation.runsCount} runs</span>
                      {automation.lastRun && <span>Last: {getRelativeTime(automation.lastRun)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleAutomation(automation.id)} className="transition-colors">
                      {isActive ? (
                        <ToggleRight className="h-8 w-8 text-success-600" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-surface-400" />
                      )}
                    </button>
                    <button onClick={() => setExpandedAutomation(isExpanded ? null : automation.id)} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 transition-colors">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-surface-100"
                  >
                    <div className="p-5 bg-surface-50/30 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-surface-500 mb-2">Actions</h4>
                        <div className="space-y-2">
                          {automation.actions.map((action, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-600">
                                {i + 1}
                              </div>
                              <span className="text-sm text-surface-700">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-surface-400">
                        <span>Created: {formatDate(automation.lastRun || new Date())}</span>
                        <span>Total runs: {automation.runsCount}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <Modal open={showCreateModal} onOpenChange={setShowCreateModal} title="Create Automation" size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Automation Name</label>
            <input className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" placeholder="e.g. New Lead Welcome" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
            <textarea rows={2} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Trigger</label>
            <select className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
              <option>New lead created</option>
              <option>Lead status changed</option>
              <option>Follow-up becomes overdue</option>
              <option>Payment received</option>
              <option>Application submitted</option>
              <option>Lead inactive for 7 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Actions</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-600">1</div>
                <select className="flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
                  <option>Send WhatsApp message</option>
                  <option>Send SMS</option>
                  <option>Send Email</option>
                  <option>Create follow-up task</option>
                  <option>Assign to counsellor</option>
                  <option>Notify team leader</option>
                  <option>Update lead score</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium">
                <Plus className="h-3 w-3" /> Add Action
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={() => { toast.success('Automation created'); setShowCreateModal(false); }} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, Clock, AlertTriangle, CheckCircle2, Plus,
  Phone, MessageCircle, Mail, MapPin, Timer, ChevronRight, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import {
  followUps, leads, users
} from '@/data/mockData';
import { formatCurrency, formatDate, formatDateTime, getRelativeTime, getInitials } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import toast from 'react-hot-toast';
import type { FollowUp } from '@/types';

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  sms: MessageCircle,
  visit: MapPin,
};

const priorityColors: Record<string, string> = {
  high: 'border-l-danger-500',
  medium: 'border-l-warning-500',
  low: 'border-l-surface-300',
};

export default function FollowUps() {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('due_today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    leadId: '', type: 'call' as const, dueDate: '', notes: '', priority: 'medium' as const,
  });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const categorized = useMemo(() => {
    const overdue = followUps.filter(f => f.status === 'overdue');
    const dueToday = followUps.filter(f => {
      const d = new Date(f.dueDate);
      return f.status === 'pending' && d >= todayStart && d < todayEnd;
    });
    const upcoming = followUps.filter(f => {
      const d = new Date(f.dueDate);
      return f.status === 'pending' && d >= todayEnd;
    });
    const completed = followUps.filter(f => f.status === 'completed');
    const snoozed = followUps.filter(f => f.status === 'snoozed');
    return { overdue, dueToday, upcoming, completed, snoozed };
  }, []);

  const filtered = useMemo(() => {
    let list = categorized[activeTab as keyof typeof categorized] || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(fu => {
        const lead = leads.find(l => l.id === fu.leadId);
        return lead?.name.toLowerCase().includes(q) || fu.notes.toLowerCase().includes(q);
      });
    }
    return list.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [activeTab, searchQuery, categorized]);

  const handleComplete = (fu: FollowUp) => {
    toast.success(`Follow-up completed for ${leads.find(l => l.id === fu.leadId)?.name}`);
  };
  const handleSnooze = (fu: FollowUp) => {
    toast.success('Follow-up snoozed for 1 hour');
  };

  const handleAdd = () => {
    toast.success('Follow-up created successfully');
    setShowAddModal(false);
    setNewFollowUp({ leadId: '', type: 'call', dueDate: '', notes: '', priority: 'medium' });
  };

  const tabs = [
    { value: 'due_today', label: 'Due Today', icon: CalendarCheck, count: categorized.dueToday.length },
    { value: 'overdue', label: 'Overdue', icon: AlertTriangle, count: categorized.overdue.length },
    { value: 'upcoming', label: 'Upcoming', icon: Clock, count: categorized.upcoming.length },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, count: categorized.completed.length },
    { value: 'snoozed', label: 'Snoozed', icon: Timer, count: categorized.snoozed.length },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Follow-ups</h1>
          <p className="text-sm text-surface-500">Manage your follow-up tasks and stay on top of leads</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Follow-up
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Pending" value={followUps.filter(f => f.status === 'pending').length} change={5} changeType="up" icon={Clock} color="amber" />
        <KPICard title="Overdue" value={categorized.overdue.length} change={12} changeType="down" icon={AlertTriangle} color="rose" />
        <KPICard title="Today's Follow-ups" value={categorized.dueToday.length} change={0} changeType="neutral" icon={CalendarCheck} color="cyan" />
        <KPICard title="Completed Today" value={categorized.completed.filter(f => {
          const d = new Date(f.dueDate);
          return d >= todayStart && d < todayEnd;
        }).length} change={8} changeType="up" icon={CheckCircle2} color="emerald" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
          <SearchInput
            placeholder="Search follow-ups..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-64"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filtered.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No follow-ups"
                description={`No ${activeTab.replace('_', ' ')} follow-ups found`}
              />
            ) : (
              filtered.map((fu, idx) => {
                const lead = leads.find(l => l.id === fu.leadId);
                const counsellor = users.find(u => u.id === fu.counsellorId);
                const TypeIcon = typeIcons[fu.type] || Phone;
                const isOverdue = fu.status === 'overdue';

                return (
                  <motion.div
                    key={fu.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className={cn(
                      'group relative rounded-xl border border-surface-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md border-l-4',
                      priorityColors[fu.priority],
                      isOverdue && 'bg-danger-50/30 border-danger-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          isOverdue ? 'bg-danger-100' : 'bg-primary-100'
                        )}>
                          <TypeIcon className={cn('h-5 w-5', isOverdue ? 'text-danger-600' : 'text-primary-600')} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-surface-900 truncate">{lead?.name || 'Unknown'}</h3>
                            <Badge variant={isOverdue ? 'danger' : fu.priority === 'high' ? 'warning' : 'default'}>
                              {fu.priority}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-surface-500">{fu.notes}</p>
                          <div className="mt-1.5 flex items-center gap-3 text-xs text-surface-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(fu.dueDate)}
                            </span>
                            {counsellor && (
                              <span className="flex items-center gap-1">
                                <div className="h-4 w-4 rounded-full bg-primary-100 flex items-center justify-center text-[8px] font-bold text-primary-600">
                                  {getInitials(counsellor.name)}
                                </div>
                                {counsellor.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {fu.status !== 'completed' && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleComplete(fu)}
                            className="rounded-lg p-1.5 text-success-600 hover:bg-success-50 transition-colors"
                            title="Complete"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toast('Reschedule feature coming soon')}
                            className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Reschedule"
                          >
                            <CalendarCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSnooze(fu)}
                            className="rounded-lg p-1.5 text-warning-600 hover:bg-warning-50 transition-colors"
                            title="Snooze"
                          >
                            <Timer className="h-4 w-4" />
                          </button>
                          {fu.type === 'call' && (
                            <button
                              onClick={() => toast('Call feature coming soon')}
                              className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Call Now"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Modal open={showAddModal} onOpenChange={setShowAddModal} title="Add Follow-up" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Lead</label>
            <select
              value={newFollowUp.leadId}
              onChange={e => setNewFollowUp(p => ({ ...p, leadId: e.target.value }))}
              className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
            >
              <option value="">Select a lead</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.id})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Type</label>
              <select
                value={newFollowUp.type}
                onChange={e => setNewFollowUp(p => ({ ...p, type: e.target.value as any }))}
                className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
              >
                <option value="call">Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="visit">Visit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Priority</label>
              <select
                value={newFollowUp.priority}
                onChange={e => setNewFollowUp(p => ({ ...p, priority: e.target.value as any }))}
                className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Due Date & Time</label>
            <input
              type="datetime-local"
              value={newFollowUp.dueDate}
              onChange={e => setNewFollowUp(p => ({ ...p, dueDate: e.target.value }))}
              className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
            <textarea
              value={newFollowUp.notes}
              onChange={e => setNewFollowUp(p => ({ ...p, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none resize-none"
              placeholder="Add notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">Create Follow-up</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

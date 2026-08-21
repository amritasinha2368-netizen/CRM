import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Phone, Clock, Target, BarChart3, Star,
  ChevronDown, ChevronUp, Shield, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { users, leads, calls, applications } from '@/data/mockData';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { User as UserType } from '@/types';

const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  crm_admin: 'bg-blue-100 text-blue-700',
  team_leader: 'bg-warning-100 text-warning-600',
  counsellor: 'bg-success-100 text-success-700',
  admissions: 'bg-cyan-100 text-cyan-700',
};

export default function Team() {
  const { currentUser } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const teamMembers = useMemo(() => users.filter(u => u.isActive), []);

  const getMemberStats = (userId: string) => {
    const memberLeads = leads.filter(l => l.assignedTo === userId);
    const memberCalls = calls.filter(c => c.counsellorId === userId);
    const connectedCalls = memberCalls.filter(c => c.disposition === 'Connected');
    const totalDuration = memberCalls.reduce((sum, c) => sum + c.duration, 0);
    const memberApps = applications.filter(a => {
      const lead = leads.find(l => l.id === a.leadId);
      return lead?.assignedTo === userId;
    });
    const enrolled = memberApps.filter(a => a.status === 'enrolled').length;
    const avgScore = memberCalls.filter(c => c.aiSummary).reduce((sum, c) => sum + (c.aiSummary?.callScore.overall || 0), 0) / (memberCalls.filter(c => c.aiSummary).length || 1);

    return {
      leads: memberLeads.length,
      calls: memberCalls.length,
      connected: connectedCalls.length,
      talkTime: totalDuration,
      applications: memberApps.length,
      enrolled,
      rate: memberLeads.length > 0 ? Math.round((enrolled / memberLeads.length) * 100) : 0,
      avgScore: Math.round(avgScore),
    };
  };

  const totalLeads = teamMembers.reduce((sum, u) => sum + getMemberStats(u.id).leads, 0);
  const totalCalls = teamMembers.reduce((sum, u) => sum + getMemberStats(u.id).calls, 0);
  const totalEnrolled = teamMembers.reduce((sum, u) => sum + getMemberStats(u.id).enrolled, 0);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Team</h1>
          <p className="text-sm text-surface-500">Manage your team members and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-surface-200 bg-white p-0.5">
            <button onClick={() => setViewMode('cards')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', viewMode === 'cards' ? 'bg-primary-600 text-white' : 'text-surface-500 hover:text-surface-700')}>Cards</button>
            <button onClick={() => setViewMode('table')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', viewMode === 'table' ? 'bg-primary-600 text-white' : 'text-surface-500 hover:text-surface-700')}>Table</button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
            <UserPlus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Team Members" value={teamMembers.length} change={0} changeType="neutral" icon={Users} color="primary" />
        <KPICard title="Total Leads" value={totalLeads} change={10} changeType="up" icon={Target} color="blue" />
        <KPICard title="Total Calls" value={totalCalls} change={8} changeType="up" icon={Phone} color="success" />
        <KPICard title="Enrollments" value={totalEnrolled} change={12} changeType="up" icon={Star} color="warning" />
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member, idx) => {
            const stats = getMemberStats(member.id);
            const isExpanded = expandedMember === member.id;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-surface-900">{member.name}</h3>
                      <p className="text-xs text-surface-500">{member.email}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', roleColors[member.role])}>
                          {member.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-success-500" />
                          <span className="text-[10px] text-surface-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-surface-50 p-2 text-center">
                      <p className="text-sm font-bold text-surface-900">{stats.leads}</p>
                      <p className="text-[9px] text-surface-500">Leads</p>
                    </div>
                    <div className="rounded-lg bg-surface-50 p-2 text-center">
                      <p className="text-sm font-bold text-surface-900">{stats.calls}</p>
                      <p className="text-[9px] text-surface-500">Calls</p>
                    </div>
                    <div className="rounded-lg bg-surface-50 p-2 text-center">
                      <p className="text-sm font-bold text-success-600">{stats.rate}%</p>
                      <p className="text-[9px] text-surface-500">Conv.</p>
                    </div>
                  </div>

                  {stats.avgScore > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-surface-500">AI Score: <span className="font-medium text-surface-700">{stats.avgScore}/100</span></span>
                    </div>
                  )}
                </div>

                <button onClick={() => setExpandedMember(isExpanded ? null : member.id)} className="w-full flex items-center justify-center gap-1 border-t border-surface-100 py-2 text-xs text-surface-400 hover:bg-surface-50 transition-colors">
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {isExpanded ? 'Less' : 'More'}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-surface-100"
                    >
                      <div className="p-4 space-y-2 bg-surface-50/30">
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-500">Connected Calls</span>
                          <span className="font-medium text-surface-700">{stats.connected}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-500">Talk Time</span>
                          <span className="font-medium text-surface-700">{Math.floor(stats.talkTime / 60)}m {stats.talkTime % 60}s</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-500">Applications</span>
                          <span className="font-medium text-surface-700">{stats.applications}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-500">Enrolled</span>
                          <span className="font-medium text-success-600">{stats.enrolled}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Member</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Role</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Leads</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Calls</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Connected</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Apps</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Enrolled</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Conv.</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">AI Score</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, idx) => {
                const stats = getMemberStats(member.id);
                return (
                  <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">{getInitials(member.name)}</div>
                        <div>
                          <p className="font-medium text-surface-900">{member.name}</p>
                          <p className="text-xs text-surface-400">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', roleColors[member.role])}>{member.role.replace(/_/g, ' ')}</span></td>
                    <td className="px-4 py-3 text-surface-700">{stats.leads}</td>
                    <td className="px-4 py-3 text-surface-700">{stats.calls}</td>
                    <td className="px-4 py-3 text-surface-700">{stats.connected}</td>
                    <td className="px-4 py-3 text-surface-700">{stats.applications}</td>
                    <td className="px-4 py-3 text-success-600 font-medium">{stats.enrolled}</td>
                    <td className="px-4 py-3"><span className={cn('font-medium', stats.rate >= 20 ? 'text-success-600' : stats.rate >= 10 ? 'text-warning-600' : 'text-surface-500')}>{stats.rate}%</span></td>
                    <td className="px-4 py-3">{stats.avgScore > 0 ? <span className="font-medium text-primary-600">{stats.avgScore}</span> : <span className="text-surface-300">-</span>}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showAddModal} onOpenChange={setShowAddModal} title="Add Team Member" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
            <input className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" placeholder="Enter full name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input type="email" className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
              <input className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
              <select className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
                <option value="counsellor">Counsellor</option>
                <option value="team_leader">Team Leader</option>
                <option value="admissions">Admissions</option>
                <option value="crm_admin">CRM Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Center</label>
              <select className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
                <option value="C01">Mumbai Center</option>
                <option value="C02">Delhi Center</option>
                <option value="C03">Bangalore Center</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={() => { toast.success('Team member added'); setShowAddModal(false); }} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">Add Member</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

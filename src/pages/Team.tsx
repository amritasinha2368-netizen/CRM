import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Phone, Star, ChevronDown, ChevronUp, Shield, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { users, leads, calls, applications } from '@/data/mockData';
import { getInitials } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const roleBadgeColors: Record<string, string> = {
  super_admin: 'bg-[#3B181A] border border-[#FF2D55]/60 text-[#FF2D55]',
  crm_admin: 'bg-[#1E293B] border border-[#007AFF]/60 text-[#38BDF8]',
  team_leader: 'bg-[#3A2E12] border border-[#FFB800]/60 text-[#FFB800]',
  counsellor: 'bg-[#132E1F] border border-[#2CBB5D]/60 text-[#2CBB5D]',
  admissions: 'bg-[#1E293B] border border-[#007AFF]/60 text-[#38BDF8]',
};

const roleAvatarGradients: Record<string, string> = {
  super_admin: 'bg-gradient-to-br from-[#FF2D55] to-[#DC1C3B] text-white',
  crm_admin: 'bg-gradient-to-br from-[#007AFF] to-[#0051A8] text-white',
  team_leader: 'bg-gradient-to-br from-[#FFB800] to-[#D99B00] text-[#1A1A1A]',
  counsellor: 'bg-gradient-to-br from-[#FFA116] to-[#E08800] text-[#1A1A1A]',
  admissions: 'bg-gradient-to-br from-[#2CBB5D] to-[#1E8A42] text-white',
};

export default function Team() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const teamMembers = useMemo(() => users.filter(u => u.isActive), []);

  const getMemberStats = (userId: string, role: string) => {
    if (role === 'super_admin' || role === 'crm_admin') {
      // System-wide metrics for Leadership & Super Admin
      const totalLeads = leads.length;
      const totalCalls = calls.length;
      const totalConnected = calls.filter(c => c.disposition === 'Connected').length;
      const totalDuration = calls.reduce((sum, c) => sum + (c.duration || 0), 0);
      const totalApps = applications.length;
      const totalEnrolled = applications.filter(a => a.status === 'enrolled').length;
      const scoredCalls = calls.filter(c => c.aiSummary?.callScore?.overall != null);
      const avgScore = scoredCalls.length > 0
        ? scoredCalls.reduce((sum, c) => sum + (c.aiSummary?.callScore?.overall || 0), 0) / scoredCalls.length
        : 0;

      return {
        leads: totalLeads,
        calls: totalCalls,
        connected: totalConnected,
        talkTime: totalDuration,
        applications: totalApps,
        enrolled: totalEnrolled,
        rate: totalLeads > 0 ? Math.round((totalEnrolled / totalLeads) * 100) : 0,
        avgScore: Math.round(avgScore),
        scopeLabel: 'System Oversight',
      };
    }

    if (role === 'team_leader') {
      // Team-wide metrics for Team Leaders
      const teamCounsellors = users.filter(u => u.role === 'counsellor' || u.id === userId).map(u => u.id);
      const teamLeads = leads.filter(l => teamCounsellors.includes(l.assignedTo));
      const teamCalls = calls.filter(c => teamCounsellors.includes(c.counsellorId));
      const connectedCalls = teamCalls.filter(c => c.disposition === 'Connected');
      const totalDuration = teamCalls.reduce((sum, c) => sum + (c.duration || 0), 0);
      const teamApps = applications.filter(a => {
        const lead = leads.find(l => l.id === a.leadId);
        return lead && teamCounsellors.includes(lead.assignedTo);
      });
      const enrolled = teamApps.filter(a => a.status === 'enrolled').length;
      const scoredCalls = teamCalls.filter(c => c.aiSummary?.callScore?.overall != null);
      const avgScore = scoredCalls.length > 0
        ? scoredCalls.reduce((sum, c) => sum + (c.aiSummary?.callScore?.overall || 0), 0) / scoredCalls.length
        : 0;

      return {
        leads: teamLeads.length,
        calls: teamCalls.length,
        connected: connectedCalls.length,
        talkTime: totalDuration,
        applications: teamApps.length,
        enrolled,
        rate: teamLeads.length > 0 ? Math.round((enrolled / teamLeads.length) * 100) : 0,
        avgScore: Math.round(avgScore),
        scopeLabel: 'Team Scope',
      };
    }

    // Direct metrics for Counsellors
    const memberLeads = leads.filter(l => l.assignedTo === userId);
    const memberCalls = calls.filter(c => c.counsellorId === userId);
    const connectedCalls = memberCalls.filter(c => c.disposition === 'Connected');
    const totalDuration = memberCalls.reduce((sum, c) => sum + (c.duration || 0), 0);
    const memberApps = applications.filter(a => {
      const lead = leads.find(l => l.id === a.leadId);
      return lead?.assignedTo === userId;
    });
    const enrolled = memberApps.filter(a => a.status === 'enrolled').length;
    const scoredCalls = memberCalls.filter(c => c.aiSummary?.callScore?.overall != null);
    const avgScore = scoredCalls.length > 0
      ? scoredCalls.reduce((sum, c) => sum + (c.aiSummary?.callScore?.overall || 0), 0) / scoredCalls.length
      : 0;

    return {
      leads: memberLeads.length,
      calls: memberCalls.length,
      connected: connectedCalls.length,
      talkTime: totalDuration,
      applications: memberApps.length,
      enrolled,
      rate: memberLeads.length > 0 ? Math.round((enrolled / memberLeads.length) * 100) : 0,
      avgScore: Math.round(avgScore),
      scopeLabel: 'Direct Performance',
    };
  };

  const totalLeads = leads.length;
  const totalCalls = calls.length;
  const totalEnrolled = applications.filter(a => a.status === 'enrolled').length;

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Team Performance</h1>
          <p className="text-xs font-bold text-[#FFA116] mt-1">Manage active counsellors, team leaders and track key conversion metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={cn('px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer', viewMode === 'cards' ? 'bg-[#FFA116] text-[#1A1A1A] font-black shadow-md' : 'text-slate-400 hover:text-white')}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn('px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer', viewMode === 'table' ? 'bg-[#FFA116] text-[#1A1A1A] font-black shadow-md' : 'text-slate-400 hover:text-white')}
            >
              Table
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </motion.div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Team" value={teamMembers.length} change={0} changeType="neutral" icon={Users} color="primary" />
        <KPICard title="Assigned Leads" value={totalLeads} change={10} changeType="up" icon={Target} color="blue" />
        <KPICard title="Logged Calls" value={totalCalls} change={8} changeType="up" icon={Phone} color="success" />
        <KPICard title="Enrollments" value={totalEnrolled} change={12} changeType="up" icon={Star} color="warning" />
      </div>

      {/* Team Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member, idx) => {
            const stats = getMemberStats(member.id, member.role);
            const isExpanded = expandedMember === member.id;
            const avatarBg = roleAvatarGradients[member.role] || 'bg-[#FFA116] text-[#1A1A1A]';

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl overflow-hidden hover:border-[#FFA116] transition-all flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3.5">
                    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-md', avatarBg)}>
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-white truncate">{member.name}</h3>
                      <p className="text-xs text-slate-400 truncate">{member.email}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold capitalize', roleBadgeColors[member.role] || 'bg-[#303030] text-slate-300')}>
                          {member.role.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center gap-1.5 bg-[#132E1F] border border-[#2CBB5D]/40 px-2 py-0.5 rounded-md">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#2CBB5D] animate-pulse" />
                          <span className="text-[10px] font-bold text-[#2CBB5D]">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stat Grid */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-[#1A1A1A] border border-[#3E3E3E] p-2.5 text-center">
                      <p className="text-base font-extrabold text-[#FFA116] font-mono">{stats.leads}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Leads</p>
                    </div>
                    <div className="rounded-lg bg-[#1A1A1A] border border-[#3E3E3E] p-2.5 text-center">
                      <p className="text-base font-extrabold text-[#38BDF8] font-mono">{stats.calls}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Calls</p>
                    </div>
                    <div className="rounded-lg bg-[#132E1F] border border-[#2CBB5D]/40 p-2.5 text-center">
                      <p className="text-base font-extrabold text-[#2CBB5D] font-mono">{stats.rate}%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#2CBB5D] mt-0.5">Conv.</p>
                    </div>
                  </div>

                  {stats.avgScore > 0 && (
                    <div className="mt-4 flex items-center justify-between bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#3E3E3E]">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#FFA116]" />
                        <span className="text-xs text-slate-300 font-medium">AI Quality Score</span>
                      </div>
                      <span className="text-xs font-bold text-[#FFA116] font-mono">{stats.avgScore}/100</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                  className="w-full flex items-center justify-center gap-1.5 border-t border-[#3E3E3E] bg-[#222222] py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-[#303030] transition-colors cursor-pointer"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-[#FFA116]" /> : <ChevronDown className="h-4 w-4 text-[#FFA116]" />}
                  {isExpanded ? 'Hide Details' : `View ${stats.scopeLabel} Details`}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-[#3E3E3E] bg-[#1A1A1A]"
                    >
                      <div className="p-4 space-y-2.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Scope Type</span>
                          <span className="font-bold text-[#FFA116]">{stats.scopeLabel}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Connected Calls</span>
                          <span className="font-bold text-white">{stats.connected}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Total Talk Time</span>
                          <span className="font-mono font-bold text-[#FFA116]">{Math.floor(stats.talkTime / 60)}m {stats.talkTime % 60}s</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Applications Created</span>
                          <span className="font-bold text-white">{stats.applications}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Total Enrolled</span>
                          <span className="font-bold text-[#2CBB5D]">{stats.enrolled}</span>
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
        <div className="overflow-x-auto rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Member</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Role</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Leads</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Calls</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Connected</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Apps</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Enrolled</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">Conv.</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] whitespace-nowrap">AI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3E3E3E]">
              {teamMembers.map((member, idx) => {
                const stats = getMemberStats(member.id, member.role);
                const avatarBg = roleAvatarGradients[member.role] || 'bg-[#FFA116] text-[#1A1A1A]';

                return (
                  <tr key={member.id} className={cn('transition-colors hover:bg-[#303030]', idx % 2 === 0 ? 'bg-[#282828]' : 'bg-[#222222]')}>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={cn('h-8 w-8 rounded-md flex items-center justify-center text-xs font-black shadow-sm', avatarBg)}>
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="font-bold text-white whitespace-nowrap">{member.name}</p>
                          <p className="text-xs text-slate-400 font-mono whitespace-nowrap">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold capitalize', roleBadgeColors[member.role] || 'bg-[#303030] text-slate-300')}>
                        {member.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#FFA116] font-mono font-bold whitespace-nowrap">{stats.leads}</td>
                    <td className="px-4 py-3.5 text-[#38BDF8] font-mono font-bold whitespace-nowrap">{stats.calls}</td>
                    <td className="px-4 py-3.5 text-white font-bold whitespace-nowrap">{stats.connected}</td>
                    <td className="px-4 py-3.5 text-white font-bold whitespace-nowrap">{stats.applications}</td>
                    <td className="px-4 py-3.5 text-[#2CBB5D] font-extrabold whitespace-nowrap">{stats.enrolled}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={cn('font-bold font-mono', stats.rate >= 20 ? 'text-[#2CBB5D]' : stats.rate >= 10 ? 'text-[#FFB800]' : 'text-slate-400')}>
                        {stats.rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold">
                      {stats.avgScore > 0 ? <span className="text-[#FFA116]">{stats.avgScore}/100</span> : <span className="text-slate-600">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal open={showAddModal} onOpenChange={setShowAddModal} title="Add Team Member" size="md">
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Full Name</label>
            <input className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]" placeholder="Enter full name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Email Address</label>
              <input type="email" className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]" placeholder="name@gogacademy.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Phone Number</label>
              <input className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]" placeholder="+91 98123 45678" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Role</label>
              <select className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]">
                <option value="counsellor">Counsellor</option>
                <option value="team_leader">Team Leader</option>
                <option value="admissions">Admissions</option>
                <option value="crm_admin">CRM Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFA116] mb-1.5">Assigned Center</label>
              <select className="w-full rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116]">
                <option value="C01">Mumbai Center</option>
                <option value="C02">Delhi Center</option>
                <option value="C03">Bangalore Center</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#3E3E3E]">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#383838] rounded-lg transition-colors">Cancel</button>
            <button onClick={() => { toast.success('Team member added successfully'); setShowAddModal(false); }} className="px-5 py-2 text-xs font-black text-[#1A1A1A] bg-[#FFA116] hover:bg-[#E08800] rounded-lg transition-colors shadow-md">Add Member</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

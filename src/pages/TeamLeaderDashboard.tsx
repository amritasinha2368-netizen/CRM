import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Phone, FileText, GraduationCap, TrendingUp,
  AlertTriangle, Trophy, ArrowRight, Shield, BarChart3, RefreshCw,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, users, calls, applications, payments } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import Badge from '@/components/ui/Badge';

const CHART_COLORS = ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const card = 'rounded-xl border border-surface-200 bg-white shadow-sm';
const cardHeader = 'px-5 py-4 border-b border-surface-100';
const cardBody = 'p-5';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

export default function TeamLeaderDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const teamMembers = useMemo(() => users.filter((u) => u.teamId === currentUser.teamId && u.role === 'counsellor'), [currentUser.teamId]);
  const teamIds = useMemo(() => teamMembers.map((m) => m.id), [teamMembers]);
  const teamLeads = useMemo(() => leads.filter((l) => l.assignedTo && teamIds.includes(l.assignedTo)), [teamIds]);
  const teamCalls = useMemo(() => calls.filter((c) => teamIds.includes(c.counsellorId)), [teamIds]);
  const teamApps = useMemo(() => applications.filter((a) => teamLeads.some((l) => l.id === a.leadId)), [teamLeads]);
  const teamEnrolled = teamApps.filter((a) => a.status === 'enrolled').length;
  const teamRevenue = useMemo(() => payments.filter((p) => teamLeads.some((l) => l.id === p.leadId)).reduce((sum, p) => sum + p.paidAmount, 0), [teamLeads]);
  const teamConversion = teamLeads.length > 0 ? Math.round((teamEnrolled / teamLeads.length) * 100 * 10) / 10 : 0;

  const escalationQueue = useMemo(() => {
    return teamLeads
      .filter((l) => {
        const daysSinceUpdate = (Date.now() - new Date(l.updatedAt).getTime()) / 86400000;
        return daysSinceUpdate > 7 && l.status !== 'enrolled' && l.status !== 'lost';
      })
      .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      .slice(0, 6);
  }, [teamLeads]);

  const leaderboard = useMemo(() => {
    return teamMembers.map((member) => {
      const mLeads = teamLeads.filter((l) => l.assignedTo === member.id);
      const mCalls = teamCalls.filter((c) => c.counsellorId === member.id);
      const mApps = mLeads.filter((l) => ['application', 'documents', 'payment', 'enrolled'].includes(l.status)).length;
      const mEnrolled = mLeads.filter((l) => l.status === 'enrolled').length;
      const mConv = mLeads.length > 0 ? Math.round((mEnrolled / mLeads.length) * 100 * 10) / 10 : 0;
      return {
        ...member,
        leadsHandled: mLeads.length,
        callsMade: mCalls.length,
        applications: mApps,
        enrolled: mEnrolled,
        conversion: mConv,
      };
    }).sort((a, b) => b.enrolled - a.enrolled);
  }, [teamMembers, teamLeads, teamCalls]);

  const resourceChart = useMemo(() => {
    return leaderboard.map((m, i) => ({
      name: m.name.split(' ')[0],
      leads: m.leadsHandled,
      enrolled: m.enrolled,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [leaderboard]);

  const rankEmoji = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Team Dashboard</h1>
          <p className="mt-0.5 text-sm text-surface-500">Team {currentUser.teamId} overview</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl"
        >
          <UserCheck className="h-4 w-4" />
          Quick Assign
        </motion.button>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <KPICard title="Team Leads" value={teamLeads.length} change={12} changeType="up" icon={Users} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Team Calls" value={teamCalls.length} change={8} changeType="up" icon={Phone} color="blue" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Applications" value={teamApps.length} change={10} changeType="up" icon={FileText} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Enrolled" value={teamEnrolled} change={20} changeType="up" icon={GraduationCap} color="success" />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn(card, 'lg:col-span-2')}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Team Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs font-medium text-surface-500">
                  <th className="px-5 py-3">Counsellor</th>
                  <th className="px-5 py-3 text-center">Leads</th>
                  <th className="px-5 py-3 text-center">Calls</th>
                  <th className="px-5 py-3 text-center">Apps</th>
                  <th className="px-5 py-3 text-center">Enrolled</th>
                  <th className="px-5 py-3 text-center">Conv %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {leaderboard.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{rankEmoji[i] ?? ''}</span>
                        <div>
                          <p className="font-medium text-surface-800">{member.name}</p>
                          <p className="text-xs text-surface-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center font-medium text-surface-700">{member.leadsHandled}</td>
                    <td className="px-5 py-3 text-center text-surface-600">{member.callsMade}</td>
                    <td className="px-5 py-3 text-center text-surface-600">{member.applications}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="font-bold text-success-600">{member.enrolled}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant={member.conversion >= 20 ? 'success' : member.conversion >= 10 ? 'warning' : 'danger'} dot>
                        {member.conversion}%
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Escalation Queue</h3>
          </div>
          <div className="divide-y divide-surface-50">
            {escalationQueue.length === 0 && (
              <p className="p-5 text-sm text-surface-400">No escalations pending.</p>
            )}
            {escalationQueue.map((lead, i) => {
              const counsellor = users.find((u) => u.id === lead.assignedTo);
              const daysInactive = Math.floor((Date.now() - new Date(lead.updatedAt).getTime()) / 86400000);
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-50">
                    <AlertTriangle className="h-4 w-4 text-danger-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-surface-800 truncate">{lead.name}</p>
                    <p className="text-xs text-surface-400">{counsellor?.name ?? 'Unassigned'} · {daysInactive}d inactive</p>
                  </div>
                  <StatusBadge status={lead.status} type="lead" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={card}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Team Leaderboard</h3>
          </div>
          <div className={cardBody}>
            <div className="space-y-3">
              {leaderboard.map((member, i) => {
                const maxLeads = Math.max(...leaderboard.map((m) => m.leadsHandled), 1);
                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <span className="w-7 shrink-0 text-center text-lg">{rankEmoji[i] ?? <span className="text-xs font-bold text-surface-400">#{i + 1}</span>}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-surface-800 truncate">{member.name}</p>
                        <span className="text-xs font-bold text-primary-600">{member.enrolled} enrolled</span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-surface-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(member.leadsHandled / maxLeads) * 100}%` }}
                          transition={{ delay: 0.6 + i * 0.06, duration: 0.5 }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={card}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Resource Allocation</h3>
          </div>
          <div className={cardBody}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={resourceChart} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="leads" name="Leads" radius={[4, 4, 0, 0]}>
                  {resourceChart.map((entry, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.7} />
                  ))}
                </Bar>
                <Bar dataKey="enrolled" name="Enrolled" radius={[4, 4, 0, 0]}>
                  {resourceChart.map((entry, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className={card}>
        <div className={cardHeader}>
          <h3 className="text-sm font-semibold text-surface-700">Team Summary</h3>
        </div>
        <div className={cardBody}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Team Revenue', value: formatCurrency(teamRevenue), icon: TrendingUp, color: 'text-success-600 bg-success-50' },
              { label: 'Team Conversion', value: `${teamConversion}%`, icon: BarChart3, color: 'text-primary-600 bg-primary-50' },
              { label: 'Active Counsellors', value: teamMembers.length.toString(), icon: Shield, color: 'text-navy-600 bg-navy-50' },
              { label: 'Avg Leads/Person', value: teamMembers.length > 0 ? Math.round(teamLeads.length / teamMembers.length).toString() : '0', icon: Users, color: 'text-warning-600 bg-warning-50' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-surface-100 p-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500">{stat.label}</p>
                  <p className="text-lg font-bold text-surface-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

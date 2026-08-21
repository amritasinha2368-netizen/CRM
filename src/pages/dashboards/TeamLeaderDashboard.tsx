import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Phone, CalendarClock, TrendingUp, AlertTriangle, FileText,
  GraduationCap, BarChart3, CalendarDays, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, users, calls } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';

const card = 'rounded-2xl border border-surface-200/60 bg-white shadow-sm hover:shadow-lg transition-all duration-300';
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function TeamLeaderDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const teamLeads = leads.filter((l) => l.assignedTo);
  const totalCalls = calls.length;
  const connectedCalls = calls.filter((c) => c.disposition === 'Connected').length;
  const overdue = leads.filter((l) => l.status === 'contacted').length;
  const apps = leads.filter((l) => l.status === 'application').length;
  const enrolled = leads.filter((l) => l.status === 'enrolled').length;
  const convRate = teamLeads.length > 0 ? Math.round((enrolled / teamLeads.length) * 100) : 0;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const counsellorPerf = useMemo(() => {
    const perf: Record<string, { leads: number; calls: number; enrolled: number }> = {};
    leads.forEach((l) => {
      if (l.assignedTo) {
        if (!perf[l.assignedTo]) perf[l.assignedTo] = { leads: 0, calls: 0, enrolled: 0 };
        perf[l.assignedTo].leads++;
        if (l.status === 'enrolled') perf[l.assignedTo].enrolled++;
      }
    });
    calls.forEach((c) => {
      if (perf[c.counsellorId]) perf[c.counsellorId].calls++;
    });
    return Object.entries(perf).map(([id, data]) => ({
      name: id, ...data,
      conversion: data.leads > 0 ? Math.round((data.enrolled / data.leads) * 100) : 0,
    })).sort((a, b) => b.leads - a.leads).slice(0, 6);
  }, []);

  const overdueLeads = useMemo(() => leads.filter((l) => l.status === 'contacted' || l.status === 'new').slice(0, 5), []);

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 border border-surface-200/60">
        <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-amber-600" /><span className="text-xs font-bold uppercase tracking-widest text-amber-600/60">Team Leader</span></div>
        <h1 className="text-2xl font-extrabold text-surface-900">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-surface-500"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />{formatDate(new Date())} &bull; Team performance</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}><KPICard title="Team Leads" value={teamLeads.length} change={12} changeType="up" icon={Users} color="primary" /></motion.div>
        <motion.div variants={item}><KPICard title="Calls Today" value={totalCalls} change={8} changeType="up" icon={Phone} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Connected" value={connectedCalls} change={5} changeType="up" icon={Phone} color="success" /></motion.div>
        <motion.div variants={item}><KPICard title="Overdue" value={overdue} change={0} changeType="neutral" icon={AlertTriangle} color="warning" /></motion.div>
        <motion.div variants={item}><KPICard title="Applications" value={apps} change={10} changeType="up" icon={FileText} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Admissions" value={enrolled} change={20} changeType="up" icon={GraduationCap} color="success" /></motion.div>
        <motion.div variants={item}><KPICard title="Conversion" value={convRate} change={5} changeType="up" icon={TrendingUp} color="primary" suffix="%" /></motion.div>
        <motion.div variants={item}><KPICard title="Follow-ups" value={overdue} change={0} changeType="neutral" icon={CalendarClock} color="warning" /></motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn(card, 'lg:col-span-2')}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Counsellor Leaderboard</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-surface-100 text-xs font-medium text-surface-500">
                <th className="px-5 py-3">Counsellor</th><th className="px-5 py-3">Leads</th><th className="px-5 py-3">Calls</th><th className="px-5 py-3">Admissions</th><th className="px-5 py-3">Conv.</th>
              </tr></thead>
              <tbody className="divide-y divide-surface-50">
                {counsellorPerf.map((c, i) => (
                  <motion.tr key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }} className="hover:bg-surface-50">
                    <td className="px-5 py-3 font-medium text-surface-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-surface-400">#{i + 1}</span>
                        <div className="h-7 w-7 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">{c.name.slice(0, 2).toUpperCase()}</div>
                        {c.name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-surface-600">{c.leads}</td>
                    <td className="px-5 py-3 text-surface-600">{c.calls}</td>
                    <td className="px-5 py-3 font-bold text-primary-600">{c.enrolled}</td>
                    <td className="px-5 py-3"><span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', c.conversion > 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-100 text-surface-500')}>{c.conversion}%</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Overdue Leads */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Overdue Leads</h3></div>
          <div className="p-4 space-y-2">
            {overdueLeads.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-700">{l.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{l.name}</p>
                  <p className="text-xs text-surface-400">{l.phone}</p>
                </div>
                <StatusBadge status={l.status} type="lead" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

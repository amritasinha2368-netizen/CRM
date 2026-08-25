import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Phone, CalendarClock, TrendingUp, AlertTriangle, FileText,
  GraduationCap, CalendarDays,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, users, calls } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';

const cardStyle = 'rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl';

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
    return Object.entries(perf).map(([id, data]) => {
      const counsellorObj = users.find(u => u.id === id);
      return {
        name: counsellorObj?.name?.split(' ')[0] || id,
        ...data,
        conversion: data.leads > 0 ? Math.round((data.enrolled / data.leads) * 100) : 0,
      };
    }).sort((a, b) => b.leads - a.leads).slice(0, 6);
  }, []);

  const activeUser = currentUser || users[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Leader Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{greeting}, {activeUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-xs font-bold text-slate-400">
          <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />
          {formatDate(new Date())} &bull; Team performance & conversion tracking
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Team Managed Leads" value={teamLeads.length} change={10} changeType="up" icon={Users} color="primary" />
        <KPICard title="Team Calls Made" value={totalCalls} change={8} changeType="up" icon={Phone} color="blue" />
        <KPICard title="Connected Calls" value={connectedCalls} change={12} changeType="up" icon={CalendarClock} color="success" />
        <KPICard title="Team Conv. Rate" value={convRate} change={5} changeType="up" icon={TrendingUp} color="warning" suffix="%" />
      </div>

      {/* Counsellor Chart & Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Counsellor Conversion Comparison</h3>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={counsellorPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="leads" fill="#FFA116" radius={[4, 4, 0, 0]} name="Leads" />
                <Bar dataKey="enrolled" fill="#2CBB5D" radius={[4, 4, 0, 0]} name="Enrolled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Team Leader Performance Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Top Counsellors Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Counsellor</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Leads</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Calls</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Enrolled</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E3E3E]">
                {counsellorPerf.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#303030] transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3.5 text-[#FFA116] font-mono font-bold whitespace-nowrap">{c.leads}</td>
                    <td className="px-4 py-3.5 text-white font-bold whitespace-nowrap">{c.calls}</td>
                    <td className="px-4 py-3.5 text-[#2CBB5D] font-extrabold whitespace-nowrap">{c.enrolled}</td>
                    <td className="px-4 py-3.5 text-[#FFA116] font-mono font-bold whitespace-nowrap">{c.conversion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

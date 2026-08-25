import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, IndianRupee, Megaphone, CalendarDays,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, campaigns } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';

const COLORS = ['#FFA116', '#2CBB5D', '#007AFF', '#FFB800', '#FF2D55', '#38BDF8'];
const cardStyle = 'rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl transition-all duration-200';

export default function MarketingDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.leadScore > 50).length;
  const enrolled = leads.filter((l) => l.status === 'enrolled').length;
  const totalSpend = campaigns.reduce((s, c) => s + (c.spent || 50000), 0);
  const totalRevenue = enrolled * 85000;
  const cpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
  const roi = totalSpend > 0 ? Math.round(((totalRevenue - totalSpend) / totalSpend) * 100) : 0;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, []);

  const activeUser = currentUser || users[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Marketing & Campaign Overview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{greeting}, {activeUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-xs font-bold text-slate-400">
          <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />
          {formatDate(new Date())} &bull; Active marketing campaign metrics
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Spend" value={totalSpend} change={8} changeType="up" icon={IndianRupee} color="warning" prefix="₹" />
        <KPICard title="Leads Acquired" value={totalLeads} change={14} changeType="up" icon={Users} color="primary" />
        <KPICard title="Avg. Cost / Lead" value={cpl} change={5} changeType="down" icon={IndianRupee} color="blue" prefix="₹" />
        <KPICard title="Campaign ROI" value={roi} change={12} changeType="up" icon={Megaphone} color="success" suffix="%" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Source Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Lead Source Breakdown</h3>
          </div>
          <div className="p-6 flex items-center justify-around gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={4}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {sourceData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between bg-[#1A1A1A] p-2.5 rounded-lg border border-[#3E3E3E]">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-white">{s.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-300 font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Campaign List */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Campaign Performance</h3>
          </div>
          <div className="p-4 space-y-3">
            {campaigns.slice(0, 4).map((c) => (
              <div key={c.id} className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#3E3E3E] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{c.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Spend: {formatCurrency(c.spent)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#FFA116] font-mono">{c.leadsCount} Leads</p>
                  <p className="text-[10px] font-bold text-[#2CBB5D]">{c.conversionsCount} Converted</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

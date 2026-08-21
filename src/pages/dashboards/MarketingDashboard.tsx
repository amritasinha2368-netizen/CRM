import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, IndianRupee, Target, Megaphone, BarChart3,
  CalendarDays, Eye, MousePointer2, Globe, Camera, MessageCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, campaigns } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';

const COLORS = ['#7b1fa2', '#1e88e5', '#f9a825', '#e53935', '#8e24aa', '#00897b'];
const card = 'rounded-2xl border border-surface-200/60 bg-white shadow-sm hover:shadow-lg transition-all duration-300';
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MarketingDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.leadScore > 50).length;
  const totalApps = leads.filter((l) => l.status === 'application').length;
  const enrolled = leads.filter((l) => l.status === 'enrolled').length;
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
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
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, []);

  const campaignPerformance = campaigns.map((c) => ({
    name: c.name.length > 15 ? c.name.slice(0, 14) + '…' : c.name,
    leads: c.leadsCount,
    spend: c.spend,
  }));

  const sourceIcons: Record<string, any> = {
    google_ads: Globe, meta_ads: Eye,     instagram: Camera, website: MousePointer2,
    referral: Users, walk_in: Globe, whatsapp: MessageCircle, landing_page: MousePointer2,
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-r from-blue-50 via-white to-primary-50 p-6 border border-surface-200/60">
        <div className="flex items-center gap-2 mb-1"><Megaphone className="h-4 w-4 text-blue-600" /><span className="text-xs font-bold uppercase tracking-widest text-blue-600/60">Marketing Admin</span></div>
        <h1 className="text-2xl font-extrabold text-surface-900">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-surface-500"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />{formatDate(new Date())} &bull; Campaign overview</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}><KPICard title="New Leads" value={totalLeads} change={12} changeType="up" icon={Users} color="primary" /></motion.div>
        <motion.div variants={item}><KPICard title="Qualified Leads" value={qualifiedLeads} change={8} changeType="up" icon={Target} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Cost Per Lead" value={cpl} change={5} changeType="down" icon={IndianRupee} color="warning" prefix="₹" /></motion.div>
        <motion.div variants={item}><KPICard title="Campaign ROI" value={roi} change={15} changeType="up" icon={TrendingUp} color="success" suffix="%" /></motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Lead Sources</h3></div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Campaign Performance</h3></div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={campaignPerformance} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="leads" fill="#1e88e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Campaign Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-semibold text-surface-700 mb-4">Active Campaigns</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.slice(0, 6).map((c, i) => {
            const Icon = sourceIcons[c.source] || Globe;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }} whileHover={{ y: -4 }} className="rounded-xl border border-surface-200/60 bg-white p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center"><Icon className="h-4 w-4 text-blue-600" /></div>
                  <div className="min-w-0 flex-1"><p className="text-sm font-bold text-surface-900 truncate">{c.name}</p><p className="text-xs text-surface-400 capitalize">{c.source.replace('_', ' ')}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-lg font-black text-surface-900">{c.leadsCount}</p><p className="text-[10px] text-surface-400">Leads</p></div>
                  <div><p className="text-lg font-black text-surface-900">₹{(c.spend / 1000).toFixed(0)}K</p><p className="text-[10px] text-surface-400">Spend</p></div>
                  <div><p className="text-lg font-black text-primary-600">{c.leadsCount > 0 ? Math.round(c.spend / c.leadsCount) : 0}</p><p className="text-[10px] text-surface-400">CPL</p></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Flame, FileText, GraduationCap, IndianRupee,
  TrendingUp, Phone, CalendarDays, Plus, Upload, MessageSquare,
  FileBarChart, ArrowRight, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, courses, applications, payments, calls } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';

const CHART_COLORS = ['#FFA116', '#2CBB5D', '#007AFF', '#FFB800', '#FF2D55', '#38BDF8', '#E08800'];

const funnelStages = ['new', 'contacted', 'interested', 'counselling', 'application', 'enrolled'] as const;
const funnelLabels: Record<string, string> = {
  new: 'New Lead', contacted: 'Contacted', interested: 'Interested',
  counselling: 'Counselling', application: 'Application', enrolled: 'Enrolled',
};

const cardStyle = 'rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl';
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const hotLeads = leads.filter((l) => l.leadScore > 70).length;
  const totalApps = applications.length;
  const enrolled = applications.filter((a) => a.status === 'enrolled').length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const convRate = totalLeads > 0 ? Math.round((enrolled / totalLeads) * 100 * 10) / 10 : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCalls = calls.filter((c) => c.startTime.startsWith(todayStr)).length;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const leadTrend = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { name: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }), leads: Math.floor(Math.random() * 12) + 5 };
    });
  }, []);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => { const src = l.source.replace('_', ' ').toUpperCase(); counts[src] = (counts[src] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const funnelData = useMemo(() => funnelStages.map((s) => ({ stage: funnelLabels[s], count: leads.filter((l) => l.status === s).length })), []);

  const courseAdmissions = useMemo(() => courses.map((c) => ({
    name: c.name.length > 15 ? c.name.slice(0, 14) + '…' : c.name,
    count: applications.filter((a) => a.courseId === c.id && a.status === 'enrolled').length,
  })), []);

  const counsellorPerf = useMemo(() => {
    const perf: Record<string, number> = {};
    leads.forEach((l) => { if (l.assignedTo) perf[l.assignedTo] = (perf[l.assignedTo] || 0) + 1; });
    return Object.entries(perf).map(([id, count]) => ({ name: id, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, []);

  const revenueTrend = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({
    month: m, revenue: Math.floor(Math.random() * 300000) + 200000 + i * 50000,
  })), []);

  const recentLeads = useMemo(() => [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5), []);

  const maxFunnel = Math.max(...funnelData.map((f) => f.count), 1);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 sm:p-8 shadow-xl"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-[#FFA116]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">QuantNexa AI CRM &bull; Super Admin Intelligence Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {greeting}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="mt-1 text-xs font-bold text-slate-400">
              <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-[#FFA116]" />
              {formatDate(new Date())} &bull; System performance & metrics overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#383838] hover:text-[#FFA116] transition-all cursor-pointer"
            >
              <FileBarChart className="h-4 w-4 text-[#FFA116]" />
              View Reports
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="flex items-center gap-2 rounded-lg bg-[#FFA116] hover:bg-[#E08800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}><KPICard title="Total Leads" value={totalLeads} change={12} changeType="up" icon={Users} color="primary" /></motion.div>
        <motion.div variants={item}><KPICard title="New Leads" value={newLeads} change={8} changeType="up" icon={UserPlus} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Hot Leads" value={hotLeads} change={15} changeType="up" icon={Flame} color="warning" /></motion.div>
        <motion.div variants={item}><KPICard title="Applications" value={totalApps} change={10} changeType="up" icon={FileText} color="primary" /></motion.div>
        <motion.div variants={item}><KPICard title="Admissions" value={enrolled} change={20} changeType="up" icon={GraduationCap} color="success" /></motion.div>
        <motion.div variants={item}><KPICard title="Revenue" value={totalRevenue} change={18} changeType="up" icon={IndianRupee} color="success" prefix="₹" /></motion.div>
        <motion.div variants={item}><KPICard title="Conversion Rate" value={convRate} change={5} changeType="up" icon={TrendingUp} color="primary" suffix="%" /></motion.div>
        <motion.div variants={item}><KPICard title="Calls Today" value={todayCalls} change={0} changeType="neutral" icon={Phone} color="blue" /></motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Lead Acquisition Trend</h3></div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={leadTrend}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA116" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFA116" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="leads" stroke="#FFA116" strokeWidth={2.5} fill="url(#leadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Lead Source Distribution</h3></div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3}>
                  {sourceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Conversion Funnel</h3></div>
          <div className="p-5">
            <div className="space-y-3">
              {funnelData.map((f, i) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-bold text-white">{f.stage}</span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#3E3E3E]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(f.count / maxFunnel) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                      className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-[#FFA116] to-[#E08800]"
                    />
                    <span className="relative z-10 flex h-full items-center px-3 text-xs font-mono font-black text-white">{f.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Course-wise Admissions</h3></div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={courseAdmissions} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {courseAdmissions.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Leads + Quick Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={cn(cardStyle, 'lg:col-span-2')}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Recent Leads</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Name</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Course</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E3E3E]">
                {recentLeads.map((lead) => {
                  const course = courses.find((c) => c.id === lead.courseId);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#303030] transition-colors cursor-pointer"
                      onClick={() => navigate('/leads')}
                    >
                      <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">{lead.name}</td>
                      <td className="px-5 py-3.5 text-slate-300 font-medium text-xs whitespace-nowrap">{course?.name ?? '—'}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={lead.status} type="lead" /></td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs uppercase font-mono whitespace-nowrap">{lead.source.replace('_', ' ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Quick Actions</h3></div>
          <div className="p-5 space-y-2.5">
            {[
              { label: 'Add New Lead', icon: Plus, href: '/leads' },
              { label: 'Import Leads', icon: Upload, href: '/leads' },
              { label: 'Broadcast Message', icon: MessageSquare, href: '/campaigns' },
              { label: 'Generate Reports', icon: FileBarChart, href: '/reports' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.href)}
                className="flex w-full items-center gap-3 rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] p-3 text-left transition-all hover:border-[#FFA116] hover:bg-[#303030] cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#282828] text-[#FFA116] border border-[#3E3E3E] group-hover:bg-[#FFA116] group-hover:text-[#1A1A1A] transition-colors">
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-xs font-bold text-white">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#FFA116] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

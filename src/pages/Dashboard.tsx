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

const CHART_COLORS = ['#7b1fa2', '#9c27b0', '#ba68c8', '#1e88e5', '#f9a825', '#e53935', '#8e24aa'];

const funnelStages = ['new', 'contacted', 'interested', 'counselling', 'application', 'enrolled'] as const;
const funnelLabels: Record<string, string> = {
  new: 'New', contacted: 'Contacted', interested: 'Interested',
  counselling: 'Counselling', application: 'Application', enrolled: 'Enrolled',
};

const card = 'rounded-2xl border border-surface-200/60 bg-white shadow-sm hover:shadow-lg hover:shadow-surface-900/5 transition-all duration-300';
const cardHeader = 'px-6 py-4 border-b border-surface-100';
const cardBody = 'p-6';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const hotLeads = leads.filter((l) => l.leadScore > 70).length;
  const totalApps = applications.length;
  const enrolled = applications.filter((a) => a.status === 'enrolled').length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.paidAmount, 0);
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
    leads.forEach((l) => { const src = l.source.replace('_', ' '); counts[src] = (counts[src] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
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

  return (
    <div className="space-y-6 p-6">
      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl gradient-hero p-6 sm:p-8"
      >
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(156,39,176,0.3), transparent)' }}
        />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700/60">Welcome back</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900">
              {greeting}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="mt-1.5 text-sm text-surface-600">
              <CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />
              {formatDate(new Date())} &bull; Here's what's happening today
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2.5 text-sm font-bold text-surface-700 backdrop-blur-sm ring-1 ring-white/60 transition-all hover:bg-white/80 hover:shadow-lg">
              <FileBarChart className="h-4 w-4" />
              View Reports
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-700 shadow-lg shadow-primary-500/10 transition-all hover:shadow-xl hover:shadow-primary-500/20">
              <Plus className="h-4 w-4" />
              Add Lead
            </motion.button>
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Lead Acquisition Trend</h3></div>
          <div className={cardBody}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={leadTrend}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b1fa2" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7b1fa2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: 'white' }} />
                <Area type="monotone" dataKey="leads" stroke="#7b1fa2" strokeWidth={2} fill="url(#leadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Lead Source Distribution</h3></div>
          <div className={cardBody}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3}>
                  {sourceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: 'white' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Conversion Funnel</h3></div>
          <div className={cardBody}>
            <div className="space-y-3">
              {funnelData.map((f, i) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium text-surface-600">{f.stage}</span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-surface-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(f.count / maxFunnel) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{ background: `linear-gradient(90deg, ${CHART_COLORS[i]}, ${CHART_COLORS[i]}dd)` }}
                    />
                    <span className="relative z-10 flex h-full items-center px-3 text-xs font-bold text-white">{f.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Course-wise Admissions</h3></div>
          <div className={cardBody}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={courseAdmissions} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: 'white' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {courseAdmissions.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Counsellor Performance</h3></div>
          <div className={cardBody}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={counsellorPerf} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={50} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: 'white' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {counsellorPerf.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Revenue Trend</h3></div>
          <div className={cardBody}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: 'white' }} formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#9c27b0" strokeWidth={2.5} dot={{ r: 4, fill: '#9c27b0' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Leads + Quick Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={cn(card, 'lg:col-span-2')}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Recent Leads</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs font-medium text-surface-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {recentLeads.map((lead, i) => {
                  const course = courses.find((c) => c.id === lead.courseId);
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      className="hover:bg-surface-50 transition-colors cursor-pointer"
                      onClick={() => navigate('/leads')}
                    >
                      <td className="px-5 py-3 font-medium text-surface-800">{lead.name}</td>
                      <td className="px-5 py-3 text-surface-600">{course?.name ?? '—'}</td>
                      <td className="px-5 py-3"><StatusBadge status={lead.status} type="lead" /></td>
                      <td className="px-5 py-3 text-surface-500 capitalize">{lead.source.replace('_', ' ')}</td>
                      <td className="px-5 py-3 text-surface-500">{lead.assignedTo ?? '—'}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className={card}>
          <div className={cardHeader}><h3 className="text-sm font-semibold text-surface-700">Quick Actions</h3></div>
          <div className={cardBody}>
            <div className="space-y-2.5">
              {[
                { label: 'Add Lead', icon: Plus, href: '/leads', color: 'text-primary-600 bg-primary-50' },
                { label: 'Import Leads', icon: Upload, href: '/leads', color: 'text-accent-600 bg-accent-50' },
                { label: 'Send Bulk Message', icon: MessageSquare, href: '/campaigns', color: 'text-success-600 bg-success-50' },
                { label: 'Generate Report', icon: FileBarChart, href: '/reports', color: 'text-warning-600 bg-warning-50' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="flex w-full items-center gap-3 rounded-xl border border-surface-200 p-3 text-left transition-all hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-sm group"
                >
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', action.color)}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-surface-700 group-hover:text-primary-700">{action.label}</span>
                  <ArrowRight className="h-4 w-4 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

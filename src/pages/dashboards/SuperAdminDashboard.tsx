import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Flame, FileText, GraduationCap, IndianRupee,
  TrendingUp, Phone, CalendarDays, Plus, Activity, Shield,
  AlertTriangle, Clock, UserCheck, BookOpen, BarChart3,
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, courses, applications, payments, calls, users } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';

const COLORS = ['#7b1fa2', '#9c27b0', '#ba68c8', '#1e88e5', '#f9a825', '#e53935', '#8e24aa'];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const card = 'rounded-2xl border border-surface-200/60 bg-white shadow-sm hover:shadow-lg transition-all duration-300';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);

  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.leadScore > 70).length;
  const totalApps = applications.length;
  const enrolled = applications.filter((a) => a.status === 'enrolled').length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const convRate = totalLeads > 0 ? Math.round((enrolled / totalLeads) * 100 * 10) / 10 : 0;
  const activeUsers = users.length;
  const pendingFollowups = leads.filter((l) => l.status === 'contacted' || l.status === 'interested').length;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const leadTrend = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { name: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }), leads: Math.floor(Math.random() * 12) + 5 };
  }), []);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, []);

  const revenueTrend = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({
    month: m, revenue: Math.floor(Math.random() * 300000) + 200000 + i * 50000,
  })), []);

  const recentActivities = [
    { icon: UserPlus, text: 'New lead Priya Gupta registered', time: '2 min ago', color: 'text-primary-600 bg-primary-50' },
    { icon: Phone, text: 'Call completed with Aarav Mehta — Score: 87', time: '15 min ago', color: 'text-blue-600 bg-blue-50' },
    { icon: GraduationCap, text: 'Admission confirmed — Rohan Verma', time: '1 hr ago', color: 'text-emerald-600 bg-emerald-50' },
    { icon: AlertTriangle, text: '3 leads overdue for follow-up', time: '2 hr ago', color: 'text-amber-600 bg-amber-50' },
    { icon: Shield, text: 'Security: New login from Chrome/Mumbai', time: '3 hr ago', color: 'text-violet-600 bg-violet-50' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl gradient-hero p-6 sm:p-8">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-primary-700/60" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700/60">Super Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="mt-1.5 text-sm text-surface-600"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />{formatDate(new Date())} &bull; System overview</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}><KPICard title="Total Leads" value={totalLeads} change={12} changeType="up" icon={Users} color="primary" /></motion.div>
        <motion.div variants={item}><KPICard title="Hot Leads" value={hotLeads} change={15} changeType="up" icon={Flame} color="warning" /></motion.div>
        <motion.div variants={item}><KPICard title="Applications" value={totalApps} change={10} changeType="up" icon={FileText} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Admissions" value={enrolled} change={20} changeType="up" icon={GraduationCap} color="success" /></motion.div>
        <motion.div variants={item}><KPICard title="Revenue" value={totalRevenue} change={18} changeType="up" icon={IndianRupee} color="success" prefix="₹" /></motion.div>
        <motion.div variants={item}><KPICard title="Conversion Rate" value={convRate} change={5} changeType="up" icon={TrendingUp} color="primary" suffix="%" /></motion.div>
        <motion.div variants={item}><KPICard title="Active Users" value={activeUsers} change={3} changeType="up" icon={UserCheck} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Pending Follow-ups" value={pendingFollowups} change={0} changeType="neutral" icon={Clock} color="warning" /></motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Lead Growth</h3></div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={leadTrend}>
                <defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7b1fa2" stopOpacity={0.2} /><stop offset="95%" stopColor="#7b1fa2" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" stroke="#7b1fa2" strokeWidth={2} fill="url(#lg1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Revenue Trend</h3></div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#9c27b0" strokeWidth={2.5} dot={{ r: 4, fill: '#9c27b0' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* System Health + Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cn(card, 'lg:col-span-2')}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Recent Activity</h3></div>
          <div className="p-4">
            {recentActivities.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', a.color)}><a.icon className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-surface-800 truncate">{a.text}</p></div>
                <span className="text-xs text-surface-400 shrink-0">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">System Health</h3></div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Active Users', value: activeUsers, max: 15, color: 'bg-primary-500' },
              { label: 'Server Uptime', value: 99, max: 100, color: 'bg-emerald-500', suffix: '%' },
              { label: 'API Response', value: 45, max: 200, color: 'bg-blue-500', suffix: 'ms' },
              { label: 'Storage Used', value: 67, max: 100, color: 'bg-amber-500', suffix: '%' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-surface-600">{s.label}</span>
                  <span className="font-bold text-surface-800">{s.value}{s.suffix || ''}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.value / s.max) * 100}%` }} transition={{ duration: 1, delay: 0.5 }} className={cn('h-full rounded-full', s.color)} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

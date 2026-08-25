import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Flame, FileText, GraduationCap, IndianRupee,
  TrendingUp, Phone, CalendarDays, Shield, AlertTriangle, Clock, UserCheck,
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, applications, payments, users } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';

const COLORS = ['#FFA116', '#2CBB5D', '#007AFF', '#FF2D55', '#FFB800'];
const cardStyle = 'rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-lg transition-all duration-200';

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
    return { name: d.toLocaleDateString('en-IN', { weekday: 'short' }), leads: Math.floor(Math.random() * 12) + 5 };
  }), []);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, []);

  const activeUser = currentUser || users[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Greeting Banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Super Admin Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{greeting}, {activeUser.name.split(' ')[0]} 👋</h1>
            <p className="mt-1 text-xs font-medium text-slate-400"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />{formatDate(new Date())} &bull; Realtime admissions metrics</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Leads" value={totalLeads} change={12} changeType="up" icon={Users} color="primary" />
        <KPICard title="Hot Leads" value={hotLeads} change={15} changeType="up" icon={Flame} color="warning" />
        <KPICard title="Applications" value={totalApps} change={10} changeType="up" icon={FileText} color="blue" />
        <KPICard title="Admissions" value={enrolled} change={20} changeType="up" icon={GraduationCap} color="success" />
        <KPICard title="Revenue" value={totalRevenue} change={18} changeType="up" icon={IndianRupee} color="success" prefix="₹" />
        <KPICard title="Conversion Rate" value={convRate} change={5} changeType="up" icon={TrendingUp} color="primary" suffix="%" />
        <KPICard title="Active Users" value={activeUsers} change={3} changeType="up" icon={UserCheck} color="blue" />
        <KPICard title="Pending Follow-ups" value={pendingFollowups} change={0} changeType="neutral" icon={Clock} color="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Lead Acquisition Trend</h3></div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={leadTrend}>
                <defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FFA116" stopOpacity={0.4} /><stop offset="95%" stopColor="#FFA116" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="leads" stroke="#FFA116" strokeWidth={2.5} fillOpacity={1} fill="url(#lg1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]"><h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Lead Source Distribution</h3></div>
          <div className="p-5 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

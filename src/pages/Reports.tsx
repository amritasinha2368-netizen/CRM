import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Phone, FileText, IndianRupee,
  Download, Calendar, ChevronDown, Target, PieChart as PieIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import {
  leads, calls, applications, payments, campaigns, users, courses
} from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

const reportCategories = [
  { id: 'lead_funnel', label: 'Lead Funnel', icon: Target, color: 'bg-primary-100 text-primary-600' },
  { id: 'lead_source', label: 'Lead Source', icon: PieIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 'campaign_roi', label: 'Campaign ROI', icon: TrendingUp, color: 'bg-success-100 text-success-600' },
  { id: 'counsellor', label: 'Counsellor Performance', icon: Users, color: 'bg-warning-100 text-warning-600' },
  { id: 'call', label: 'Call Performance', icon: Phone, color: 'bg-danger-100 text-danger-600' },
  { id: 'application', label: 'Application', icon: FileText, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'admission', label: 'Admission', icon: Target, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'revenue', label: 'Revenue', icon: IndianRupee, color: 'bg-purple-100 text-purple-600' },
];

export default function Reports() {
  const { currentUser } = useAppStore();
  const [activeReport, setActiveReport] = useState('lead_funnel');
  const [datePreset, setDatePreset] = useState('this_month');
  const [showCustomDate, setShowCustomDate] = useState(false);

  const leadFunnelData = useMemo(() => {
    const statuses = ['new', 'assigned', 'contacted', 'interested', 'counselling', 'visit', 'application', 'documents', 'payment', 'enrolled'];
    return statuses.map(s => ({
      name: s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: leads.filter(l => l.status === s).length,
    }));
  }, []);

  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  }, []);

  const counsellorData = useMemo(() => {
    return users.filter(u => u.role === 'counsellor').map(u => {
      const assignedLeads = leads.filter(l => l.assignedTo === u.id);
      const counsellorCalls = calls.filter(c => c.counsellorId === u.id);
      const connectedCalls = counsellorCalls.filter(c => c.disposition === 'Connected');
      const enrolled = assignedLeads.filter(l => l.status === 'enrolled').length;
      return {
        name: u.name.split(' ')[0],
        leads: assignedLeads.length,
        calls: counsellorCalls.length,
        connected: connectedCalls.length,
        enrolled,
        rate: assignedLeads.length > 0 ? Math.round((enrolled / assignedLeads.length) * 100) : 0,
      };
    });
  }, []);

  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, i) => ({
      name: m,
      revenue: Math.floor(Math.random() * 300000) + 150000,
      collected: Math.floor(Math.random() * 250000) + 100000,
    }));
  }, []);

  const courseAdmissions = useMemo(() => {
    return courses.map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      applications: applications.filter(a => a.courseId === c.id).length,
      enrolled: applications.filter(a => a.courseId === c.id && a.status === 'enrolled').length,
    }));
  }, []);

  const callDispositionData = useMemo(() => {
    const map: Record<string, number> = {};
    calls.forEach(c => { map[c.disposition] = (map[c.disposition] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, []);

  const avgCallDuration = calls.length > 0 ? Math.round(calls.reduce((s, c) => s + c.duration, 0) / calls.length) : 0;
  const connectedRate = calls.length > 0 ? Math.round((calls.filter(c => c.disposition === 'Connected').length / calls.length) * 100) : 0;

  const handleExport = (format: string) => {
    toast.success(`Exporting report as ${format.toUpperCase()}`);
  };

  const renderReport = () => {
    switch (activeReport) {
      case 'lead_funnel':
        return (
          <div className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {leadFunnelData.slice(0, 5).map((d, i) => (
                <div key={d.name} className="rounded-lg bg-surface-50 p-3 text-center">
                  <p className="text-xl font-bold text-surface-900">{d.count}</p>
                  <p className="text-[10px] text-surface-500">{d.name}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'lead_source':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'counsellor':
        return (
          <div className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={counsellorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="calls" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="enrolled" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Counsellor</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Leads</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Calls</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Connected</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Enrolled</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-surface-500">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {counsellorData.map((c, i) => (
                    <tr key={i} className="border-b border-surface-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-surface-900">{c.name}</td>
                      <td className="px-4 py-3 text-surface-700">{c.leads}</td>
                      <td className="px-4 py-3 text-surface-700">{c.calls}</td>
                      <td className="px-4 py-3 text-surface-700">{c.connected}</td>
                      <td className="px-4 py-3 text-surface-700">{c.enrolled}</td>
                      <td className="px-4 py-3"><span className={cn('font-medium', c.rate >= 20 ? 'text-success-600' : c.rate >= 10 ? 'text-warning-600' : 'text-danger-600')}>{c.rate}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'call':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-surface-50 p-4 text-center">
                <p className="text-2xl font-bold text-surface-900">{calls.length}</p>
                <p className="text-xs text-surface-500">Total Calls</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-4 text-center">
                <p className="text-2xl font-bold text-success-600">{connectedRate}%</p>
                <p className="text-xs text-surface-500">Connection Rate</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-4 text-center">
                <p className="text-2xl font-bold text-primary-600">{Math.floor(avgCallDuration / 60)}m {avgCallDuration % 60}s</p>
                <p className="text-xs text-surface-500">Avg Duration</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callDispositionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${(v / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="collected" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'admission':
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseAdmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enrolled" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-surface-400">Report data will be displayed here</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Reports & Analytics</h1>
          <p className="text-sm text-surface-500">Comprehensive business intelligence dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={datePreset} onChange={e => setDatePreset(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <div className="flex items-center gap-1">
            <button onClick={() => handleExport('csv')} className="inline-flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-600 hover:bg-surface-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
            <button onClick={() => handleExport('excel')} className="inline-flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-600 hover:bg-surface-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Excel
            </button>
            <button onClick={() => handleExport('pdf')} className="inline-flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-600 hover:bg-surface-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {reportCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setActiveReport(cat.id)}
              className={cn(
                'rounded-xl border p-3 text-center transition-all duration-200',
                activeReport === cat.id
                  ? 'border-primary-300 bg-primary-50 ring-1 ring-primary-200'
                  : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm'
              )}
            >
              <div className={cn('mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg', cat.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-medium text-surface-700">{cat.label}</p>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-surface-200 bg-white p-5"
      >
        <h3 className="text-sm font-semibold text-surface-900 mb-4">
          {reportCategories.find(c => c.id === activeReport)?.label} Report
        </h3>
        {renderReport()}
      </motion.div>
    </div>
  );
}

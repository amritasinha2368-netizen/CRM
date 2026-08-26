import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Phone, FileText, IndianRupee,
  Download, Target, PieChart as PieIcon, GraduationCap, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  leads, calls, applications, campaigns, users, courses
} from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const LEETCODE_COLORS = ['#FFA116', '#2CBB5D', '#007AFF', '#FFB800', '#FF2D55', '#38BDF8', '#E08800'];

const reportCategories = [
  { id: 'lead_funnel', label: 'Lead Funnel', icon: Target },
  { id: 'lead_source', label: 'Lead Source', icon: PieIcon },
  { id: 'campaign_roi', label: 'Campaign ROI', icon: TrendingUp },
  { id: 'counsellor', label: 'Counsellor Perf.', icon: Users },
  { id: 'call', label: 'Call Quality', icon: Phone },
  { id: 'application', label: 'Applications', icon: FileText },
  { id: 'admission', label: 'Admissions', icon: GraduationCap },
  { id: 'revenue', label: 'Revenue', icon: IndianRupee },
];

const stageLabels: Record<string, string> = {
  new: 'New Lead',
  assigned: 'Assigned Counsellor',
  contacted: 'Contacted Lead',
  interested: 'Interested Student',
  counselling: 'Counselling Session',
  visit: 'Visited Campus / Portal',
  application: 'Application Submitted',
  documents: 'Documents Verified',
  payment: 'Payment Pending',
  enrolled: 'Student Enrolled',
};

export default function Reports() {
  const [activeReport, setActiveReport] = useState('lead_funnel');
  const [datePreset, setDatePreset] = useState('this_month');

  const leadFunnelData = useMemo(() => {
    const statuses = ['new', 'assigned', 'contacted', 'interested', 'counselling', 'visit', 'application', 'documents', 'payment', 'enrolled'];
    return statuses.map(s => ({
      name: stageLabels[s] || s,
      count: leads.filter(l => l.status === s).length,
    }));
  }, []);

  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, ' ').toUpperCase(), value }));
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
      revenue: Math.floor(Math.random() * 300000) + 200000 + i * 40000,
      collected: Math.floor(Math.random() * 250000) + 150000 + i * 35000,
    }));
  }, []);

  const courseAdmissions = useMemo(() => {
    return courses.map(c => ({
      name: c.name.length > 18 ? c.name.substring(0, 18) + '...' : c.name,
      applications: applications.filter(a => a.courseId === c.id).length,
      enrolled: applications.filter(a => a.courseId === c.id && a.status === 'enrolled').length,
    }));
  }, []);

  const callDispositionData = useMemo(() => {
    const map: Record<string, number> = {};
    calls.forEach(c => { map[c.disposition] = (map[c.disposition] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, []);

  const campaignRoiData = useMemo(() => {
    return campaigns.map(c => ({
      name: c.name,
      spend: c.spent,
      leads: c.leadsCount,
      costPerLead: Math.round(c.spent / (c.leadsCount || 1)),
      conversions: c.conversionsCount,
    }));
  }, []);

  const avgCallDuration = calls.length > 0 ? Math.round(calls.reduce((s, c) => s + c.duration, 0) / calls.length) : 0;
  const connectedRate = calls.length > 0 ? Math.round((calls.filter(c => c.disposition === 'Connected').length / calls.length) * 100) : 0;

  const handleExport = (format: string) => {
    toast.success(`Exporting report as ${format.toUpperCase()}`);
  };

const FUNNEL_BAR_COLORS = [
  '#00B4D8', // 1. Sky Blue (New Lead)
  '#9D4EDD', // 2. Electric Purple (Assigned Counsellor)
  '#06D6A0', // 3. Mint Cyan (Contacted Lead)
  '#FFD166', // 4. Bright Yellow (Interested Student)
  '#F72585', // 5. Hot Magenta (Counselling Session)
  '#FF6B35', // 6. Deep Orange / Coral (Visited Campus)
  '#2EC4B6', // 7. Emerald Green (Application Submitted)
  '#4EA8DE', // 8. Royal Indigo (Documents Verified)
  '#7209B7', // 9. Violet Lavender (Payment Pending)
  '#38B000', // 10. Bright Spring Green (Student Enrolled)
];

const renderReport = () => {
    switch (activeReport) {
      case 'lead_funnel':
        return (
          <div className="space-y-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadFunnelData} layout="vertical" margin={{ left: 40, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#FFFFFF', fontWeight: 'bold' }} width={160} stroke="#3E3E3E" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                    {leadFunnelData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={FUNNEL_BAR_COLORS[index % FUNNEL_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-5">
              {leadFunnelData.slice(0, 5).map((d, idx) => (
                <div key={d.name} className="rounded-xl bg-[#1A1A1A] border border-[#3E3E3E] p-4 text-center hover:border-slate-500 transition-all">
                  <p className="text-2xl font-black font-mono" style={{ color: FUNNEL_BAR_COLORS[idx] }}>{d.count}</p>
                  <p className="text-xs font-bold text-white mt-1">{d.name}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-5">
              {leadFunnelData.slice(5).map((d, idx) => (
                <div key={d.name} className="rounded-xl bg-[#1A1A1A] border border-[#3E3E3E] p-4 text-center hover:border-slate-500 transition-all">
                  <p className="text-2xl font-black font-mono" style={{ color: FUNNEL_BAR_COLORS[idx + 5] }}>{d.count}</p>
                  <p className="text-xs font-bold text-white mt-1">{d.name}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'lead_source':
        return (
          <div className="space-y-6">
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ cx, cy, midAngle, outerRadius, name, value }: any) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 18;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');
                      return (
                        <text
                          x={x}
                          y={y}
                          fill={isLight ? '#0F172A' : '#FFFFFF'}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          className="text-[11px] font-black tracking-wide font-mono"
                        >
                          {`${name}: ${value}`}
                        </text>
                      );
                    }}
                    labelLine={{ stroke: typeof document !== 'undefined' && document.documentElement.classList.contains('light') ? '#475569' : '#94A3B8', strokeWidth: 1.5 }}
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={FUNNEL_BAR_COLORS[i % FUNNEL_BAR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sourceData.map((s, i) => (
                <div key={s.name} className="rounded-xl bg-[#1A1A1A] border border-[#3E3E3E] p-3.5 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: LEETCODE_COLORS[i % LEETCODE_COLORS.length] }} />
                  <div>
                    <p className="text-xs font-bold text-white">{s.name}</p>
                    <p className="text-sm font-black text-[#FFA116] font-mono">{s.value} Leads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'campaign_roi':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-[#3E3E3E] bg-[#1A1A1A]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Campaign Name</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Spend</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Leads Acquired</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Cost / Lead</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Conversions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3E3E3E]">
                  {campaignRoiData.map((c, i) => (
                    <tr key={i} className="hover:bg-[#282828] transition-colors">
                      <td className="px-4 py-3.5 font-bold text-white">{c.name}</td>
                      <td className="px-4 py-3.5 text-[#FFA116] font-mono font-bold">{formatCurrency(c.spend)}</td>
                      <td className="px-4 py-3.5 text-white font-bold">{c.leads}</td>
                      <td className="px-4 py-3.5 text-slate-300 font-mono">₹{c.costPerLead}</td>
                      <td className="px-4 py-3.5 text-[#2CBB5D] font-extrabold">{c.conversions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'counsellor':
        return (
          <div className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={counsellorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                  <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar dataKey="leads" fill="#FFA116" radius={[4, 4, 0, 0]} name="Assigned Leads" />
                  <Bar dataKey="calls" fill="#007AFF" radius={[4, 4, 0, 0]} name="Calls Made" />
                  <Bar dataKey="enrolled" fill="#2CBB5D" radius={[4, 4, 0, 0]} name="Enrolled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#3E3E3E] bg-[#1A1A1A]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Counsellor</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Leads</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Calls</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Connected</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Enrolled</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3E3E3E]">
                  {counsellorData.map((c, i) => (
                    <tr key={i} className="hover:bg-[#282828] transition-colors">
                      <td className="px-4 py-3.5 font-bold text-white">{c.name}</td>
                      <td className="px-4 py-3.5 text-white font-bold">{c.leads}</td>
                      <td className="px-4 py-3.5 text-white font-bold">{c.calls}</td>
                      <td className="px-4 py-3.5 text-slate-300">{c.connected}</td>
                      <td className="px-4 py-3.5 text-[#2CBB5D] font-extrabold">{c.enrolled}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('font-bold', c.rate >= 20 ? 'text-[#2CBB5D]' : c.rate >= 10 ? 'text-[#FFB800]' : 'text-[#FF2D55]')}>
                          {c.rate}%
                        </span>
                      </td>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#1A1A1A] border border-[#3E3E3E] p-4 text-center">
                <p className="text-3xl font-black text-white font-mono">{calls.length}</p>
                <p className="text-xs font-bold text-[#FFA116] uppercase mt-1">Total Logged Calls</p>
              </div>
              <div className="rounded-xl bg-[#1A1A1A] border border-[#3E3E3E] p-4 text-center">
                <p className="text-3xl font-black text-[#2CBB5D] font-mono">{connectedRate}%</p>
                <p className="text-xs font-bold text-[#2CBB5D] uppercase mt-1">Connection Rate</p>
              </div>
              <div className="rounded-xl bg-[#1A1A1A] border border-[#3E3E3E] p-4 text-center">
                <p className="text-3xl font-black text-[#007AFF] font-mono">{Math.floor(avgCallDuration / 60)}m {avgCallDuration % 60}s</p>
                <p className="text-xs font-bold text-[#007AFF] uppercase mt-1">Average Duration</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callDispositionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                  <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {callDispositionData.map((_, i) => (
                      <Cell key={`call-cell-${i}`} fill={FUNNEL_BAR_COLORS[i % FUNNEL_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2CBB5D" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2CBB5D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                  <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} stroke="#3E3E3E" />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#FFA116" strokeWidth={2.5} fill="#FFA116" fillOpacity={0.1} name="Total Billed" />
                  <Area type="monotone" dataKey="collected" stroke="#2CBB5D" strokeWidth={2.5} fill="url(#revGrad)" name="Cash Collected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'admission':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseAdmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E3E3E" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#FFFFFF', fontWeight: 'bold' }} stroke="#3E3E3E" />
                <YAxis tick={{ fontSize: 11, fill: '#A0A0A0' }} stroke="#3E3E3E" />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#3E3E3E', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="applications" fill="#007AFF" radius={[4, 4, 0, 0]} name="Applications" />
                <Bar dataKey="enrolled" fill="#2CBB5D" radius={[4, 4, 0, 0]} name="Enrolled Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Award className="h-10 w-10 text-[#FFA116] mb-2" />
            <p className="text-sm font-bold text-white">Report Analytics Dashboard</p>
            <p className="text-xs text-slate-400 mt-1">Select a category above to view detailed insights.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header & Controls */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Reports & Analytics</h1>
          <p className="text-xs font-medium text-slate-400 mt-1">Comprehensive Business Intelligence & Conversion Metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={datePreset}
            onChange={e => setDatePreset(e.target.value)}
            className="rounded-lg border border-[#3E3E3E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#FFA116] cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#3E3E3E] bg-[#282828] px-3 py-2 text-xs font-bold text-white hover:bg-[#383838] hover:text-[#FFA116] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#FFA116]" /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#3E3E3E] bg-[#282828] px-3 py-2 text-xs font-bold text-white hover:bg-[#383838] hover:text-[#FFA116] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#FFA116]" /> Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#3E3E3E] bg-[#282828] px-3 py-2 text-xs font-bold text-white hover:bg-[#383838] hover:text-[#FFA116] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#FFA116]" /> PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report Categories Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {reportCategories.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = activeReport === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setActiveReport(cat.id)}
              className={cn(
                'rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2',
                isActive
                  ? 'border-[#FFA116] bg-[#383838] text-white shadow-lg ring-1 ring-[#FFA116]/50'
                  : 'border-[#3E3E3E] bg-[#282828] text-slate-300 hover:border-[#555555] hover:bg-[#303030]'
              )}
            >
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                isActive ? 'bg-[#FFA116] text-[#1A1A1A] border-[#FFA116]' : 'bg-[#1A1A1A] text-[#FFA116] border-[#3E3E3E]'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold truncate w-full">{cat.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Main Report Container */}
      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#3E3E3E] pb-4">
          <h3 className="text-base font-extrabold text-white">
            {reportCategories.find(c => c.id === activeReport)?.label} Analytics
          </h3>
          <span className="text-xs font-mono font-bold text-[#FFA116]">
            Updated Just Now
          </span>
        </div>
        {renderReport()}
      </motion.div>
    </div>
  );
}

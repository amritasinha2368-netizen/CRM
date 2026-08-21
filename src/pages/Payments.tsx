import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee, TrendingUp, Clock, AlertTriangle, ChevronDown, ChevronUp,
  Filter, Download, Receipt, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { payments, leads, courses, applications } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';
import type { Payment } from '@/types';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Payments() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  const totalRevenue = payments.reduce((sum, p) => sum + p.totalFee, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = payments.reduce((sum, p) => sum + p.pendingAmount, 0);
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const filteredPayments = useMemo(() => {
    let result = [...payments];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => {
        const lead = leads.find(l => l.id === p.leadId);
        return lead?.name.toLowerCase().includes(q);
      });
    }
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }
    return result;
  }, [searchQuery, filterStatus]);

  const courseRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    payments.forEach(p => {
      const app = applications.find(a => a.id === p.applicationId);
      const course = courses.find(c => c.id === app?.courseId);
      if (course) {
        map[course.name] = (map[course.name] || 0) + p.paidAmount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, i) => ({
      name: m,
      revenue: Math.floor(Math.random() * 200000) + 100000,
      collected: Math.floor(Math.random() * 180000) + 80000,
    }));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Payments</h1>
          <p className="text-sm text-surface-500">Track revenue, payments and installments</p>
        </div>
        <button onClick={() => toast('Export feature coming soon')} className="inline-flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Revenue" value={totalRevenue} change={12} changeType="up" icon={IndianRupee} color="primary" prefix="₹" />
        <KPICard title="Collected" value={totalCollected} change={8} changeType="up" icon={TrendingUp} color="success" prefix="₹" />
        <KPICard title="Pending" value={totalPending} change={3} changeType="down" icon={Clock} color="warning" prefix="₹" />
        <KPICard title="Overdue" value={overdueCount} change={15} changeType="down" icon={AlertTriangle} color="danger" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Revenue by Course</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseRevenue} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {courseRevenue.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Monthly Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${(v / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-surface-900">Payment Records</h2>
          <div className="flex items-center gap-3">
            <SearchInput placeholder="Search by student..." value={searchQuery} onChange={setSearchQuery} className="w-64" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredPayments.map((payment, idx) => {
            const lead = leads.find(l => l.id === payment.leadId);
            const isExpanded = expandedPayment === payment.id;
            const nextDue = payment.installments.find(i => i.status === 'pending' || i.status === 'overdue');

            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.02 }}
                className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-surface-50/50 transition-colors" onClick={() => setExpandedPayment(isExpanded ? null : payment.id)}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <CreditCard className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-surface-900 truncate">{lead?.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-surface-400">
                      <span>Total: {formatCurrency(payment.totalFee)}</span>
                      <span>Paid: {formatCurrency(payment.paidAmount)}</span>
                      <span>Pending: {formatCurrency(payment.pendingAmount)}</span>
                    </div>
                  </div>
                  <StatusBadge status={payment.status} type="payment" />
                  {nextDue && (
                    <span className={cn('text-xs', nextDue.status === 'overdue' ? 'text-danger-600 font-medium' : 'text-surface-500')}>
                      Next: {formatDate(nextDue.dueDate)}
                    </span>
                  )}
                  <ChevronDown className={cn('h-4 w-4 text-surface-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-surface-100"
                    >
                      <div className="p-4 bg-surface-50/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold uppercase text-surface-500">Installments</h4>
                          <button onClick={() => toast('Receipt generation coming soon')} className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                            <Receipt className="h-3.5 w-3.5" /> Generate Receipt
                          </button>
                        </div>
                        <div className="space-y-2">
                          {payment.installments.map((inst, i) => (
                            <div key={inst.id} className="flex items-center gap-3 rounded-lg bg-white p-3 border border-surface-100">
                              <span className="text-xs text-surface-500">#{i + 1}</span>
                              <span className="text-sm font-medium text-surface-900 w-24">{formatCurrency(inst.amount)}</span>
                              <span className="text-xs text-surface-500">Due: {formatDate(inst.dueDate)}</span>
                              {inst.paidDate && <span className="text-xs text-success-600">Paid: {formatDate(inst.paidDate)}</span>}
                              {inst.method && <span className="text-xs text-surface-400">{inst.method}</span>}
                              <div className="ml-auto">
                                <StatusBadge status={inst.status} type="payment" />
                              </div>
                            </div>
                          ))}
                        </div>
                        {payment.scholarship > 0 && (
                          <div className="mt-3 text-xs text-success-600">
                            Scholarship applied: {formatCurrency(payment.scholarship)}
                          </div>
                        )}
                        {payment.discount > 0 && (
                          <div className="text-xs text-success-600">
                            Discount applied: {formatCurrency(payment.discount)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

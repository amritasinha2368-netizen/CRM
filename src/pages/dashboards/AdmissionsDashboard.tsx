import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, GraduationCap, IndianRupee, CreditCard, Clock, CheckCircle2,
  AlertTriangle, CalendarDays, Users, TrendingUp, Layers, Receipt,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { applications, payments } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';

const COLORS = ['#7b1fa2', '#f9a825', '#e53935'];
const card = 'rounded-2xl border border-surface-200/60 bg-white shadow-sm hover:shadow-lg transition-all duration-300';
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function AdmissionsDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const totalApps = applications.length;
  const pending = applications.filter((a) => a.status === 'pending').length;
  const verified = applications.filter((a) => a.status === 'under_review').length;
  const enrolled = applications.filter((a) => a.status === 'enrolled').length;
  const totalRevenue = payments.reduce((s, p) => s + p.totalAmount, 0);
  const collected = payments.reduce((s, p) => s + p.paidAmount, 0);
  const pendingFees = totalRevenue - collected;
  const overduePayments = payments.filter((p) => p.status === 'overdue').length;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const paymentStatus = [
    { name: 'Paid', value: payments.filter((p) => p.status === 'paid').length },
    { name: 'Pending', value: payments.filter((p) => p.status === 'pending').length },
    { name: 'Overdue', value: payments.filter((p) => p.status === 'overdue').length },
  ];

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-r from-rose-50 via-white to-pink-50 p-6 border border-surface-200/60">
        <div className="flex items-center gap-2 mb-1"><GraduationCap className="h-4 w-4 text-rose-600" /><span className="text-xs font-bold uppercase tracking-widest text-rose-600/60">Admissions & Finance</span></div>
        <h1 className="text-2xl font-extrabold text-surface-900">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-surface-500"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />{formatDate(new Date())} &bull; {pending} applications pending review</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}><KPICard title="Applications" value={totalApps} change={10} changeType="up" icon={FileText} color="blue" /></motion.div>
        <motion.div variants={item}><KPICard title="Pending Review" value={pending} change={0} changeType="neutral" icon={Clock} color="warning" /></motion.div>
        <motion.div variants={item}><KPICard title="Enrolled" value={enrolled} change={20} changeType="up" icon={GraduationCap} color="success" /></motion.div>
        <motion.div variants={item}><KPICard title="Total Revenue" value={totalRevenue} change={18} changeType="up" icon={IndianRupee} color="success" prefix="₹" /></motion.div>
        <motion.div variants={item}><KPICard title="Collected" value={collected} change={15} changeType="up" icon={CreditCard} color="primary" prefix="₹" /></motion.div>
        <motion.div variants={item}><KPICard title="Pending Fees" value={pendingFees} change={0} changeType="neutral" icon={Receipt} color="warning" prefix="₹" /></motion.div>
        <motion.div variants={item}><KPICard title="Overdue" value={overduePayments} change={0} changeType="neutral" icon={AlertTriangle} color="danger" /></motion.div>
        <motion.div variants={item}><KPICard title="Students" value={enrolled} change={12} changeType="up" icon={Users} color="blue" /></motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Applications */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Recent Applications</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-surface-100 text-xs font-medium text-surface-500">
                <th className="px-5 py-3">Student</th><th className="px-5 py-3">Course</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-surface-50">
                {applications.slice(0, 6).map((a, i) => (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }} className="hover:bg-surface-50 cursor-pointer">
                    <td className="px-5 py-3 font-medium text-surface-800">{a.studentName}</td>
                    <td className="px-5 py-3 text-surface-600 text-xs">{a.courseName}</td>
                    <td className="px-5 py-3"><span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', a.status === 'enrolled' ? 'bg-emerald-50 text-emerald-600' : a.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600')}>{a.status}</span></td>
                    <td className="px-5 py-3 text-xs text-surface-400">{new Date(a.submittedAt).toLocaleDateString('en-IN')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payment Status */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Payment Status</h3></div>
          <div className="p-6 flex items-center gap-8">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {paymentStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {paymentStatus.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-sm font-medium text-surface-600">{s.name}</span>
                  <span className="text-sm font-bold text-surface-900 ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Installments */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={card}>
        <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Upcoming Installments</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-surface-100 text-xs font-medium text-surface-500">
              <th className="px-5 py-3">Student</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Due Date</th><th className="px-5 py-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-surface-50">
              {payments.slice(0, 5).map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }} className="hover:bg-surface-50">
                  <td className="px-5 py-3 font-medium text-surface-800">{p.studentName}</td>
                  <td className="px-5 py-3 text-surface-600">{formatCurrency(p.paidAmount)}</td>
                  <td className="px-5 py-3 text-xs text-surface-400">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3"><span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : p.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}>{p.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

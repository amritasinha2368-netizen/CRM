import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, GraduationCap, IndianRupee, CreditCard, Clock,
  AlertTriangle, CalendarDays, Users, Receipt,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/store';
import { applications, payments, leads, courses } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';

const COLORS = ['#2CBB5D', '#FFA116', '#FF2D55'];
const cardStyle = 'rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl transition-all duration-200';

export default function AdmissionsDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const totalApps = applications.length;
  const pending = applications.filter((a) => a.status === 'submitted' || a.status === 'documents_pending').length;
  const enrolled = applications.filter((a) => a.status === 'enrolled').length;
  const totalRevenue = payments.reduce((s, p) => s + (p.totalFee || 0), 0);
  const collected = payments.reduce((s, p) => s + (p.paidAmount || 0), 0);
  const pendingFees = payments.reduce((s, p) => s + (p.pendingAmount || 0), 0);
  const overduePayments = payments.filter((p) => p.status === 'overdue').length;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const paymentStatus = [
    { name: 'Paid', value: payments.filter((p) => p.status === 'paid').length },
    { name: 'Pending', value: payments.filter((p) => p.status === 'pending' || p.status === 'partial').length },
    { name: 'Overdue', value: payments.filter((p) => p.status === 'overdue').length },
  ];

  const activeUser = currentUser || users[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Admissions & Finance Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{greeting}, {activeUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-xs font-medium text-slate-400">
          <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />
          {formatDate(new Date())} &bull; {pending} applications pending review
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Applications" value={totalApps} change={10} changeType="up" icon={FileText} color="blue" />
        <KPICard title="Pending Review" value={pending} change={0} changeType="neutral" icon={Clock} color="warning" />
        <KPICard title="Enrolled" value={enrolled} change={20} changeType="up" icon={GraduationCap} color="success" />
        <KPICard title="Total Revenue" value={totalRevenue} change={18} changeType="up" icon={IndianRupee} color="success" prefix="₹" />
        <KPICard title="Collected" value={collected} change={15} changeType="up" icon={CreditCard} color="primary" prefix="₹" />
        <KPICard title="Pending Fees" value={pendingFees} change={0} changeType="neutral" icon={Receipt} color="warning" prefix="₹" />
        <KPICard title="Overdue" value={overduePayments} change={0} changeType="neutral" icon={AlertTriangle} color="danger" />
        <KPICard title="Students" value={enrolled} change={12} changeType="up" icon={Users} color="blue" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Applications */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Recent Applications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Student</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Course</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E3E3E]">
                {applications.slice(0, 6).map((a) => {
                  const lead = leads.find((l) => l.id === a.leadId);
                  const course = courses.find((c) => c.id === a.courseId);
                  const dateStr = a.applicationDate ? formatDate(a.applicationDate) : '-';

                  return (
                    <tr key={a.id} className="hover:bg-[#303030] cursor-pointer transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">{lead?.name || 'Student'}</td>
                      <td className="px-5 py-3.5 text-slate-300 font-medium text-xs whitespace-nowrap">{course?.name || '-'}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={a.status} type="application" />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">{dateStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payment Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Payment Status Breakdown</h3>
          </div>
          <div className="p-6 flex items-center justify-around gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={4}>
                  {paymentStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {paymentStatus.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between bg-[#1A1A1A] p-2.5 rounded-lg border border-[#3E3E3E]">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-white">{s.name}</span>
                  </div>
                  <span className="text-xs font-black text-[#FFA116] font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Installments */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardStyle}>
        <div className="px-5 py-4 border-b border-[#3E3E3E]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Upcoming & Overdue Installments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Student</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Amount Paid</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Next Due Date</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3E3E3E]">
              {payments.slice(0, 5).map((p) => {
                const lead = leads.find((l) => l.id === p.leadId);
                const firstPendingInstallment = p.installments?.find(ins => ins.status === 'pending' || ins.status === 'overdue') || p.installments?.[0];
                const dueDateStr = firstPendingInstallment?.dueDate ? formatDate(firstPendingInstallment.dueDate) : '-';

                return (
                  <tr key={p.id} className="hover:bg-[#303030] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">{lead?.name || 'Student'}</td>
                    <td className="px-5 py-3.5 text-[#FFA116] font-mono font-bold whitespace-nowrap">{formatCurrency(p.paidAmount)}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">{dueDateStr}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={p.status} type="payment" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

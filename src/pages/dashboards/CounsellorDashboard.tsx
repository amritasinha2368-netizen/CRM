import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Phone, CalendarClock, TrendingUp, Flame, FileText,
  GraduationCap, Plus, MessageCircle, Mail, Calendar, Clock,
  ArrowRight, Sparkles, CalendarDays,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, calls, courses } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';

const card = 'rounded-2xl border border-surface-200/60 bg-white shadow-sm';
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function CounsellorDashboard() {
  const { currentUser } = useAppStore();

  const myLeads = leads.filter((l) => l.assignedTo === currentUser.id || Math.random() > 0.3);
  const newLeads = myLeads.filter((l) => l.status === 'new');
  const hotLeads = myLeads.filter((l) => l.leadScore > 70);
  const overdue = myLeads.filter((l) => l.status === 'contacted');
  const applications = myLeads.filter((l) => l.status === 'application');
  const enrolled = myLeads.filter((l) => l.status === 'enrolled');

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const todayFollowups = useMemo(() => myLeads.slice(0, 5), [myLeads]);
  const recentCalls = calls.slice(0, 4);

  return (
    <div className="space-y-6 p-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 border border-surface-200/60">
        <h1 className="text-2xl font-extrabold text-surface-900">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-surface-500"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />{formatDate(new Date())} &bull; You have {overdue.length} leads to follow up</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: 'My Leads', value: myLeads.length, icon: Users, color: 'bg-primary-50 text-primary-600' },
          { label: 'New', value: newLeads.length, icon: Plus, color: 'bg-blue-50 text-blue-600' },
          { label: 'Hot', value: hotLeads.length, icon: Flame, color: 'bg-amber-50 text-amber-600' },
          { label: 'Follow-ups', value: overdue.length, icon: CalendarClock, color: 'bg-rose-50 text-rose-600' },
          { label: 'Overdue', value: overdue.length, icon: Clock, color: 'bg-danger-50 text-danger-600' },
          { label: 'Applications', value: applications.length, icon: FileText, color: 'bg-violet-50 text-violet-600' },
          { label: 'Admissions', value: enrolled.length, icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600' },
        ].map((s) => (
          <motion.div key={s.label} variants={item} whileHover={{ y: -4 }} className="rounded-xl border border-surface-200/60 bg-white p-3 text-center shadow-sm cursor-pointer hover:shadow-md transition-all">
            <div className={cn('mx-auto mb-2 h-9 w-9 rounded-lg flex items-center justify-center', s.color)}><s.icon className="h-4 w-4" /></div>
            <p className="text-xl font-black text-surface-900">{s.value}</p>
            <p className="text-[10px] font-medium text-surface-400">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* My Leads */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn(card, 'lg:col-span-2')}>
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-700">My Leads</h3>
            <button className="text-xs font-bold text-primary-600 hover:text-primary-700">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-surface-100 text-xs font-medium text-surface-500">
                <th className="px-5 py-3">Name</th><th className="px-5 py-3">Course</th><th className="px-5 py-3">Score</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-surface-50">
                {myLeads.slice(0, 8).map((l, i) => {
                  const course = courses.find((c) => c.id === l.courseId);
                  return (
                    <motion.tr key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.03 }} className="hover:bg-surface-50 transition-colors cursor-pointer">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">{l.name.split(' ').map(n => n[0]).join('')}</div>
                          <div><p className="font-medium text-surface-800">{l.name}</p><p className="text-xs text-surface-400">{l.phone}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-surface-600 text-xs">{course?.name ?? '—'}</td>
                      <td className="px-5 py-3"><span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', l.leadScore > 70 ? 'bg-emerald-50 text-emerald-600' : l.leadScore > 40 ? 'bg-amber-50 text-amber-600' : 'bg-surface-100 text-surface-500')}>{l.leadScore}</span></td>
                      <td className="px-5 py-3"><StatusBadge status={l.status} type="lead" /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <motion.button whileHover={{ scale: 1.1 }} className="h-7 w-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-100"><Phone className="h-3.5 w-3.5" /></motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100"><MessageCircle className="h-3.5 w-3.5" /></motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100"><Mail className="h-3.5 w-3.5" /></motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Today's Follow-ups */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={card}>
          <div className="px-6 py-4 border-b border-surface-100"><h3 className="text-sm font-semibold text-surface-700">Today's Follow-ups</h3></div>
          <div className="p-4 space-y-2">
            {todayFollowups.map((l, i) => (
              <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer group">
                <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-700">{l.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{l.name}</p>
                  <p className="text-xs text-surface-400">{l.courseId ? courses.find(c => c.id === l.courseId)?.name : 'General'}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hot Leads */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-sm font-semibold text-surface-700 mb-4 flex items-center gap-2"><Flame className="h-4 w-4 text-amber-500" /> Hot Leads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotLeads.slice(0, 4).map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} whileHover={{ y: -4 }} className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">{l.name.split(' ').map(n => n[0]).join('')}</div>
                <div><p className="text-sm font-bold text-surface-900">{l.name}</p><p className="text-[10px] text-surface-400">Score: {l.leadScore}</p></div>
              </div>
              <StatusBadge status={l.status} type="lead" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Phone, CalendarClock, Flame, FileText,
  GraduationCap, Plus, MessageCircle, Mail, Clock,
  CalendarDays,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, calls, courses } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';

const cardStyle = 'rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-xl';

export default function CounsellorDashboard() {
  const { currentUser } = useAppStore();

  const myLeads = leads.filter((l) => l.assignedTo === currentUser?.id || true);
  const newLeads = myLeads.filter((l) => l.status === 'new');
  const hotLeads = myLeads.filter((l) => l.leadScore > 70);
  const overdue = myLeads.filter((l) => l.status === 'contacted');
  const applications = myLeads.filter((l) => l.status === 'application');
  const enrolled = myLeads.filter((l) => l.status === 'enrolled');

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-6 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-xs font-medium text-slate-400">
          <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />
          {formatDate(new Date())} &bull; You have {overdue.length} leads to follow up today
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: 'My Leads', value: myLeads.length, icon: Users },
          { label: 'New', value: newLeads.length, icon: Plus },
          { label: 'Hot', value: hotLeads.length, icon: Flame },
          { label: 'Follow-ups', value: overdue.length, icon: CalendarClock },
          { label: 'Overdue', value: overdue.length, icon: Clock },
          { label: 'Applications', value: applications.length, icon: FileText },
          { label: 'Admissions', value: enrolled.length, icon: GraduationCap },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#3E3E3E] bg-[#282828] p-3 text-center shadow-lg hover:border-[#FFA116] transition-all cursor-pointer">
            <div className="mx-auto mb-2 h-9 w-9 rounded-lg bg-[#1A1A1A] border border-[#3E3E3E] text-slate-300 flex items-center justify-center">
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-black text-white font-mono">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* My Leads */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn(cardStyle, 'lg:col-span-2')}>
          <div className="px-5 py-4 border-b border-[#3E3E3E] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">My Assigned Leads</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#3E3E3E] bg-[#1A1A1A]">
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Name</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Course</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Score</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Status</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E3E3E]">
                {myLeads.slice(0, 8).map((l) => {
                  const course = courses.find((c) => c.id === l.courseId);
                  return (
                    <tr key={l.id} className="hover:bg-[#303030] transition-colors cursor-pointer">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-md bg-[#FFA116] flex items-center justify-center text-xs font-black text-[#1A1A1A]">
                            {l.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-white whitespace-nowrap">{l.name}</p>
                            <p className="text-xs text-slate-400 font-mono whitespace-nowrap">{l.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-white font-bold text-xs whitespace-nowrap">{course?.name ?? '—'}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-[#FFA116]">{l.leadScore}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={l.status} type="lead" />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); window.open(`tel:${l.phone}`); }} className="h-7 w-7 rounded-md bg-[#1A1A1A] border border-[#3E3E3E] flex items-center justify-center text-[#2CBB5D] hover:bg-[#132E1F]">
                            <Phone className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${l.phone}`); }} className="h-7 w-7 rounded-md bg-[#1A1A1A] border border-[#3E3E3E] flex items-center justify-center text-[#2CBB5D] hover:bg-[#132E1F]">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); window.open(`mailto:${l.email}`); }} className="h-7 w-7 rounded-md bg-[#1A1A1A] border border-[#3E3E3E] flex items-center justify-center text-[#007AFF] hover:bg-[#1E293B]">
                            <Mail className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Follow-ups */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={cardStyle}>
          <div className="px-5 py-4 border-b border-[#3E3E3E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA116]">Recent Call Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            {calls.slice(0, 4).map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-[#1A1A1A] border border-[#3E3E3E]">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{c.disposition}</span>
                  <span className="font-mono text-[#FFA116]">{Math.floor(c.duration / 60)}m {c.duration % 60}s</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.notes}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

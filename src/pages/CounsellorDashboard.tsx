import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Flame, Phone, CalendarClock, AlertTriangle,
  ThumbsUp, FileText, GraduationCap, PhoneCall, Clock, TrendingUp,
  PhoneOff, Timer, ArrowRight, MessageSquare, StickyNote, Eye,
} from 'lucide-react';
import { cn, formatDate, formatTime, getRelativeTime } from '@/lib/utils';
import { useAppStore } from '@/store';
import { leads, calls, followUps, courses, activities } from '@/data/mockData';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import Badge from '@/components/ui/Badge';

const card = 'rounded-xl border border-surface-200 bg-white shadow-sm';
const cardHeader = 'px-5 py-4 border-b border-surface-100';
const cardBody = 'p-5';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

const stageColors: Record<string, string> = {
  new: 'bg-blue-500', contacted: 'bg-cyan-500', interested: 'bg-green-500',
  counselling: 'bg-emerald-500', application: 'bg-amber-500', enrolled: 'bg-success-500',
};

export default function CounsellorDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  const myLeads = useMemo(() => leads.filter((l) => l.assignedTo === currentUser.id), [currentUser.id]);
  const myCalls = useMemo(() => calls.filter((c) => c.counsellorId === currentUser.id), [currentUser.id]);
  const myFollowUps = useMemo(() => followUps.filter((f) => f.counsellorId === currentUser.id), [currentUser.id]);

  const myNewLeads = myLeads.filter((l) => l.status === 'new').length;
  const myHotLeads = myLeads.filter((l) => l.leadScore > 70).length;
  const myFollowUpsToday = myFollowUps.filter((f) => {
    const today = new Date().toISOString().split('T')[0];
    return f.dueDate.startsWith(today) && f.status === 'pending';
  }).length;
  const myOverdue = myFollowUps.filter((f) => f.status === 'overdue').length;
  const myInterested = myLeads.filter((l) => l.status === 'interested' || l.status === 'counselling').length;
  const myApps = myLeads.filter((l) => ['application', 'documents', 'payment'].includes(l.status)).length;
  const myEnrolled = myLeads.filter((l) => l.status === 'enrolled').length;

  const todayCallsCount = myCalls.filter((c) => c.startTime.startsWith(new Date().toISOString().split('T')[0])).length;
  const connectedCalls = myCalls.filter((c) => c.disposition === 'Connected').length;
  const totalTalkTime = myCalls.reduce((sum, c) => sum + c.duration, 0);
  const conversionRate = myCalls.length > 0 ? Math.round((connectedCalls / myCalls.length) * 100) : 0;

  const todaySchedule = useMemo(() => {
    return myFollowUps
      .filter((f) => f.status === 'pending' || f.status === 'overdue')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((f) => {
        const lead = leads.find((l) => l.id === f.leadId);
        return { ...f, leadName: lead?.name ?? 'Unknown', leadPhone: lead?.phone ?? '' };
      });
  }, [myFollowUps]);

  const recentActivity = useMemo(() => {
    return activities
      .filter((a) => a.userId === currentUser.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [currentUser.id]);

  const pipeline = useMemo(() => {
    const stages = ['new', 'contacted', 'interested', 'counselling', 'application', 'enrolled'] as const;
    return stages.map((s) => ({ stage: s, count: myLeads.filter((l) => l.status === s).length }));
  }, [myLeads]);

  const maxPipeline = Math.max(...pipeline.map((p) => p.count), 1);

  const activityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'whatsapp': return MessageSquare;
      case 'note': return StickyNote;
      case 'status_change': return ArrowRight;
      case 'follow_up': return CalendarClock;
      default: return Eye;
    }
  };

  const formatTalkTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900">My Dashboard</h1>
        <p className="mt-0.5 text-sm text-surface-500">Welcome back, {currentUser.name}</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <motion.div variants={item}>
          <KPICard title="My Leads" value={myLeads.length} change={0} changeType="neutral" icon={Users} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="New Leads" value={myNewLeads} change={0} changeType="neutral" icon={UserPlus} color="blue" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Hot Leads" value={myHotLeads} change={0} changeType="up" icon={Flame} color="warning" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Follow-ups Today" value={myFollowUpsToday} change={0} changeType="neutral" icon={CalendarClock} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Overdue" value={myOverdue} change={0} changeType="down" icon={AlertTriangle} color="danger" />
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <KPICard title="Interested" value={myInterested} change={0} changeType="neutral" icon={ThumbsUp} color="success" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Applications" value={myApps} change={0} changeType="up" icon={FileText} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Admissions" value={myEnrolled} change={0} changeType="up" icon={GraduationCap} color="success" />
        </motion.div>
        <motion.div variants={item}>
          <KPICard title="Calls Today" value={todayCallsCount} change={0} changeType="neutral" icon={Phone} color="blue" />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn(card, 'lg:col-span-2')}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Today's Schedule</h3>
          </div>
          <div className="divide-y divide-surface-50">
            {todaySchedule.length === 0 && (
              <p className="p-5 text-sm text-surface-400">No follow-ups scheduled for today.</p>
            )}
            {todaySchedule.map((fu, i) => (
              <motion.div
                key={fu.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-surface-50 transition-colors"
              >
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
                  fu.status === 'overdue' ? 'bg-danger-500' : 'bg-primary-500',
                )}>
                  {fu.type === 'call' ? <Phone className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-800 truncate">{fu.leadName}</p>
                  <p className="text-xs text-surface-500 truncate">{fu.notes}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={fu.priority === 'high' ? 'danger' : fu.priority === 'medium' ? 'warning' : 'default'} dot>
                    {fu.priority}
                  </Badge>
                  <span className="text-xs text-surface-400">{getRelativeTime(fu.dueDate)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Performance</h3>
          </div>
          <div className={cardBody}>
            <div className="space-y-4">
              {[
                { label: 'Calls Made', value: myCalls.length, icon: PhoneCall, color: 'text-primary-600 bg-primary-50' },
                { label: 'Connected', value: connectedCalls, icon: Phone, color: 'text-success-600 bg-success-50' },
                { label: 'No Answer', value: myCalls.length - connectedCalls, icon: PhoneOff, color: 'text-danger-600 bg-danger-50' },
                { label: 'Talk Time', value: totalTalkTime, icon: Timer, color: 'text-navy-600 bg-navy-50', isTime: true },
                { label: 'Connection Rate', value: conversionRate, icon: TrendingUp, color: 'text-warning-600 bg-warning-50', suffix: '%' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', stat.color)}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-surface-500">{stat.label}</p>
                    <p className="text-sm font-bold text-surface-800">
                      {stat.isTime ? formatTalkTime(stat.value) : `${stat.value}${(stat as { suffix?: string }).suffix ?? ''}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={card}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Lead Pipeline</h3>
          </div>
          <div className={cardBody}>
            <div className="space-y-2.5">
              {pipeline.map((p, i) => (
                <div key={p.stage} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium capitalize text-surface-600">{p.stage}</span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-surface-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.count / maxPipeline) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                      className={cn('absolute inset-y-0 left-0 rounded-md', stageColors[p.stage] ?? 'bg-surface-400')}
                    />
                    <span className="relative z-10 flex h-full items-center px-2 text-[11px] font-bold text-white">
                      {p.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={cn(card, 'lg:col-span-2')}>
          <div className={cardHeader}>
            <h3 className="text-sm font-semibold text-surface-700">Recent Activity</h3>
          </div>
          <div className="divide-y divide-surface-50">
            {recentActivity.map((act, i) => {
              const Icon = activityIcon(act.type);
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.04 }}
                  className="flex items-start gap-3 px-5 py-3"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-100">
                    <Icon className="h-3.5 w-3.5 text-surface-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-surface-700">{act.description}</p>
                    <p className="mt-0.5 text-xs text-surface-400">{getRelativeTime(act.timestamp)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className={card}>
        <div className={cardHeader}>
          <h3 className="text-sm font-semibold text-surface-700">Quick Actions</h3>
        </div>
        <div className={cardBody}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Call Next Lead', icon: Phone, color: 'text-white bg-gradient-to-br from-primary-500 to-primary-700' },
              { label: 'View Pipeline', icon: Eye, color: 'text-white bg-gradient-to-br from-navy-500 to-navy-700' },
              { label: 'Add Note', icon: StickyNote, color: 'text-white bg-gradient-to-br from-success-500 to-success-600' },
            ].map((action) => (
              <button
                key={action.label}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
                  action.color,
                )}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

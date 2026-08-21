import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
  Clock, TrendingUp, Users, BarChart3, ChevronDown, ChevronUp,
  Filter, Plus, Mic, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { calls, leads, users } from '@/data/mockData';
import { formatCurrency, formatDate, formatDateTime, getRelativeTime, getInitials } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import toast from 'react-hot-toast';
import type { Call } from '@/types';

export default function Calls() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [filterCounsellor, setFilterCounsellor] = useState('all');
  const [filterDisposition, setFilterDisposition] = useState('all');

  const filteredCalls = useMemo(() => {
    let result = [...calls];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => {
        const lead = leads.find(l => l.id === c.leadId);
        return lead?.name.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q);
      });
    }
    if (filterCounsellor !== 'all') {
      result = result.filter(c => c.counsellorId === filterCounsellor);
    }
    if (filterDisposition !== 'all') {
      result = result.filter(c => c.disposition === filterDisposition);
    }
    return result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [searchQuery, filterCounsellor, filterDisposition]);

  const totalDuration = calls.reduce((sum, c) => sum + c.duration, 0);
  const avgDuration = Math.round(totalDuration / calls.length);
  const connectedCalls = calls.filter(c => c.disposition === 'Connected').length;
  const today = new Date().toISOString().split('T')[0];
  const callsToday = calls.filter(c => c.startTime.startsWith(today)).length;

  const callScoreData = [
    { name: 'Greeting', value: 85 },
    { name: 'Discovery', value: 78 },
    { name: 'Course Info', value: 92 },
    { name: 'Objection', value: 70 },
    { name: 'Accuracy', value: 88 },
    { name: 'Closing', value: 75 },
  ];

  const dispositionCounts = calls.reduce((acc, c) => {
    acc[c.disposition] = (acc[c.disposition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dispositionChart = Object.entries(dispositionCounts).map(([name, count]) => ({ name, count }));

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Calls</h1>
          <p className="text-sm text-surface-500">Track and manage all your call activities</p>
        </div>
        <button onClick={() => setShowCallModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
          <Phone className="h-4 w-4" />
          Start Call
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Calls" value={calls.length} change={12} changeType="up" icon={Phone} color="primary" />
        <KPICard title="Connected" value={connectedCalls} change={8} changeType="up" icon={PhoneOutgoing} color="success" />
        <KPICard title="Avg Duration" value={avgDuration} change={5} changeType="up" icon={Clock} color="blue" prefix="" suffix="s" />
        <KPICard title="Calls Today" value={callsToday || 3} change={0} changeType="neutral" icon={PhoneIncoming} color="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-surface-900">Call Log</h2>
            <div className="flex items-center gap-3">
              <select value={filterCounsellor} onChange={e => setFilterCounsellor(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none">
                <option value="all">All Counsellors</option>
                {users.filter(u => u.role === 'counsellor').map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <select value={filterDisposition} onChange={e => setFilterDisposition(e.target.value)} className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm focus:border-primary-300 focus:outline-none">
                <option value="all">All Dispositions</option>
                {[...new Set(calls.map(c => c.disposition))].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredCalls.map((call, idx) => {
              const lead = leads.find(l => l.id === call.leadId);
              const counsellor = users.find(u => u.id === call.counsellorId);
              const isExpanded = expandedCall === call.id;
              const hasAI = !!call.aiSummary;

              return (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  className={cn('rounded-xl border border-surface-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md', hasAI && 'ring-1 ring-primary-100')}
                >
                  <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => hasAI && setExpandedCall(isExpanded ? null : call.id)}>
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', call.direction === 'inbound' ? 'bg-success-100' : 'bg-primary-100')}>
                      {call.direction === 'inbound' ? (
                        <PhoneIncoming className="h-5 w-5 text-success-600" />
                      ) : (
                        <PhoneOutgoing className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-surface-900 truncate">{lead?.name}</h3>
                        <Badge variant={call.disposition === 'Connected' ? 'success' : call.disposition === 'Not Interested' ? 'danger' : 'warning'}>
                          {call.disposition}
                        </Badge>
                        {hasAI && <Star className="h-3.5 w-3.5 text-amber-500" />}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-surface-400">
                        <span>{counsellor?.name}</span>
                        <span>{call.direction === 'inbound' ? 'Inbound' : 'Outbound'}</span>
                        <span>{formatDuration(call.duration)}</span>
                        <span>{getRelativeTime(call.startTime)}</span>
                      </div>
                    </div>
                    {hasAI && (
                      <ChevronDown className={cn('h-4 w-4 text-surface-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && call.aiSummary && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-surface-100"
                      >
                        <div className="p-4 space-y-4 bg-surface-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h4 className="text-xs font-semibold uppercase text-surface-500">AI Summary</h4>
                              <p className="text-sm text-surface-700">{call.aiSummary.summary}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant={call.aiSummary.sentiment === 'positive' ? 'success' : call.aiSummary.sentiment === 'negative' ? 'danger' : 'default'}>
                                  {call.aiSummary.sentiment}
                                </Badge>
                                <Badge variant={call.aiSummary.interestLevel === 'high' ? 'primary' : 'default'}>
                                  {call.aiSummary.interestLevel} interest
                                </Badge>
                              </div>
                              {call.aiSummary.nextBestAction && (
                                <div className="rounded-lg bg-primary-50 p-3">
                                  <p className="text-xs font-medium text-primary-700">Next Best Action</p>
                                  <p className="text-sm text-primary-600">{call.aiSummary.nextBestAction}</p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-xs font-semibold uppercase text-surface-500">Call Score</h4>
                              <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart data={callScoreData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                                    <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="text-center">
                                <span className="text-2xl font-bold text-primary-600">{call.aiSummary.callScore.overall}</span>
                                <span className="text-xs text-surface-500">/100</span>
                              </div>
                            </div>
                          </div>
                          {call.aiSummary.transcript && (
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-surface-500 mb-2">Transcript</h4>
                              <div className="max-h-32 overflow-y-auto rounded-lg bg-white p-3 border border-surface-200 text-xs text-surface-600 whitespace-pre-wrap">
                                {call.aiSummary.transcript}
                              </div>
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

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Call Score Overview</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Disposition Breakdown</h3>
            <div className="space-y-2">
              {dispositionChart.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs text-surface-500 w-24 truncate">{d.name}</span>
                  <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(d.count / calls.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-surface-700 w-6 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Modal open={showCallModal} onOpenChange={setShowCallModal} title="Start Call" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Select Lead</label>
            <select className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
              <option value="">Choose a lead to call</option>
              {leads.filter(l => l.status !== 'lost' && l.status !== 'enrolled').map(l => (
                <option key={l.id} value={l.id}>{l.name} - {l.phone}</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg bg-surface-50 p-4 text-center">
            <Phone className="h-8 w-8 text-surface-400 mx-auto mb-2" />
            <p className="text-sm text-surface-500">Click-to-call will initiate from your connected telephony system</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowCallModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={() => { toast.success('Call initiated'); setShowCallModal(false); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors">
              <Phone className="h-4 w-4" />
              Call Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

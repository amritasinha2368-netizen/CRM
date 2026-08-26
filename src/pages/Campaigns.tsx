import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, TrendingUp, Users, Target, IndianRupee, Plus,
  BarChart3, PieChart as PieIcon, Edit3, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { campaigns, leads } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import KPICard from '@/components/ui/KPICard';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import type { Campaign } from '@/types';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

const sourceIcons: Record<string, string> = {
  google_ads: '🔍', meta_ads: '📘', instagram: '📸', landing_page: '🌐',
  referral: '🤝', website: '💻', walk_in: '🚶', whatsapp: '💬',
  event: '🎯', csv_import: '📄', api: '⚙️', other: '📌',
};

export default function Campaigns() {
  const { currentUser } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsCount, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgCPL = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;

  const campaignPerformance = campaigns.map(c => ({
    name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
    leads: c.leadsCount,
    conversions: c.conversions,
    spend: c.spend,
    cpl: c.leadsCount > 0 ? Math.round(c.spend / c.leadsCount) : 0,
  }));

  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  }, []);

  const handleSave = () => {
    toast.success(editingCampaign ? 'Campaign updated' : 'Campaign created');
    setShowModal(false);
    setEditingCampaign(null);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Campaigns</h1>
          <p className="text-sm text-surface-500">Track marketing campaigns and ROI</p>
        </div>
        <button onClick={() => { setEditingCampaign(null); setShowModal(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
          <Plus className="h-4 w-4" />
          Add Campaign
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Spend" value={totalSpend} change={8} changeType="up" icon={IndianRupee} color="purple" prefix="₹" />
        <KPICard title="Total Leads" value={totalLeads} change={15} changeType="up" icon={Users} color="cyan" />
        <KPICard title="Conversions" value={totalConversions} change={10} changeType="up" icon={Target} color="emerald" />
        <KPICard title="Avg CPL" value={avgCPL} change={5} changeType="down" icon={TrendingUp} color="amber" prefix="₹" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Campaign Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-surface-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Source-wise Lead Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-surface-900">All Campaigns</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign, idx) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sourceIcons[campaign.source] || '📌'}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900">{campaign.name}</h3>
                    <p className="text-xs text-surface-500">{campaign.source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'paused' ? 'warning' : 'default'}>
                    {campaign.status}
                  </Badge>
                  <button onClick={() => { setEditingCampaign(campaign); setShowModal(true); }} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 transition-colors">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {campaign.description && (
                <p className="mt-2 text-xs text-surface-500 line-clamp-2">{campaign.description}</p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface-50 p-2.5 text-center">
                  <p className="text-lg font-bold text-surface-900">{formatCurrency(campaign.spend)}</p>
                  <p className="text-[10px] text-surface-500">Spend</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-2.5 text-center">
                  <p className="text-lg font-bold text-surface-900">{campaign.leadsCount}</p>
                  <p className="text-[10px] text-surface-500">Leads</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-2.5 text-center">
                  <p className="text-lg font-bold text-success-600">{campaign.conversions}</p>
                  <p className="text-[10px] text-surface-500">Conversions</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-2.5 text-center">
                  <p className="text-lg font-bold text-primary-600">
                    {campaign.leadsCount > 0 ? formatCurrency(Math.round(campaign.spend / campaign.leadsCount)) : '₹0'}
                  </p>
                  <p className="text-[10px] text-surface-500">CPL</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-surface-400">
                <span>{formatDate(campaign.startDate)}{campaign.endDate ? ` - ${formatDate(campaign.endDate)}` : ' - Ongoing'}</span>
                {campaign.leadsCount > 0 && (
                  <span className="font-medium text-success-600">
                    ROI: {Math.round(((campaign.conversions * 95000 - campaign.spend) / campaign.spend) * 100)}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal open={showModal} onOpenChange={setShowModal} title={editingCampaign ? 'Edit Campaign' : 'Add Campaign'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Campaign Name</label>
            <input defaultValue={editingCampaign?.name} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Source</label>
              <select defaultValue={editingCampaign?.source} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none">
                <option value="google_ads">Google Ads</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="instagram">Instagram</option>
                <option value="landing_page">Landing Page</option>
                <option value="referral">Referral</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Spend (₹)</label>
              <input type="number" defaultValue={editingCampaign?.spend} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
            <textarea defaultValue={editingCampaign?.description} rows={2} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">{editingCampaign ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

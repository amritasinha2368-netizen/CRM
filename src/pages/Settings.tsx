import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Building2, Plug, Bell, Camera, Save,
  Key, Globe, MessageSquare, Phone, CreditCard, CheckCircle2,
  XCircle, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { users, centers } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'centers', label: 'Centers', icon: Building2 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const integrations = [
  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageSquare, connected: true, color: 'text-success-600', bg: 'bg-success-100' },
  { id: 'telephony', name: 'Telephony (Twilio)', icon: Phone, connected: true, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'email', name: 'Email (SMTP)', icon: Globe, connected: false, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'payment', name: 'Payment Gateway', icon: CreditCard, connected: true, color: 'text-primary-600', bg: 'bg-primary-100' },
];

const roles = [
  { name: 'Super Admin', permissions: ['All Access'], count: users.filter(u => u.role === 'super_admin').length },
  { name: 'CRM Admin', permissions: ['Leads', 'Campaigns', 'Reports', 'Team'], count: users.filter(u => u.role === 'crm_admin').length },
  { name: 'Team Leader', permissions: ['Team Leads', 'Reports', 'Assignments'], count: users.filter(u => u.role === 'team_leader').length },
  { name: 'Counsellor', permissions: ['Assigned Leads', 'Calls', 'Follow-ups'], count: users.filter(u => u.role === 'counsellor').length },
  { name: 'Admissions', permissions: ['Applications', 'Documents', 'Payments'], count: users.filter(u => u.role === 'admissions').length },
];

export default function Settings() {
  const { currentUser } = useAppStore();
  const activeUser = currentUser || users[0];
  const [activeTab, setActiveTab] = useState('profile');
  const [integrationStates, setIntegrationStates] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map(i => [i.id, i.connected]))
  );

  const toggleIntegration = (id: string) => {
    setIntegrationStates(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success(integrationStates[id] ? 'Disconnected' : 'Connected successfully');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
                  {activeUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-1.5 text-white shadow-sm hover:bg-primary-700 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">{activeUser.name}</h3>
                <p className="text-sm text-surface-500">{activeUser.email}</p>
                <Badge variant="primary" className="mt-1">{activeUser.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
                <input defaultValue={activeUser.name} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                <input defaultValue={activeUser.email} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                <input defaultValue={activeUser.phone} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Center</label>
                <select defaultValue={activeUser.center} className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none">
                  {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => toast.success('Profile updated')} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </div>
        );
      case 'roles':
        return (
          <div className="space-y-4">
            {roles.map((role, idx) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-surface-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <Shield className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900">{role.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.permissions.map(p => (
                          <span key={p} className="rounded bg-surface-100 px-2 py-0.5 text-[10px] text-surface-600">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-surface-400">{role.count} members</span>
                    <button className="rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-50 transition-colors">Edit</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'centers':
        return (
          <div className="space-y-4">
            {centers.map((center, idx) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-surface-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900">{center.name}</h3>
                      <p className="text-xs text-surface-500 mt-0.5">{center.address}, {center.city}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{center.phone}</p>
                    </div>
                  </div>
                  <button className="rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-50 transition-colors">Edit</button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-4">
            {integrations.map((integration, idx) => {
              const Icon = integration.icon;
              const isConnected = integrationStates[integration.id];
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-surface-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', integration.bg)}>
                        <Icon className={cn('h-6 w-6', integration.color)} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900">{integration.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isConnected ? (
                            <><CheckCircle2 className="h-3.5 w-3.5 text-success-600" /><span className="text-xs text-success-600">Connected</span></>
                          ) : (
                            <><XCircle className="h-3.5 w-3.5 text-surface-400" /><span className="text-xs text-surface-400">Not connected</span></>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleIntegration(integration.id)}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        isConnected
                          ? 'border border-danger-200 text-danger-600 hover:bg-danger-50'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      )}
                    >
                      {isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { label: 'New Lead Assignment', description: 'Get notified when a new lead is assigned to you', enabled: true },
              { label: 'Overdue Follow-ups', description: 'Alert when follow-ups become overdue', enabled: true },
              { label: 'Payment Received', description: 'Notification on payment receipt', enabled: true },
              { label: 'Application Status', description: 'Updates on application status changes', enabled: false },
              { label: 'Team Performance', description: 'Weekly team performance summary', enabled: true },
              { label: 'Campaign Reports', description: 'Daily campaign performance digest', enabled: false },
            ].map((notif, idx) => (
              <motion.div
                key={notif.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-surface-200 bg-white p-4"
              >
                <div>
                  <h3 className="text-sm font-medium text-surface-900">{notif.label}</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{notif.description}</p>
                </div>
                <button className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', notif.enabled ? 'bg-primary-600' : 'bg-surface-200')}>
                  <span className={cn('inline-block h-4 w-4 rounded-full bg-white transition-transform', notif.enabled ? 'translate-x-6' : 'translate-x-1')} />
                </button>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500">Manage your account and system settings</p>
      </motion.div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-surface-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-surface-900 mb-5">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

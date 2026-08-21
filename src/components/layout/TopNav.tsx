import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Plus, Bell, ChevronRight, Search, LogOut, User, ArrowLeftRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { SearchInput } from '@/components/ui/SearchInput';
import { getRelativeTime } from '@/lib/utils';

const ROUTE_NAMES: Record<string, string> = {
  dashboard: 'Dashboard', leads: 'Leads', my: 'My Leads', pipeline: 'Pipeline',
  'follow-ups': 'Follow-ups', calls: 'Calls', students: 'Students', applications: 'Applications',
  admissions: 'Admissions', payments: 'Payments', courses: 'Courses & Batches', campaigns: 'Campaigns',
  reports: 'Reports', team: 'Team', automations: 'Automations', templates: 'Templates',
  documents: 'Documents', settings: 'Settings', notifications: 'Notifications',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin', crm_admin: 'CRM Admin', team_leader: 'Team Leader',
  counsellor: 'Counsellor', admissions: 'Admissions',
};

interface TopNavProps {
  onMenuToggle?: () => void;
}

export function TopNav({ onMenuToggle }: TopNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, switchRole, logout } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      label: ROUTE_NAMES[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + segments.slice(0, index + 1).join('/'),
      isLast: index === segments.length - 1,
    }));
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) { setShowProfileMenu(false); setShowRoleSwitcher(false); }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const roles = ['super_admin', 'crm_admin', 'team_leader', 'counsellor', 'admissions'] as const;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-surface-200/60 bg-white/80 backdrop-blur-2xl">
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="flex h-9 w-9 items-center justify-center rounded-xl text-surface-500 transition-all hover:bg-surface-100 hover:text-surface-700 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link to="/dashboard" className="flex items-center gap-1 rounded-lg px-2 py-1 text-surface-400 transition-colors hover:bg-surface-50 hover:text-surface-600">
              <span className="text-xs">🏠</span>
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.path} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-surface-300" />
                {crumb.isLast ? (
                  <span className="rounded-lg bg-surface-100 px-2.5 py-1 font-semibold text-surface-900">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="rounded-lg px-2 py-1 text-surface-400 transition-colors hover:bg-surface-50 hover:text-surface-600">{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <SearchInput className="w-full" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-surface-500 transition-all hover:bg-surface-100 hover:text-surface-700 md:hidden">
            <Search className="h-5 w-5" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/leads/new')}
            className="hidden items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30 sm:flex"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </motion.button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-surface-500 transition-all hover:bg-surface-100 hover:text-surface-700"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-rose-500/30">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border border-surface-200/60 bg-white shadow-2xl shadow-surface-900/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-surface-100 px-5 py-3.5">
                    <h3 className="text-sm font-bold text-surface-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={() => markAllNotificationsRead()} className="text-xs font-semibold text-primary-600 hover:text-primary-700">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-surface-400">No notifications</div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => { markNotificationRead(notif.id); if (notif.link) navigate(notif.link); setShowNotifications(false); }}
                          className={cn('flex w-full items-start gap-3 px-5 py-3 text-left transition-all hover:bg-surface-50', !notif.read && 'bg-primary-50/30')}
                        >
                          <div className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white',
                            notif.type === 'success' && 'bg-emerald-500',
                            notif.type === 'warning' && 'bg-amber-500',
                            notif.type === 'error' && 'bg-rose-500',
                            notif.type === 'info' && 'bg-primary-500',
                            notif.read && 'bg-surface-200',
                          )} />
                          <div className="min-w-0 flex-1">
                            <p className={cn('text-sm', notif.read ? 'text-surface-500' : 'font-semibold text-surface-900')}>{notif.title}</p>
                            <p className="mt-0.5 truncate text-xs text-surface-400">{notif.message}</p>
                            <p className="mt-1 text-[11px] text-surface-300">{getRelativeTime(notif.createdAt)}</p>
                          </div>
                          {!notif.read && <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary-400" />}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all hover:bg-surface-50"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-bold text-white shadow-md shadow-primary-500/20">
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold text-surface-900">{currentUser.name.split(' ')[0]}</p>
                <p className="text-[10px] font-medium text-surface-400">{ROLE_LABELS[currentUser.role]}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-surface-200/60 bg-white shadow-2xl shadow-surface-900/10 backdrop-blur-xl"
                >
                  <div className="border-b border-surface-100 px-5 py-4">
                    <p className="text-sm font-bold text-surface-900">{currentUser.name}</p>
                    <p className="text-xs text-surface-500">{currentUser.email}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700 ring-1 ring-primary-200/50">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      {ROLE_LABELS[currentUser.role]}
                    </div>
                  </div>
                  <div className="py-1.5">
                    <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900">
                      <User className="h-4 w-4" /> My Profile
                    </button>
                    <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)} className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900">
                      <ArrowLeftRight className="h-4 w-4" /> Switch Role
                    </button>
                  </div>

                  <AnimatePresence>
                    {showRoleSwitcher && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-surface-100">
                        <div className="px-4 py-2.5">
                          <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-surface-400">Switch to</p>
                          {roles.map((role) => (
                            <button
                              key={role}
                              onClick={() => { switchRole(role); setShowRoleSwitcher(false); setShowProfileMenu(false); }}
                              className={cn('flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-all',
                                currentUser.role === role ? 'bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-200/50' : 'text-surface-600 hover:bg-surface-50 font-medium',
                              )}
                            >
                              <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                              {ROLE_LABELS[role]}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="border-t border-surface-100 py-1.5">
                    <button onClick={() => { logout(); window.location.replace('/'); }} className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50">
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

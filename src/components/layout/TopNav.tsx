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
    <header className="sticky top-0 z-20 flex h-20 items-center border-b-2 border-[#93C5FD] bg-[#E0F2FE] backdrop-blur-2xl shadow-sm">
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="flex h-10 w-10 items-center justify-center rounded-xl text-blue-900 transition-all hover:bg-sky-200 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link to="/dashboard" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-blue-900 font-bold transition-colors hover:bg-sky-200">
              <span className="text-xs">🏠</span>
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.path} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                {crumb.isLast ? (
                  <span className="rounded-lg bg-white border border-[#93C5FD] px-3 py-1 font-black text-[#0F172A] shadow-xs">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="rounded-lg px-2.5 py-1 text-blue-900 font-extrabold transition-colors hover:bg-sky-200">{crumb.label}</Link>
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
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-blue-900 transition-all hover:bg-sky-200 md:hidden">
            <Search className="h-5 w-5" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/leads/new')}
            className="hidden items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4.5 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-600/30 transition-all sm:flex"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </motion.button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#93C5FD] text-blue-900 transition-all hover:bg-sky-100 shadow-xs"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-md">
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
                  className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border-2 border-[#93C5FD] bg-white shadow-2xl z-50 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-sky-100 bg-[#E0F2FE] px-5 py-3.5">
                    <h3 className="text-sm font-black text-[#0F172A]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={() => markAllNotificationsRead()} className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8]">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs font-bold text-slate-400">No notifications</div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={cn(
                            'rounded-xl p-3 text-xs transition-colors cursor-pointer',
                            notif.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/80 border border-blue-200 text-slate-900 font-bold'
                          )}
                        >
                          <div className="font-extrabold text-slate-900">{notif.title}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{notif.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile & Role Switcher */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl bg-white border border-[#93C5FD] p-1.5 pr-3 text-xs font-black text-[#0F172A] hover:bg-sky-50 shadow-xs"
            >
              <div className="h-7 w-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-black">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline">{currentUser.name}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

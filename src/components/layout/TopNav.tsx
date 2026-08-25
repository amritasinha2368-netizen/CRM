import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Plus, Bell, ChevronRight, Search, LogOut, Check, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { SearchInput } from '@/components/ui/SearchInput';

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
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const roles = ['super_admin', 'crm_admin', 'team_leader', 'counsellor', 'admissions'] as const;

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-[#3E3E3E] bg-[#282828] text-white">
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-[#383838] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-1 text-xs md:flex">
            <Link to="/dashboard" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-slate-300 font-bold hover:bg-[#383838] hover:text-white">
              <span>🏠</span>
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.path} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                {crumb.isLast ? (
                  <span className="rounded-lg bg-[#383838] border border-[#555555] px-2.5 py-1 font-bold text-white">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="rounded-lg px-2 py-1 text-slate-400 font-medium hover:bg-[#383838] hover:text-white">{crumb.label}</Link>
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
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-[#383838] md:hidden">
            <Search className="h-5 w-5" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/leads/new')}
            className="hidden items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-all sm:flex cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </motion.button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#303030] border border-[#3E3E3E] text-slate-300 hover:text-white hover:bg-[#383838] cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#FF2D55] px-1 text-[10px] font-black text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-[#3E3E3E] bg-[#282828] shadow-2xl z-50 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#3E3E3E] bg-[#303030] px-4 py-3">
                    <h3 className="font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={() => markAllNotificationsRead()} className="text-[11px] font-bold text-[#FFA116] hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">No notifications</div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={cn(
                            'rounded-lg p-2.5 text-xs transition-colors cursor-pointer',
                            notif.read ? 'bg-[#282828] text-slate-400' : 'bg-[#303030] border border-[#3E3E3E] text-white font-bold'
                          )}
                        >
                          <div className="font-bold text-[#FFA116]">{notif.title}</div>
                          <div className="text-[11px] text-slate-300 mt-0.5">{notif.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile & Log Out Menu */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-lg bg-[#303030] border border-[#3E3E3E] p-1 pr-3 text-xs font-bold text-white hover:bg-[#383838] cursor-pointer"
            >
              <div className="h-7 w-7 rounded-md bg-[#FFA116] text-[#1A1A1A] flex items-center justify-center font-black">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-slate-200">{currentUser.name}</span>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-[#3E3E3E] bg-[#282828] p-2.5 shadow-2xl z-50 text-xs font-bold space-y-1.5"
                >
                  <div className="p-2 border-b border-[#3E3E3E]">
                    <div className="font-bold text-white text-xs">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{currentUser.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#383838] border border-[#555555] px-2 py-0.5 text-[10px] font-bold text-[#FFA116]">
                      <Shield className="h-3 w-3" />
                      {ROLE_LABELS[currentUser.role]}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="px-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Role</div>
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => switchRole(r)}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center justify-between transition-colors',
                          currentUser.role === r ? 'bg-[#383838] text-[#FFA116]' : 'text-slate-300 hover:bg-[#303030] hover:text-white'
                        )}
                      >
                        <span>{ROLE_LABELS[r]}</span>
                        {currentUser.role === r && <Check className="h-3.5 w-3.5 text-[#FFA116]" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-[#3E3E3E]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[#FF2D55] hover:bg-[#383838] font-bold text-xs transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-[#FF2D55]" />
                      <span>Log Out</span>
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

import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, GitBranch, CalendarClock, Phone,
  GraduationCap, FileText, UserPlus, CreditCard, BookOpen, Megaphone,
  BarChart3, UsersRound, Workflow, MessageSquare, FolderOpen, Settings,
  Bell, HelpCircle, LogOut, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { GOGLogo, GOGLogoMark } from '@/components/ui/GOGLogo';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'crm_admin', 'team_leader', 'counsellor', 'admissions'] },
  { label: 'Leads', path: '/leads', icon: Users, roles: ['super_admin', 'crm_admin', 'team_leader', 'counsellor'] },
  { label: 'My Leads', path: '/leads/my', icon: UserCheck, roles: ['counsellor'] },
  { label: 'Pipeline', path: '/pipeline', icon: GitBranch, roles: ['super_admin', 'crm_admin', 'team_leader', 'counsellor'] },
  { label: 'Follow-ups', path: '/follow-ups', icon: CalendarClock, roles: ['super_admin', 'crm_admin', 'team_leader', 'counsellor'] },
  { label: 'Calls', path: '/calls', icon: Phone, roles: ['super_admin', 'crm_admin', 'team_leader', 'counsellor'] },
  { label: 'Students', path: '/students', icon: GraduationCap, roles: ['super_admin', 'crm_admin', 'team_leader', 'admissions'] },
  { label: 'Applications', path: '/applications', icon: FileText, roles: ['super_admin', 'crm_admin', 'team_leader', 'admissions'] },
  { label: 'Admissions', path: '/admissions', icon: UserPlus, roles: ['super_admin', 'crm_admin', 'admissions'] },
  { label: 'Payments', path: '/payments', icon: CreditCard, roles: ['super_admin', 'crm_admin', 'admissions'] },
  { label: 'Courses & Batches', path: '/courses', icon: BookOpen, roles: ['super_admin', 'crm_admin'] },
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone, roles: ['super_admin', 'crm_admin', 'team_leader'] },
  { label: 'Reports', path: '/reports', icon: BarChart3, roles: ['super_admin', 'crm_admin', 'team_leader'] },
  { label: 'Team', path: '/team', icon: UsersRound, roles: ['super_admin', 'crm_admin', 'team_leader'] },
  { label: 'Automations', path: '/automations', icon: Workflow, roles: ['super_admin', 'crm_admin'] },
  { label: 'Templates', path: '/templates', icon: MessageSquare, roles: ['super_admin', 'crm_admin'] },
  { label: 'Documents', path: '/documents', icon: FolderOpen, roles: ['super_admin', 'crm_admin', 'team_leader', 'counsellor', 'admissions'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'crm_admin'] },
];

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin', crm_admin: 'CRM Admin', team_leader: 'Team Leader',
  counsellor: 'Counsellor', admissions: 'Admissions',
};

const NAV_ICON_COLORS: Record<string, string> = {
  '/dashboard': 'text-sky-400',
  '/leads': 'text-emerald-400',
  '/my-leads': 'text-teal-400',
  '/pipeline': 'text-indigo-400',
  '/follow-ups': 'text-amber-400',
  '/calls': 'text-cyan-400',
  '/students': 'text-purple-400',
  '/applications': 'text-blue-400',
  '/admissions': 'text-teal-400',
  '/payments': 'text-emerald-400',
  '/courses': 'text-violet-400',
  '/campaigns': 'text-rose-400',
  '/reports': 'text-sky-400',
  '/team': 'text-indigo-400',
  '/automations': 'text-amber-400',
  '/templates': 'text-pink-400',
  '/documents': 'text-cyan-400',
  '/settings': 'text-slate-400',
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed = false, onToggle, isMobile = false, onClose }: SidebarProps) {
  const { currentUser, notifications, logout } = useAppStore();
  const navigate = useNavigate();

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredItems = useMemo(
    () => (currentUser ? NAV_ITEMS.filter((item) => item.roles.includes(currentUser.role)) : []),
    [currentUser?.role]
  );

  const handleNavClick = () => { if (isMobile) onClose?.(); };

  const handleLogout = () => {
    logout();
    if (isMobile) onClose?.();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 310 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative flex h-screen flex-col bg-[#282828] border-r border-[#3E3E3E]',
        'shadow-xl z-30 text-white',
        isMobile && 'fixed inset-y-0 left-0 z-50 shadow-2xl',
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        'flex items-center border-b border-[#3E3E3E] px-4 py-4 bg-[#282828]',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div key="full" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 cursor-pointer py-1" onClick={() => navigate('/')}>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all">
                <img
                  src="/logo-original.png"
                  alt="QuantNexa ai Solutions Pvt. Ltd."
                  className="h-16 sm:h-20 w-auto max-w-[260px] object-contain"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div key="mini" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="cursor-pointer flex justify-center py-1" onClick={() => navigate('/')}>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-center shadow-md">
                <img
                  src="/logo-mark.png"
                  alt="QuantNexa ai"
                  className="h-13 w-auto object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && (
          <button
            onClick={onToggle}
            className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-[#383838] hover:text-white', collapsed && 'hidden')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && !isMobile && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-[#383838] hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#303030] py-1.5 px-3 text-xs font-bold text-slate-300 border border-[#3E3E3E]">
            <Shield className="h-3.5 w-3.5 text-slate-400" />
            {ROLE_LABELS[currentUser.role]}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const iconColor = NAV_ICON_COLORS[item.path] || 'text-slate-400';
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-150',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-[#383838] text-white font-extrabold border-l-4 border-slate-300'
                  : 'text-[#A0A0A0] hover:bg-[#303030] hover:text-white',
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-white font-bold' : iconColor)} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {collapsed && (
                    <div className="pointer-events-none absolute left-full z-50 ml-2 hidden rounded-md bg-[#1A1A1A] border border-[#3E3E3E] px-3 py-1.5 text-xs font-bold text-sky-400 shadow-lg group-hover:block">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#3E3E3E] px-2 py-2 space-y-0.5 bg-[#282828]">
        <button
          onClick={() => { navigate('/dashboard'); handleNavClick(); }}
          className={cn('group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-[#303030] hover:text-white', collapsed && 'justify-center px-0')}
        >
          <Bell className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#FFA116]" />
          {!collapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <span className={cn('flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#FF2D55] px-1 text-[10px] font-bold text-white', collapsed ? 'absolute -right-0.5 -top-0.5' : 'ml-auto')}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button className={cn('group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-[#303030] hover:text-white', collapsed && 'justify-center px-0')}>
          <HelpCircle className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#FFA116]" />
          {!collapsed && <span>Help & Support</span>}
        </button>

        {/* Profile */}
        <div className={cn('flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-default', collapsed && 'justify-center px-0')}>
          <div className="relative shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FFA116] text-xs font-black text-[#1A1A1A]">
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#282828] bg-[#2CBB5D]" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{currentUser.name}</p>
              <p className="truncate text-[11px] text-slate-400">{currentUser.email}</p>
            </div>
          )}
        </div>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className={cn('group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-[#FF2D55] transition-colors hover:bg-[#383838] cursor-pointer', collapsed && 'justify-center px-0')}
        >
          <LogOut className="h-4 w-4 shrink-0 text-[#FF2D55]" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

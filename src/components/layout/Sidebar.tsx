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
      animate={{ width: collapsed ? 76 : 272 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative flex h-screen flex-col bg-[#0F172A] border-r border-[#D4AF37]/30',
        'shadow-2xl z-30 text-white',
        isMobile && 'fixed inset-y-0 left-0 z-50 shadow-2xl',
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        'flex items-center border-b border-[#D4AF37]/20 px-4 py-5 bg-[#0B0F17]',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div key="full" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="min-w-0 cursor-pointer overflow-hidden py-1" onClick={() => navigate('/')}>
              <GOGLogo size="md" />
            </motion.div>
          ) : (
            <motion.div key="mini" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="cursor-pointer" onClick={() => navigate('/')}>
              <GOGLogoMark size={42} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-amber-400 transition-all duration-200 hover:bg-[#161E2E] hover:text-white', collapsed && 'hidden')}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {collapsed && !isMobile && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="mx-auto mt-3 flex h-8 w-8 items-center justify-center rounded-xl text-amber-400 transition-all duration-200 hover:bg-[#161E2E] hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      )}

      {/* Role Badge */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 pt-4 pb-2"
        >
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[#161E2E] py-2 px-3 text-xs font-black text-[#FBBF24] ring-1 ring-[#D4AF37]/40 shadow-xs">
            <Shield className="h-3.5 w-3.5 text-[#FBBF24]" />
            {ROLE_LABELS[currentUser.role]}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#FBBF24] to-[#D4AF37] text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'text-slate-300 hover:bg-[#161E2E] hover:text-white',
              )}
            >
              {({ isActive }) => (
                <>
                  <motion.div whileHover={{ scale: 1.15, rotate: isActive ? 0 : 5 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <Icon className={cn('h-4.5 w-4.5 shrink-0 transition-colors', isActive ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-[#FBBF24]')} />
                  </motion.div>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {collapsed && (
                    <div className="pointer-events-none absolute left-full z-50 ml-3 hidden rounded-xl bg-[#0B0F17] border border-[#D4AF37]/40 px-3.5 py-2 text-xs font-bold text-[#FBBF24] opacity-0 shadow-xl transition-all duration-200 group-hover:block group-hover:opacity-100">
                      {item.label}
                      <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-[#0B0F17] border-l border-b border-[#D4AF37]/40" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#D4AF37]/20 px-3 py-3 space-y-0.5 bg-[#0B0F17]">
        <motion.button
          whileHover={{ x: 2 }}
          onClick={() => { navigate('/dashboard'); handleNavClick(); }}
          className={cn('group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-300 transition-all duration-200 hover:bg-[#161E2E] hover:text-white', collapsed && 'justify-center px-0')}
        >
          <Bell className="h-4.5 w-4.5 shrink-0 text-amber-400" />
          {!collapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <span className={cn('flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-black text-slate-950 shadow-xs', collapsed ? 'absolute -right-0.5 -top-0.5 ring-2 ring-slate-900' : 'ml-auto')}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </motion.button>

        <motion.button whileHover={{ x: 2 }} className={cn('group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-300 transition-all duration-200 hover:bg-[#161E2E] hover:text-white', collapsed && 'justify-center px-0')}>
          <HelpCircle className="h-4.5 w-4.5 shrink-0 text-amber-400" />
          {!collapsed && <span>Help & Support</span>}
        </motion.button>

        {/* Profile */}
        <motion.div whileHover={{ x: 2 }} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-default', collapsed && 'justify-center px-0')}>
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FBBF24] text-xs font-black text-slate-950 shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0B0F17] bg-emerald-500 shadow-xs" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-white">{currentUser.name}</p>
              <p className="truncate text-[11px] text-slate-400 font-bold">{currentUser.email}</p>
            </div>
          )}
        </motion.div>

        {/* Working LogOut Button */}
        <motion.button
          whileHover={{ x: 2 }}
          onClick={handleLogout}
          className={cn('group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-400 transition-all duration-200 hover:bg-rose-950/40 hover:text-rose-300 cursor-pointer', collapsed && 'justify-center px-0')}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0 group-hover:-rotate-12 transition-transform text-rose-400" />
          {!collapsed && <span>Log Out</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}

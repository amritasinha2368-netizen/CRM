import { create } from 'zustand';
import type { User, Lead, Notification, UserRole } from '../types';
import { leads as mockLeads, users as mockUsers, notifications as mockNotifications } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  leads: Lead[];
  notifications: Notification[];
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  setCurrentUser: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  addLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockUsers[0],
  leads: mockLeads,
  notifications: mockNotifications,
  sidebarCollapsed: false,
  theme: 'dark',
  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: mockUsers[0] }),
  switchRole: (role) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) set({ currentUser: user });
  },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  updateLead: (leadId, updates) =>
    set((s) => ({
      leads: s.leads.map((l) => (l.id === leadId ? { ...l, ...updates } : l)),
    })),
  addLead: (lead) =>
    set((s) => ({
      leads: [lead, ...s.leads],
    })),
  deleteLead: (leadId) =>
    set((s) => ({
      leads: s.leads.filter((l) => l.id !== leadId),
    })),
  addNotification: (notification) =>
    set((s) => ({
      notifications: [
        {
          ...notification,
          id: `N${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...s.notifications,
      ],
    })),
}));

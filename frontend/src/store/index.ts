import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification } from '@/types';
import { notifications as initialNotifs } from '@/data/mockData';

// ─── Auth Store ────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const MOCK_USER: User = {
  id: 'u1',
  name: 'Sarah Manager',
  email: 'sarah@vendorbridge.com',
  role: 'admin',
  department: 'Procurement',
  avatar: undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        // Mock: any non-empty credentials work
        if (email.trim()) {
          set({ user: { ...MOCK_USER, email }, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'vb-auth' }
  )
);

// ─── UI Store ──────────────────────────────────────────────────
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}));

// ─── Notification Store ────────────────────────────────────────
interface NotifState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useNotifStore = create<NotifState>()((set, get) => ({
  notifications: initialNotifs,
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));

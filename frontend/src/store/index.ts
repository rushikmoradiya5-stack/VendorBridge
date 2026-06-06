import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification, Vendor, PurchaseOrder, Invoice, InvoiceStatus } from '@/types';
import { notifications as initialNotifs, vendors as initialVendors, purchaseOrders as initialPOs, invoices as initialInvoices } from '@/data/mockData';

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

// ─── Data Store ────────────────────────────────────────────────
interface DataState {
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'number' | 'createdAt' | 'status'>) => void;
  approvePurchaseOrder: (poId: string, approverName: string) => void;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  addVendor: (vendor: Omit<Vendor, 'id' | 'joinedAt' | 'totalSpend' | 'totalOrders' | 'rating' | 'onTimeDelivery' | 'qualityScore'>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      vendors: initialVendors,
      purchaseOrders: initialPOs,
      invoices: initialInvoices,
      addPurchaseOrder: (poData) =>
        set((state) => {
          const nextNumber = `PO-2026-${String(state.purchaseOrders.length + 85).padStart(4, '0')}`;
          const newPo: PurchaseOrder = {
            ...poData,
            id: `po${state.purchaseOrders.length + 1}`,
            number: nextNumber,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
          };
          return { purchaseOrders: [newPo, ...state.purchaseOrders] };
        }),
      approvePurchaseOrder: (poId, approverName) =>
        set((state) => {
          const purchaseOrders = state.purchaseOrders.map((p) => {
            if (p.id !== poId) return p;
            return { ...p, status: 'approved' as const, approvedBy: approverName };
          });
          const po = state.purchaseOrders.find((p) => p.id === poId);
          let invoices = state.invoices;
          if (po && !state.invoices.some((i) => i.poId === poId)) {
            const nextInvNum = `INV-2026-${String(state.invoices.length + 212).padStart(4, '0')}`;
            const newInvoice: Invoice = {
              id: `inv${state.invoices.length + 1}`,
              number: nextInvNum,
              poId: po.id,
              poNumber: po.number,
              vendorId: po.vendorId,
              vendorName: po.vendorName,
              status: 'unpaid',
              amount: po.total,
              tax: po.tax,
              total: po.total,
              currency: po.currency,
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              items: po.lineItems,
            };
            invoices = [newInvoice, ...invoices];
          }
          return { purchaseOrders, invoices };
        }),
      updateInvoiceStatus: (invoiceId, status) =>
        set((state) => {
          const invoice = state.invoices.find((i) => i.id === invoiceId);
          let vendors = state.vendors;
          if (invoice && status === 'paid' && invoice.status !== 'paid') {
            vendors = state.vendors.map((v) => {
              if (v.id !== invoice.vendorId) return v;
              return {
                ...v,
                totalSpend: v.totalSpend + invoice.total,
                totalOrders: v.totalOrders + 1,
              };
            });
          }
          const invoices = state.invoices.map((i) => {
            if (i.id !== invoiceId) return i;
            const updated: Invoice = { ...i, status };
            if (status === 'paid') {
              updated.paidDate = new Date().toISOString().split('T')[0];
            }
            return updated;
          });
          return { invoices, vendors };
        }),
      addVendor: (vendorData) =>
        set((state) => {
          const newVendor: Vendor = {
            ...vendorData,
            id: `v${state.vendors.length + 1}`,
            joinedAt: new Date().toISOString().split('T')[0],
            totalSpend: 0,
            totalOrders: 0,
            rating: 0,
            onTimeDelivery: 0,
            qualityScore: 0,
          };
          return { vendors: [...state.vendors, newVendor] };
        }),
    }),
    { name: 'vb-data' }
  )
);

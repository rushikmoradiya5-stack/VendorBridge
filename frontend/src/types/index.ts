// ─── Vendor ───────────────────────────────────────────────────
export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  status: 'active' | 'inactive' | 'pending' | 'blacklisted';
  rating: number;          // 1-5
  onTimeDelivery: number;  // %
  qualityScore: number;    // %
  totalSpend: number;      // USD
  totalOrders: number;
  joinedAt: string;        // ISO date
  tags: string[];
}

// ─── Purchase Order ───────────────────────────────────────────
export interface POLineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export type POStatus = 'draft' | 'pending' | 'approved' | 'sent' | 'fulfilled' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  number: string;
  vendorId: string;
  vendorName: string;
  status: POStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lineItems: POLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  deliveryDate?: string;
  notes?: string;
  approvedBy?: string;
  department: string;
  category: string;
  createdAt: string;
}

// ─── Invoice ──────────────────────────────────────────────────
export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue' | 'review' | 'disputed';

export interface Invoice {
  id: string;
  number: string;
  poId?: string;
  poNumber?: string;
  vendorId: string;
  vendorName: string;
  status: InvoiceStatus;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: POLineItem[];
  notes?: string;
}

// ─── Analytics ────────────────────────────────────────────────
export interface SpendByCategory {
  category: string;
  amount: number;
  pct: number;
  trend: number; // % change vs prev month
}

export interface MonthlySpend {
  month: string;
  spend: number;
  budget: number;
  orders: number;
}

export interface VendorPerformance {
  vendor: string;
  onTime: number;
  quality: number;
  responsiveness: number;
  pricing: number;
  compliance: number;
}

// ─── Notification ─────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'po_approved' | 'invoice_due' | 'vendor_onboarded' | 'budget_alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  avatar?: string;
  department: string;
}

import type { Vendor, PurchaseOrder, Invoice, MonthlySpend, SpendByCategory, VendorPerformance, Notification } from '@/types';

// ─── VENDORS ──────────────────────────────────────────────────
export const vendors: Vendor[] = [
  { id: 'v1', name: 'TechNova Solutions', category: 'IT & Software', contact: 'Alice Kim', email: 'alice@technova.com', phone: '+1 415 555 0101', country: 'USA', status: 'active', rating: 4.8, onTimeDelivery: 97, qualityScore: 95, totalSpend: 1250000, totalOrders: 84, joinedAt: '2022-03-15', tags: ['preferred', 'software'] },
  { id: 'v2', name: 'Apex Manufacturing', category: 'Manufacturing', contact: 'Bob Patel', email: 'bob@apexmfg.com', phone: '+1 312 555 0202', country: 'USA', status: 'active', rating: 4.5, onTimeDelivery: 91, qualityScore: 89, totalSpend: 870000, totalOrders: 62, joinedAt: '2021-07-22', tags: ['preferred'] },
  { id: 'v3', name: 'GreenLeaf Supplies', category: 'Office Supplies', contact: 'Carol Wu', email: 'carol@greenleaf.com', phone: '+44 20 7946 0330', country: 'UK', status: 'active', rating: 4.2, onTimeDelivery: 88, qualityScore: 92, totalSpend: 340000, totalOrders: 137, joinedAt: '2020-11-05', tags: ['eco-friendly'] },
  { id: 'v4', name: 'DataStream Analytics', category: 'IT & Software', contact: 'David Reyes', email: 'david@datastream.io', phone: '+1 628 555 0404', country: 'USA', status: 'pending', rating: 0, onTimeDelivery: 0, qualityScore: 0, totalSpend: 0, totalOrders: 0, joinedAt: '2026-01-10', tags: ['new'] },
  { id: 'v5', name: 'SteelCore Industries', category: 'Raw Materials', contact: 'Eva Hoffmann', email: 'eva@steelcore.de', phone: '+49 30 555 0505', country: 'Germany', status: 'active', rating: 4.6, onTimeDelivery: 94, qualityScore: 91, totalSpend: 2100000, totalOrders: 45, joinedAt: '2019-06-01', tags: ['preferred', 'strategic'] },
  { id: 'v6', name: 'CloudHarbor Services', category: 'Cloud & Hosting', contact: 'Frank Lee', email: 'frank@cloudharbor.io', phone: '+1 206 555 0606', country: 'USA', status: 'active', rating: 4.9, onTimeDelivery: 99, qualityScore: 98, totalSpend: 560000, totalOrders: 24, joinedAt: '2023-02-28', tags: ['preferred', 'cloud'] },
  { id: 'v7', name: 'SafeGuard Security', category: 'Security', contact: 'Grace Tanaka', email: 'grace@safeguard.jp', phone: '+81 3 5555 0707', country: 'Japan', status: 'inactive', rating: 3.8, onTimeDelivery: 78, qualityScore: 82, totalSpend: 210000, totalOrders: 19, joinedAt: '2021-09-14', tags: [] },
  { id: 'v8', name: 'Pristine Logistics', category: 'Logistics', contact: 'Henry Osei', email: 'henry@pristine.co', phone: '+233 30 555 0808', country: 'Ghana', status: 'active', rating: 4.3, onTimeDelivery: 90, qualityScore: 88, totalSpend: 490000, totalOrders: 78, joinedAt: '2022-08-19', tags: ['logistics'] },
];

// ─── PURCHASE ORDERS ──────────────────────────────────────────
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1', number: 'PO-2026-0084', vendorId: 'v1', vendorName: 'TechNova Solutions',
    status: 'approved', priority: 'high',
    lineItems: [
      { id: 'li1', description: 'Enterprise Software Licenses (50 seats)', qty: 50, unit: 'seat', unitPrice: 1200, total: 60000 },
      { id: 'li2', description: 'Implementation & Setup Fee', qty: 1, unit: 'lump sum', unitPrice: 8000, total: 8000 },
    ],
    subtotal: 68000, tax: 5440, total: 73440, currency: 'USD',
    issueDate: '2026-05-20', dueDate: '2026-06-20', deliveryDate: '2026-06-15',
    department: 'IT', category: 'IT & Software', createdAt: '2026-05-20',
    approvedBy: 'Sarah Manager', notes: 'Priority deployment for Q2.',
  },
  {
    id: 'po2', number: 'PO-2026-0083', vendorId: 'v5', vendorName: 'SteelCore Industries',
    status: 'pending', priority: 'urgent',
    lineItems: [
      { id: 'li3', description: 'Steel Rods Grade A (5000 units)', qty: 5000, unit: 'unit', unitPrice: 45, total: 225000 },
      { id: 'li4', description: 'Shipping & Freight', qty: 1, unit: 'lump sum', unitPrice: 12000, total: 12000 },
    ],
    subtotal: 237000, tax: 0, total: 237000, currency: 'USD',
    issueDate: '2026-06-01', dueDate: '2026-06-30',
    department: 'Operations', category: 'Raw Materials', createdAt: '2026-06-01',
  },
  {
    id: 'po3', number: 'PO-2026-0082', vendorId: 'v3', vendorName: 'GreenLeaf Supplies',
    status: 'fulfilled', priority: 'low',
    lineItems: [
      { id: 'li5', description: 'Office Stationery Bundle', qty: 200, unit: 'pack', unitPrice: 25, total: 5000 },
      { id: 'li6', description: 'Printer Paper A4 (500 reams)', qty: 500, unit: 'ream', unitPrice: 6, total: 3000 },
    ],
    subtotal: 8000, tax: 640, total: 8640, currency: 'USD',
    issueDate: '2026-04-10', dueDate: '2026-05-10', deliveryDate: '2026-05-05',
    department: 'Admin', category: 'Office Supplies', createdAt: '2026-04-10',
    approvedBy: 'James Admin',
  },
  {
    id: 'po4', number: 'PO-2026-0081', vendorId: 'v6', vendorName: 'CloudHarbor Services',
    status: 'approved', priority: 'medium',
    lineItems: [
      { id: 'li7', description: 'Cloud Compute (12 months, 50 nodes)', qty: 12, unit: 'month', unitPrice: 4200, total: 50400 },
    ],
    subtotal: 50400, tax: 4032, total: 54432, currency: 'USD',
    issueDate: '2026-05-28', dueDate: '2026-06-28',
    department: 'IT', category: 'Cloud & Hosting', createdAt: '2026-05-28',
    approvedBy: 'Sarah Manager',
  },
  {
    id: 'po5', number: 'PO-2026-0080', vendorId: 'v2', vendorName: 'Apex Manufacturing',
    status: 'draft', priority: 'medium',
    lineItems: [
      { id: 'li8', description: 'Custom Machined Parts (Batch 12)', qty: 500, unit: 'unit', unitPrice: 340, total: 170000 },
    ],
    subtotal: 170000, tax: 13600, total: 183600, currency: 'USD',
    issueDate: '2026-06-05', dueDate: '2026-07-05',
    department: 'Production', category: 'Manufacturing', createdAt: '2026-06-05',
  },
  {
    id: 'po6', number: 'PO-2026-0079', vendorId: 'v8', vendorName: 'Pristine Logistics',
    status: 'sent', priority: 'high',
    lineItems: [
      { id: 'li9', description: 'Express Freight — West Africa Route', qty: 1, unit: 'shipment', unitPrice: 28000, total: 28000 },
    ],
    subtotal: 28000, tax: 0, total: 28000, currency: 'USD',
    issueDate: '2026-05-30', dueDate: '2026-06-15',
    department: 'Logistics', category: 'Logistics', createdAt: '2026-05-30',
  },
];

// ─── INVOICES ─────────────────────────────────────────────────
export const invoices: Invoice[] = [
  {
    id: 'inv1', number: 'INV-2026-0211', poId: 'po1', poNumber: 'PO-2026-0084',
    vendorId: 'v1', vendorName: 'TechNova Solutions',
    status: 'unpaid', amount: 73440, tax: 5440, total: 73440, currency: 'USD',
    issueDate: '2026-06-01', dueDate: '2026-06-30',
    items: [
      { id: 'li1', description: 'Enterprise Software Licenses (50 seats)', qty: 50, unit: 'seat', unitPrice: 1200, total: 60000 },
      { id: 'li2', description: 'Implementation & Setup Fee', qty: 1, unit: 'lump sum', unitPrice: 8000, total: 8000 },
    ],
  },
  {
    id: 'inv2', number: 'INV-2026-0205', poId: 'po3', poNumber: 'PO-2026-0082',
    vendorId: 'v3', vendorName: 'GreenLeaf Supplies',
    status: 'paid', amount: 8640, tax: 640, total: 8640, currency: 'USD',
    issueDate: '2026-05-06', dueDate: '2026-05-20', paidDate: '2026-05-18',
    items: [
      { id: 'li5', description: 'Office Stationery Bundle', qty: 200, unit: 'pack', unitPrice: 25, total: 5000 },
      { id: 'li6', description: 'Printer Paper A4 (500 reams)', qty: 500, unit: 'ream', unitPrice: 6, total: 3000 },
    ],
  },
  {
    id: 'inv3', number: 'INV-2026-0198', vendorId: 'v5', vendorName: 'SteelCore Industries',
    status: 'overdue', amount: 118500, tax: 0, total: 118500, currency: 'USD',
    issueDate: '2026-04-15', dueDate: '2026-05-15',
    items: [
      { id: 'li10', description: 'Steel Coils Grade B (2500 units)', qty: 2500, unit: 'unit', unitPrice: 47.4, total: 118500 },
    ],
    notes: 'Part of Q1 standing order. Overdue - escalate to finance.',
  },
  {
    id: 'inv4', number: 'INV-2026-0210', poId: 'po4', poNumber: 'PO-2026-0081',
    vendorId: 'v6', vendorName: 'CloudHarbor Services',
    status: 'review', amount: 54432, tax: 4032, total: 54432, currency: 'USD',
    issueDate: '2026-06-02', dueDate: '2026-07-02',
    items: [
      { id: 'li7', description: 'Cloud Compute (12 months, 50 nodes)', qty: 12, unit: 'month', unitPrice: 4200, total: 50400 },
    ],
    notes: 'Under review — checking node count vs contract.',
  },
  {
    id: 'inv5', number: 'INV-2026-0188', vendorId: 'v8', vendorName: 'Pristine Logistics',
    status: 'paid', amount: 18700, tax: 0, total: 18700, currency: 'USD',
    issueDate: '2026-03-20', dueDate: '2026-04-20', paidDate: '2026-04-15',
    items: [
      { id: 'li11', description: 'Sea Freight — Europe Q1 Batch', qty: 1, unit: 'shipment', unitPrice: 18700, total: 18700 },
    ],
  },
];

// ─── MONTHLY SPEND ─────────────────────────────────────────────
export const monthlySpend: MonthlySpend[] = [
  { month: 'Jan', spend: 820000,  budget: 900000,  orders: 38 },
  { month: 'Feb', spend: 750000,  budget: 900000,  orders: 34 },
  { month: 'Mar', spend: 1100000, budget: 950000,  orders: 52 },
  { month: 'Apr', spend: 930000,  budget: 950000,  orders: 44 },
  { month: 'May', spend: 860000,  budget: 950000,  orders: 41 },
  { month: 'Jun', spend: 610000,  budget: 1000000, orders: 29 },
];

// ─── SPEND BY CATEGORY ─────────────────────────────────────────
export const spendByCategory: SpendByCategory[] = [
  { category: 'IT & Software',   amount: 1810000, pct: 32, trend: 8.2 },
  { category: 'Raw Materials',   amount: 2100000, pct: 37, trend: -3.1 },
  { category: 'Cloud & Hosting', amount: 560000,  pct: 10, trend: 14.7 },
  { category: 'Office Supplies', amount: 340000,  pct: 6,  trend: -1.2 },
  { category: 'Logistics',       amount: 490000,  pct: 9,  trend: 5.5 },
  { category: 'Security',        amount: 210000,  pct: 4,  trend: 0 },
  { category: 'Manufacturing',   amount: 870000,  pct: 15, trend: 2.8 },
];

// ─── VENDOR PERFORMANCE ────────────────────────────────────────
export const vendorPerformance: VendorPerformance[] = [
  { vendor: 'TechNova',   onTime: 97, quality: 95, responsiveness: 92, pricing: 88, compliance: 99 },
  { vendor: 'SteelCore',  onTime: 94, quality: 91, responsiveness: 80, pricing: 85, compliance: 96 },
  { vendor: 'CloudHarbor',onTime: 99, quality: 98, responsiveness: 97, pricing: 78, compliance: 100 },
  { vendor: 'Apex Mfg',   onTime: 91, quality: 89, responsiveness: 85, pricing: 90, compliance: 88 },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'n1', type: 'po_approved', title: 'PO Approved', message: 'PO-2026-0084 has been approved by Sarah Manager.', timestamp: '2026-06-06T08:30:00Z', read: false },
  { id: 'n2', type: 'invoice_due', title: 'Invoice Overdue', message: 'INV-2026-0198 from SteelCore Industries is 22 days overdue.', timestamp: '2026-06-05T14:10:00Z', read: false },
  { id: 'n3', type: 'vendor_onboarded', title: 'New Vendor', message: 'DataStream Analytics has completed onboarding.', timestamp: '2026-06-05T09:00:00Z', read: true },
  { id: 'n4', type: 'budget_alert', title: 'Budget Alert', message: 'Operations dept reached 95% of monthly budget.', timestamp: '2026-06-04T11:45:00Z', read: true },
  { id: 'n5', type: 'po_approved', title: 'PO Approved', message: 'PO-2026-0081 — CloudHarbor Services has been approved.', timestamp: '2026-06-03T16:00:00Z', read: true },
];

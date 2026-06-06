import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { purchaseOrders } from '@/data/mockData';
import { currency, formatDate, statusColor, priorityColor, cn } from '@/lib/utils';
import type { POStatus } from '@/types';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Sent', value: 'sent' },
  { label: 'Fulfilled', value: 'fulfilled' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function PurchaseOrders() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = purchaseOrders.filter((po) => {
    const q = search.toLowerCase();
    const matchSearch = !q || po.number.toLowerCase().includes(q) || po.vendorName.toLowerCase().includes(q) || po.department.toLowerCase().includes(q);
    const matchStatus = activeTab === 'all' || po.status === activeTab;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_TABS.map((t) => ({
    ...t,
    count: t.value === 'all' ? purchaseOrders.length : purchaseOrders.filter((p) => p.status === t.value).length,
  }));

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Purchase Orders</h1>
          <p className="text-sm text-slate-400 mt-0.5">{purchaseOrders.length} total orders</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          <Plus className="w-4 h-4" /> Create PO
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-200">
        {counts.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-fast -mb-px',
              activeTab === t.value
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span className={cn('ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full', activeTab === t.value ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500')}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9 h-9" placeholder="Search by PO number, vendor…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-outline btn-sm"><Filter className="w-4 h-4" /> Filter</button>
        <span className="text-sm text-slate-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Vendor</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Total</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((po, i) => (
                <motion.tr key={po.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <p className="font-semibold text-slate-800">{po.number}</p>
                    <p className="text-[11px] text-slate-400">{po.category}</p>
                  </td>
                  <td>
                    <p className="font-medium text-slate-700">{po.vendorName}</p>
                  </td>
                  <td className="text-slate-500">{po.department}</td>
                  <td><span className={cn('badge', priorityColor(po.priority))}>{po.priority}</span></td>
                  <td><span className={cn('badge', statusColor(po.status))}>{po.status}</span></td>
                  <td className="font-semibold">{currency(po.total)}</td>
                  <td className="text-slate-500">{formatDate(po.issueDate)}</td>
                  <td className="text-slate-500">{formatDate(po.dueDate)}</td>
                  <td>
                    <Link to={`/orders/${po.id}`} className="btn btn-sm btn-ghost text-brand-600">View</Link>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-10 text-center text-slate-400 text-sm">No purchase orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

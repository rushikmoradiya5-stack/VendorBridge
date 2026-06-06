import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import { invoices } from '@/data/mockData';
import { currency, formatDate, statusColor, cn } from '@/lib/utils';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Under Review', value: 'review' },
  { label: 'Disputed', value: 'disputed' },
];

export default function Invoices() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      (!q || inv.number.toLowerCase().includes(q) || inv.vendorName.toLowerCase().includes(q)) &&
      (tab === 'all' || inv.status === tab)
    );
  });

  const overdueTotal = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Invoices</h1>
          <p className="text-sm text-slate-400 mt-0.5">{invoices.length} invoices</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueTotal > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-danger">Overdue balance: {currency(overdueTotal)}</span>
            {' '}— Escalate to Finance.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-200">
        {TABS.map((t) => {
          const count = t.value === 'all' ? invoices.length : invoices.filter((i) => i.status === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-fast -mb-px',
                tab === t.value ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              {t.label}
              {count > 0 && (
                <span className={cn('ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full', tab === t.value ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input className="input pl-9 h-9" placeholder="Search invoices…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Vendor</th>
                <th>PO Ref</th>
                <th>Amount</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td className="font-semibold text-slate-800">{inv.number}</td>
                  <td>
                    <Link to={`/vendors/${inv.vendorId}`} className="text-brand-600 hover:underline font-medium">
                      {inv.vendorName}
                    </Link>
                  </td>
                  <td className="text-slate-500">{inv.poNumber || '—'}</td>
                  <td className="font-bold">{currency(inv.total)}</td>
                  <td>{formatDate(inv.issueDate)}</td>
                  <td className={cn(inv.status === 'overdue' ? 'text-danger font-semibold' : '')}>{formatDate(inv.dueDate)}</td>
                  <td className="text-slate-500">{inv.paidDate ? formatDate(inv.paidDate) : '—'}</td>
                  <td><span className={cn('badge', statusColor(inv.status))}>{inv.status}</span></td>
                  <td><Link to={`/invoices/${inv.id}`} className="btn btn-sm btn-ghost text-brand-600">View</Link></td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-10 text-center text-slate-400">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

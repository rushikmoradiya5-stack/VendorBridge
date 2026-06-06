import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDataStore } from '@/store';
import { currency, formatDate, statusColor, cn } from '@/lib/utils';

export default function InvoiceDetail() {
  const { id } = useParams();
  const { invoices, updateInvoiceStatus } = useDataStore();
  const inv = invoices.find((i) => i.id === id);

  if (!inv) {
    return (
      <div className="p-6">
        <Link to="/invoices" className="btn btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <p className="mt-4 text-slate-500">Invoice not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/invoices" className="btn btn-ghost btn-sm"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-heading font-bold text-slate-800">{inv.number}</h1>
              <span className={cn('badge', statusColor(inv.status))}>{inv.status}</span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              {inv.vendorName} {inv.poNumber && `· ${inv.poNumber}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm"><Printer className="w-4 h-4" /> Export PDF</button>
          {inv.status === 'unpaid' && (
            <button 
              onClick={() => updateInvoiceStatus(inv.id, 'paid')} 
              className="btn btn-success btn-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Paid
            </button>
          )}
          {inv.status === 'overdue' && (
            <button 
              onClick={() => updateInvoiceStatus(inv.id, 'disputed')} 
              className="btn btn-danger btn-sm"
            >
              <AlertCircle className="w-4 h-4" /> Escalate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice Document Preview */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VB</span>
                  </div>
                  <span className="text-lg font-heading font-bold text-slate-800">VendorBridge</span>
                </div>
                <p className="text-xs text-slate-500">123 Procurement Plaza, San Francisco, CA</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-heading font-bold text-slate-800">INVOICE</p>
                <p className="text-sm text-slate-500 mt-1"># {inv.number}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">From</p>
                <p className="font-semibold text-slate-800">{inv.vendorName}</p>
                <p className="text-sm text-slate-500 mt-0.5">Contact: {inv.vendorId}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Invoice Details</p>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-4"><span className="text-slate-500">Issue Date</span><span className="font-medium">{formatDate(inv.issueDate)}</span></div>
                  <div className="flex gap-4"><span className="text-slate-500">Due Date</span><span className={cn('font-medium', inv.status === 'overdue' ? 'text-danger' : '')}>{formatDate(inv.dueDate)}</span></div>
                  {inv.paidDate && <div className="flex gap-4"><span className="text-slate-500">Paid</span><span className="font-medium text-success">{formatDate(inv.paidDate)}</span></div>}
                  {inv.poNumber && <div className="flex gap-4"><span className="text-slate-500">PO Ref</span><span className="font-medium">{inv.poNumber}</span></div>}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="table-wrapper rounded-xl overflow-hidden border border-slate-100">
              <table className="table">
                <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th className="text-right">Total</th></tr></thead>
                <tbody>
                  {inv.items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.description}</td>
                      <td>{item.qty} {item.unit}</td>
                      <td>{currency(item.unitPrice)}</td>
                      <td className="text-right font-semibold">{currency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{currency(inv.amount - inv.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>
                <span>{currency(inv.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                <span>Total Due</span>
                <span className="text-brand-600">{currency(inv.total)}</span>
              </div>
            </div>

            {/* Notes */}
            {inv.notes && (
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-800 mb-1">Note</p>
                <p className="text-xs text-amber-700">{inv.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-3">Invoice Status</h2>
            <span className={cn('badge text-sm px-3 py-1.5', statusColor(inv.status))}>{inv.status}</span>
            {inv.status === 'overdue' && (
              <p className="text-xs text-danger mt-2">
                Overdue by {Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 86400000)} days
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-3">Actions</h2>
            <div className="space-y-2">
              {inv.status === 'unpaid' && (
                <button 
                  onClick={() => updateInvoiceStatus(inv.id, 'paid')} 
                  className="btn btn-success w-full justify-center"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark as Paid
                </button>
              )}
              {inv.status === 'overdue' && (
                <button 
                  onClick={() => updateInvoiceStatus(inv.id, 'disputed')} 
                  className="btn btn-danger w-full justify-center"
                >
                  <AlertCircle className="w-4 h-4" /> Escalate to Finance
                </button>
              )}
              <button className="btn btn-outline w-full justify-center"><Printer className="w-4 h-4" /> Export PDF</button>
              {inv.poId && (
                <Link to={`/orders/${inv.poId}`} className="btn btn-secondary w-full justify-center">
                  View Purchase Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

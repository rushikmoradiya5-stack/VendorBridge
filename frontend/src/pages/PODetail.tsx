import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, CheckCircle2, Clock, Send, Package, X, Printer } from 'lucide-react';
import { useDataStore, useAuthStore } from '@/store';
import { currency, formatDate, statusColor, priorityColor, cn } from '@/lib/utils';

const timeline = (status: string) => {
  const steps = [
    { label: 'Created', icon: Clock, done: true },
    { label: 'Pending Approval', icon: Clock, done: ['pending','approved','sent','fulfilled'].includes(status) },
    { label: 'Approved', icon: CheckCircle2, done: ['approved','sent','fulfilled'].includes(status) },
    { label: 'Sent to Vendor', icon: Send, done: ['sent','fulfilled'].includes(status) },
    { label: 'Fulfilled', icon: Package, done: status === 'fulfilled' },
  ];
  return steps;
};

export default function PODetail() {
  const { id } = useParams();
  const { purchaseOrders, vendors, approvePurchaseOrder } = useDataStore();
  const { user } = useAuthStore();
  
  const po = purchaseOrders.find((p) => p.id === id);
  const vendor = vendors.find((v) => v.id === po?.vendorId);

  if (!po) {
    return (
      <div className="p-6">
        <Link to="/orders" className="btn btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <p className="mt-4 text-slate-500">Purchase order not found.</p>
      </div>
    );
  }

  const steps = timeline(po.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="btn btn-ghost btn-sm"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-heading font-bold text-slate-800">{po.number}</h1>
              <span className={cn('badge', statusColor(po.status))}>{po.status}</span>
              <span className={cn('badge', priorityColor(po.priority))}>{po.priority} priority</span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{po.category} · {po.department}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm"><Printer className="w-4 h-4" /> Print / Export PDF</button>
          {po.status === 'draft' && <button className="btn btn-primary btn-sm"><Send className="w-4 h-4" /> Submit for Approval</button>}
          {po.status === 'pending' && (
            <button 
              onClick={() => approvePurchaseOrder(po.id, user?.name || 'Sarah Manager')} 
              className="btn btn-success btn-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Vendor Info */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-4">Vendor Information</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold">
                {po.vendorName.charAt(0)}
              </div>
              <div>
                <Link to={`/vendors/${po.vendorId}`} className="font-semibold text-slate-800 hover:text-brand-600 transition-fast">{po.vendorName}</Link>
                <p className="text-sm text-slate-500">{vendor?.category}</p>
                {vendor && (
                  <p className="text-xs text-slate-400 mt-0.5">{vendor.email} · {vendor.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-4">Line Items</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th></tr></thead>
                <tbody>
                  {po.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium text-slate-700">{item.description}</td>
                      <td>{item.qty}</td>
                      <td className="text-slate-500">{item.unit}</td>
                      <td>{currency(item.unitPrice)}</td>
                      <td className="font-semibold">{currency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals */}
            <div className="mt-4 space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{currency(po.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (8%)</span>
                <span className="font-medium">{currency(po.tax)}</span>
              </div>
              <div className="flex justify-between text-base border-t border-slate-200 pt-2">
                <span className="font-semibold text-slate-800">Total</span>
                <span className="font-bold text-slate-800">{currency(po.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {po.notes && (
            <div className="card p-5">
              <h2 className="font-heading font-semibold text-slate-800 mb-2">Notes</h2>
              <p className="text-sm text-slate-600">{po.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Dates */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-4">Key Dates</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Issue Date', value: formatDate(po.issueDate) },
                { label: 'Due Date', value: formatDate(po.dueDate) },
                ...(po.deliveryDate ? [{ label: 'Delivery Date', value: formatDate(po.deliveryDate) }] : []),
                ...(po.approvedBy ? [{ label: 'Approved By', value: po.approvedBy }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-medium text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Timeline */}
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-4">Approval Timeline</h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', step.done ? 'bg-success text-white' : 'bg-slate-100 text-slate-400')}>
                    <step.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn('text-sm', step.done ? 'text-slate-800 font-medium' : 'text-slate-400')}>{step.label}</span>
                  {step.done && <span className="ml-auto text-[10px] text-success font-semibold">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

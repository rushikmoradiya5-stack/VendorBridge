import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { vendors } from '@/data/mockData';

export default function NewPO() {
  const navigate = useNavigate();
  const [lineItems, setLineItems] = useState([
    { id: '1', description: '', qty: 1, unit: 'unit', unitPrice: 0, total: 0 },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const addLine = () =>
    setLineItems((prev) => [...prev, { id: Date.now().toString(), description: '', qty: 1, unit: 'unit', unitPrice: 0, total: 0 }]);

  const removeLine = (id: string) =>
    setLineItems((prev) => prev.filter((l) => l.id !== id));

  const updateLine = (id: string, field: string, value: string | number) => {
    setLineItems((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        updated.total = updated.qty * updated.unitPrice;
        return updated;
      })
    );
  };

  const subtotal = lineItems.reduce((s, l) => s + l.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/orders'), 1500);
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-heading font-semibold text-slate-800">Purchase Order Created!</p>
        <p className="text-sm text-slate-500">Redirecting to Purchase Orders…</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/orders')} className="btn btn-ghost btn-sm"><ArrowLeft className="w-4 h-4" /></button>
        <h1 className="text-xl font-heading font-bold text-slate-800">New Purchase Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-heading font-semibold text-slate-800">Order Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Vendor *</label>
              <select className="input" required>
                <option value="">Select a vendor…</option>
                {vendors.filter((v) => v.status === 'active').map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Department *</label>
              <select className="input" required>
                {['IT', 'Operations', 'Finance', 'Admin', 'Production', 'Logistics'].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input">
                {['low', 'medium', 'high', 'urgent'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input type="date" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" rows={2} placeholder="Any special instructions or notes…" />
          </div>
        </div>

        {/* Line Items */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-slate-800">Line Items</h2>
            <button type="button" onClick={addLine} className="btn btn-outline btn-sm">
              <Plus className="w-4 h-4" /> Add Line
            </button>
          </div>
          <div className="space-y-3">
            {lineItems.map((line) => (
              <div key={line.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <input className="input text-sm" placeholder="Description" value={line.description} onChange={(e) => updateLine(line.id, 'description', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <input className="input text-sm" type="number" min="1" placeholder="Qty" value={line.qty} onChange={(e) => updateLine(line.id, 'qty', Number(e.target.value))} />
                </div>
                <div className="col-span-2">
                  <input className="input text-sm" placeholder="Unit" value={line.unit} onChange={(e) => updateLine(line.id, 'unit', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <input className="input text-sm" type="number" min="0" step="0.01" placeholder="Unit Price" value={line.unitPrice || ''} onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))} />
                </div>
                <div className="col-span-1 text-sm font-semibold text-slate-700 text-right">
                  ${line.total.toLocaleString()}
                </div>
                <div className="col-span-1 flex justify-end">
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => removeLine(line.id)} className="btn-icon btn-ghost text-danger">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium">${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Tax (8%)</span><span className="font-medium">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2"><span>Total</span><span className="text-brand-600">${total.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/orders')} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-secondary">Save as Draft</button>
          <button type="submit" className="btn btn-primary">Submit for Approval</button>
        </div>
      </form>
    </div>
  );
}

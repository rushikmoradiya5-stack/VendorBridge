import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Mail, Phone, MapPin, Calendar, ExternalLink, TrendingUp } from 'lucide-react';
import { useDataStore } from '@/store';
import { currency, formatDate, statusColor, cn } from '@/lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function VendorDetail() {
  const { id } = useParams();
  const { vendors, purchaseOrders, invoices } = useDataStore();
  const vendor = vendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <div className="p-6 flex items-center gap-3">
        <Link to="/vendors" className="btn btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <p className="text-slate-500">Vendor not found.</p>
      </div>
    );
  }

  const vPOs = purchaseOrders.filter((p) => p.vendorId === id);
  const vInvoices = invoices.filter((i) => i.vendorId === id);

  const radarData = [
    { metric: 'On-Time', val: vendor.onTimeDelivery || 0 },
    { metric: 'Quality', val: vendor.qualityScore || 0 },
    { metric: 'Responsiveness', val: 80 },
    { metric: 'Pricing', val: 85 },
    { metric: 'Compliance', val: 92 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Link to="/vendors" className="btn btn-ghost btn-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Vendors
      </Link>

      {/* Header Card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-bold">
              {vendor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-heading font-bold text-slate-800">{vendor.name}</h1>
                <span className={cn('badge', statusColor(vendor.status))}>{vendor.status}</span>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">{vendor.category}</p>
              <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{vendor.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{vendor.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{vendor.country}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {formatDate(vendor.joinedAt)}</span>
              </div>
            </div>
          </div>
          {vendor.rating > 0 && (
            <div className="flex items-center gap-1 bg-warning/10 text-warning px-3 py-2 rounded-xl">
              <Star className="w-4 h-4 fill-warning" />
              <span className="text-lg font-bold">{vendor.rating.toFixed(1)}</span>
              <span className="text-xs text-warning/80 ml-1">/ 5.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Spend', value: vendor.totalSpend > 0 ? currency(vendor.totalSpend) : '—', color: 'text-brand-600' },
          { label: 'Total Orders', value: vendor.totalOrders > 0 ? vendor.totalOrders : '—', color: 'text-slate-800' },
          { label: 'On-Time Delivery', value: vendor.onTimeDelivery > 0 ? `${vendor.onTimeDelivery}%` : '—', color: vendor.onTimeDelivery >= 90 ? 'text-success' : 'text-warning' },
          { label: 'Quality Score', value: vendor.qualityScore > 0 ? `${vendor.qualityScore}%` : '—', color: vendor.qualityScore >= 90 ? 'text-success' : 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className={cn('text-2xl font-bold font-heading', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Radar */}
        {vendor.rating > 0 && (
          <div className="card p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-4">Performance Radar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#cbd5e1' }} />
                <Radar dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Purchase Orders */}
        <div className={cn('card p-5', vendor.rating > 0 ? 'lg:col-span-2' : 'lg:col-span-3')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-slate-800">Purchase Orders</h2>
            <Link to="/orders" className="text-xs text-brand-600 hover:underline flex items-center gap-1">View all <ExternalLink className="w-3 h-3" /></Link>
          </div>
          {vPOs.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No purchase orders for this vendor.</p>
          ) : (
            <div className="space-y-2">
              {vPOs.map((po) => (
                <Link key={po.id} to={`/orders/${po.id}`} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-fast">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{po.number}</p>
                    <p className="text-xs text-slate-400">{formatDate(po.issueDate)} · {po.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{currency(po.total)}</p>
                    <span className={cn('badge', statusColor(po.status))}>{po.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoices */}
      {vInvoices.length > 0 && (
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Invoices</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Invoice #</th><th>PO Ref</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                {vInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><Link to={`/invoices/${inv.id}`} className="text-brand-600 hover:underline font-medium">{inv.number}</Link></td>
                    <td className="text-slate-500">{inv.poNumber || '—'}</td>
                    <td className="font-medium">{currency(inv.total)}</td>
                    <td>{formatDate(inv.dueDate)}</td>
                    <td><span className={cn('badge', statusColor(inv.status))}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

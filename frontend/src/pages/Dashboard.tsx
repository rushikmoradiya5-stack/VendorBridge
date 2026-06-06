import { motion } from 'framer-motion';
import {
  DollarSign, Users, ShoppingCart, Clock, TrendingUp, TrendingDown,
  ArrowRight, AlertCircle, CheckCircle2, Package, Plus,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import { currency, formatDate, statusColor, cn } from '@/lib/utils';
import { vendors, purchaseOrders, invoices, monthlySpend, spendByCategory, vendorPerformance } from '@/data/mockData';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const kpis = [
  {
    label: 'Total Spend YTD',
    value: currency(5070000),
    delta: '+12.4%',
    up: true,
    icon: DollarSign,
    color: 'bg-brand-50 text-brand-600',
  },
  {
    label: 'Active Vendors',
    value: vendors.filter((v) => v.status === 'active').length.toString(),
    delta: '+2 this month',
    up: true,
    icon: Users,
    color: 'bg-success/10 text-success',
  },
  {
    label: 'Open Purchase Orders',
    value: purchaseOrders.filter((p) => ['pending', 'draft', 'sent'].includes(p.status)).length.toString(),
    delta: '1 urgent',
    up: false,
    icon: ShoppingCart,
    color: 'bg-warning/10 text-warning',
  },
  {
    label: 'Pending Approvals',
    value: purchaseOrders.filter((p) => p.status === 'pending').length.toString(),
    delta: 'Avg 1.2 days',
    up: true,
    icon: Clock,
    color: 'bg-info/10 text-info',
  },
];

const recentActivity = [
  { icon: CheckCircle2, color: 'text-success', text: 'PO-2026-0084 approved by Sarah Manager', time: '2h ago' },
  { icon: AlertCircle, color: 'text-danger', text: 'INV-2026-0198 is 22 days overdue', time: '5h ago' },
  { icon: Users, color: 'text-brand-600', text: 'DataStream Analytics onboarded as new vendor', time: '1d ago' },
  { icon: Package, color: 'text-warning', text: 'PO-2026-0083 sent to SteelCore Industries', time: '1d ago' },
  { icon: CheckCircle2, color: 'text-success', text: 'INV-2026-0205 paid — GreenLeaf Supplies', time: '2d ago' },
];

export default function Dashboard() {
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const pendingPOs = purchaseOrders.filter((p) => p.status === 'pending').slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <p className="text-slate-400 text-sm">Good morning, Sarah 👋</p>
        <h1 className="text-2xl font-heading font-bold text-slate-800">Procurement Dashboard</h1>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={fadeUp} transition={{ duration: 0.3 }} className="stat-card">
            <div className="flex items-center justify-between">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', kpi.color)}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={cn('text-xs font-semibold flex items-center gap-1', kpi.up ? 'text-success' : 'text-danger')}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.delta}
              </span>
            </div>
            <div>
              <p className="stat-value">{kpi.value}</p>
              <p className="stat-label">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Spend Chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.15 }} className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-semibold text-slate-800">Monthly Spend vs Budget</h2>
              <p className="text-xs text-slate-400 mt-0.5">Jan – Jun 2026</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySpend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(val: number, name: string) => [currency(val), name === 'spend' ? 'Actual Spend' : 'Budget']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="spend" name="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget" name="budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spend by Category */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Spend by Category</h2>
          <div className="space-y-3">
            {spendByCategory.slice(0, 6).map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="truncate font-medium">{cat.category}</span>
                  <span className="font-semibold ml-2">{cat.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vendor Performance Radar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.25 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Vendor Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={[
              { metric: 'On-Time', A: 97, B: 94, C: 99 },
              { metric: 'Quality', A: 95, B: 91, C: 98 },
              { metric: 'Response', A: 92, B: 80, C: 97 },
              { metric: 'Pricing', A: 88, B: 85, C: 78 },
              { metric: 'Compliance', A: 99, B: 96, C: 100 },
            ]}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 9, fill: '#cbd5e1' }} />
              <Radar name="TechNova" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              <Radar name="SteelCore" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              <Radar name="CloudHarbor" dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.28 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-slate-800">Pending Approvals</h2>
            <Link to="/orders" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingPOs.map((po) => (
              <Link key={po.id} to={`/orders/${po.id}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-brand-200 hover:bg-brand-50/50 transition-fast">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', po.priority === 'urgent' ? 'bg-danger' : po.priority === 'high' ? 'bg-warning' : 'bg-brand-400')} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{po.number}</p>
                  <p className="text-[11px] text-slate-500 truncate">{po.vendorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{currency(po.total)}</p>
                  <span className={cn('badge text-[10px]', po.priority === 'urgent' ? 'badge-danger' : po.priority === 'high' ? 'badge-warning' : 'badge-info')}>
                    {po.priority}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.31 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-3.5">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <a.icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', a.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Overdue Invoices Alert */}
      {overdueInvoices.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.35 }}>
          <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-danger">
                {overdueInvoices.length} Overdue Invoice{overdueInvoices.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {overdueInvoices.map((i) => `${i.number} (${currency(i.total)})`).join(' · ')} — Requires immediate attention.
              </p>
            </div>
            <Link to="/invoices" className="btn btn-sm bg-danger text-white hover:bg-danger-dark flex-shrink-0">
              Review
            </Link>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.38 }} className="card p-5">
        <h2 className="font-heading font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/orders/new" className="btn btn-primary">
            <Plus className="w-4 h-4" /> New Purchase Order
          </Link>
          <Link to="/vendors" className="btn btn-outline">
            <Users className="w-4 h-4" /> Manage Vendors
          </Link>
          <Link to="/invoices" className="btn btn-outline">
            <Package className="w-4 h-4" /> Process Invoices
          </Link>
          <Link to="/analytics" className="btn btn-outline">
            <TrendingUp className="w-4 h-4" /> View Analytics
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

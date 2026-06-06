import { motion } from 'framer-motion';
import {
  DollarSign, Users, ShoppingCart, Clock, TrendingUp, TrendingDown,
  ArrowRight, AlertCircle, CheckCircle2, Package, Plus, Check, Eye
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { currency, cn } from '@/lib/utils';
import { monthlySpend, spendByCategory } from '@/data/mockData';
import { useDataStore, useAuthStore } from '@/store';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const recentActivity = [
  { icon: CheckCircle2, color: 'text-success', text: 'PO-2026-0084 approved by Sarah Manager', time: '2h ago' },
  { icon: AlertCircle, color: 'text-danger', text: 'INV-2026-0198 is 22 days overdue', time: '5h ago' },
  { icon: Users, color: 'text-brand-600', text: 'DataStream Analytics onboarded as new vendor', time: '1d ago' },
  { icon: Package, color: 'text-warning', text: 'PO-2026-0083 sent to SteelCore Industries', time: '1d ago' },
  { icon: CheckCircle2, color: 'text-success', text: 'INV-2026-0205 paid — GreenLeaf Supplies', time: '2d ago' },
];

export default function Dashboard() {
  const { vendors, purchaseOrders, invoices, approvePurchaseOrder, updateInvoiceStatus } = useDataStore();
  const { user } = useAuthStore();

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const pendingPOs = purchaseOrders.filter((p) => p.status === 'pending').slice(0, 3);

  // Calculate dynamic Total Spend from paid & approved POs/Invoices or sum up all PO totals
  const totalSpendVal = vendors.reduce((s, v) => s + v.totalSpend, 0);

  const kpis = [
    {
      label: 'Total Spend YTD',
      value: currency(totalSpendVal),
      delta: '+12.4%',
      up: true,
      icon: DollarSign,
      color: 'bg-brand-500/10 text-brand-400',
    },
    {
      label: 'Active Vendors',
      value: vendors.filter((v) => v.status === 'active').length.toString(),
      delta: '+2 this month',
      up: true,
      icon: Users,
      color: 'bg-success/15 text-success',
    },
    {
      label: 'Open Purchase Orders',
      value: purchaseOrders.filter((p) => ['pending', 'draft', 'sent'].includes(p.status)).length.toString(),
      delta: '1 urgent',
      up: false,
      icon: ShoppingCart,
      color: 'bg-warning/15 text-warning',
    },
    {
      label: 'Pending Approvals',
      value: purchaseOrders.filter((p) => p.status === 'pending').length.toString(),
      delta: 'Avg 1.2 days',
      up: true,
      icon: Clock,
      color: 'bg-info/15 text-info',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <p className="text-slate-400 text-sm">Welcome back, {user?.name || 'Sarah'} 👋</p>
        <h1 className="text-2xl font-heading font-bold text-slate-800">Procurement Command Center</h1>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={fadeUp} transition={{ duration: 0.3 }} className="stat-card card">
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

      {/* Overdue Invoices Alert Panel */}
      {overdueInvoices.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 }}>
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-danger">
                  {overdueInvoices.length} Overdue Invoice{overdueInvoices.length > 1 ? 's' : ''} Detected
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {overdueInvoices.map((i) => `${i.number} (${currency(i.total)})`).join(' · ')} — Action required to avoid supplier service holds.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => overdueInvoices.forEach((i) => updateInvoiceStatus(i.id, 'paid'))}
                className="btn btn-sm btn-success flex-shrink-0 font-semibold shadow-sm"
              >
                Quick Pay All
              </button>
              <Link to="/invoices" className="btn btn-sm btn-outline flex-shrink-0">
                Review
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spend Trend Spline Chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.15 }} className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-semibold text-slate-800">Monthly Spend vs Budget Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Jan – Jun 2026 · Actual Spend vs Target Budget</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySpend}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#243249" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8da2c0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8da2c0' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(val: number, name: string) => [currency(val), name === 'spend' ? 'Actual Spend' : 'Budget']}
                contentStyle={{ borderRadius: 10, backgroundColor: '#162032', borderColor: '#243249', color: '#ffffff', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="spend" name="spend" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: '#8da2c0' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spend by Category */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Spend by Category</h2>
          <div className="space-y-3.5">
            {spendByCategory.slice(0, 6).map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span className="truncate font-medium">{cat.category}</span>
                  <span className="font-semibold text-slate-800">{cat.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vendor Performance Radar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.25 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Vendor Scorecards</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={[
              { metric: 'On-Time', A: 97, B: 94, C: 99 },
              { metric: 'Quality', A: 95, B: 91, C: 98 },
              { metric: 'Response', A: 92, B: 80, C: 97 },
              { metric: 'Pricing', A: 88, B: 85, C: 78 },
              { metric: 'Compliance', A: 99, B: 96, C: 100 },
            ]}>
              <PolarGrid stroke="#243249" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#8da2c0' }} />
              <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 9, fill: '#3b4f6e' }} />
              <Radar name="TechNova" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.12} />
              <Radar name="SteelCore" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.08} />
              <Radar name="CloudHarbor" dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Action Approval Center */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.28 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-semibold text-slate-800">Pending Approvals</h2>
              <p className="text-[10px] text-slate-400">Review and authorize PO drafts</p>
            </div>
            <Link to="/orders" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingPOs.map((po) => (
              <div key={po.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-100/40 hover:border-brand-500/30 transition-fast gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', po.priority === 'urgent' ? 'bg-danger' : po.priority === 'high' ? 'bg-warning' : 'bg-brand-400')} />
                  <div className="min-w-0">
                    <Link to={`/orders/${po.id}`} className="text-xs font-semibold text-slate-700 hover:text-brand-500 hover:underline truncate block">{po.number}</Link>
                    <p className="text-[10px] text-slate-400 truncate">{po.vendorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">{currency(po.total)}</p>
                    <span className={cn('badge text-[9px]', po.priority === 'urgent' ? 'badge-danger' : po.priority === 'high' ? 'badge-warning' : 'badge-info')}>
                      {po.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => approvePurchaseOrder(po.id, user?.name || 'Sarah Manager')}
                    title="Approve Order"
                    className="w-7 h-7 rounded-lg bg-success/15 hover:bg-success text-success hover:text-white flex items-center justify-center transition-fast"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {pendingPOs.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                All purchase orders have been processed.
              </div>
            )}
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

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.35 }} className="card p-5">
        <h2 className="font-heading font-semibold text-slate-800 mb-4">Quick Operations</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/orders/new" className="btn btn-primary shadow-md">
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

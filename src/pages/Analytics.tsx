import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { monthlySpend, spendByCategory, vendorPerformance } from '@/data/mockData';
import { currency, cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899'];

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Analytics() {
  const totalSpend = monthlySpend.reduce((s, m) => s + m.spend, 0);
  const totalBudget = monthlySpend.reduce((s, m) => s + m.budget, 0);
  const variance = ((totalSpend - totalBudget) / totalBudget) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-heading font-bold text-slate-800">Procurement Analytics</h1>
        <p className="text-sm text-slate-400 mt-0.5">Jan – Jun 2026 · All departments</p>
      </motion.div>

      {/* Top KPIs */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden" animate="visible"
      >
        {[
          { label: 'Total Spend YTD', value: currency(totalSpend), icon: DollarSign, color: 'bg-brand-50 text-brand-600', delta: `${variance > 0 ? '+' : ''}${variance.toFixed(1)}% vs budget`, up: variance < 0 },
          { label: 'Total Budget YTD', value: currency(totalBudget), icon: DollarSign, color: 'bg-slate-100 text-slate-600', delta: 'Remaining budget available', up: true },
          { label: 'Total Orders', value: monthlySpend.reduce((s, m) => s + m.orders, 0).toString(), icon: TrendingUp, color: 'bg-success/10 text-success', delta: 'Across all departments', up: true },
        ].map((kpi, i) => (
          <motion.div key={i} variants={fadeUp} transition={{ duration: 0.3 }} className="stat-card">
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

      {/* Row 1: Spend Trend + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spend vs Budget Line */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 }} className="card p-5 lg:col-span-2">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Monthly Spend vs Budget Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number, name: string) => [currency(v), name === 'spend' ? 'Actual' : 'Budget']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="spend" name="spend" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="budget" name="budget" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="6 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spend Donut */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.15 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Spend by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={spendByCategory}
                dataKey="pct"
                nameKey="category"
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                paddingAngle={3}
              >
                {spendByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [`${v}%`, name]} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {spendByCategory.slice(0, 5).map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-600 truncate flex-1">{cat.category}</span>
                <span className="font-semibold text-slate-800">{cat.pct}%</span>
                <span className={cn('font-medium', cat.trend > 0 ? 'text-danger' : 'text-success')}>
                  {cat.trend > 0 ? '+' : ''}{cat.trend}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Category Bar + Vendor Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Spend by Category Bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Spend Amount by Category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={spendByCategory} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={110} />
              <Tooltip formatter={(v: number) => [currency(v), 'Spend']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {spendByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vendor Performance Radar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.25 }} className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-4">Vendor Scorecards</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={[
              { metric: 'On-Time', TechNova: 97, SteelCore: 94, CloudHarbor: 99, Apex: 91 },
              { metric: 'Quality', TechNova: 95, SteelCore: 91, CloudHarbor: 98, Apex: 89 },
              { metric: 'Response', TechNova: 92, SteelCore: 80, CloudHarbor: 97, Apex: 85 },
              { metric: 'Pricing', TechNova: 88, SteelCore: 85, CloudHarbor: 78, Apex: 90 },
              { metric: 'Compliance', TechNova: 99, SteelCore: 96, CloudHarbor: 100, Apex: 88 },
            ]}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 9, fill: '#cbd5e1' }} />
              {['TechNova', 'SteelCore', 'CloudHarbor', 'Apex'].map((v, i) => (
                <Radar key={v} name={v} dataKey={v} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.12} />
              ))}
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Orders Count */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.28 }} className="card p-5">
        <h2 className="font-heading font-semibold text-slate-800 mb-4">Monthly Orders Volume</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlySpend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

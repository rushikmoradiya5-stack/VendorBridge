import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const USERS = [
  { name: 'Sarah Manager', email: 'sarah@vendorbridge.com', role: 'admin', dept: 'Procurement', status: 'active' },
  { name: 'James Buyer', email: 'james@vendorbridge.com', role: 'buyer', dept: 'Operations', status: 'active' },
  { name: 'Emily Viewer', email: 'emily@vendorbridge.com', role: 'viewer', dept: 'Finance', status: 'active' },
  { name: 'Tom Approver', email: 'tom@vendorbridge.com', role: 'manager', dept: 'Procurement', status: 'inactive' },
];

export default function Settings() {
  const [tab, setTab] = useState('company');
  const [saved, setSaved] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your workspace configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab Nav */}
        <div className="card p-2 flex lg:flex-col gap-1 w-full lg:w-52 flex-shrink-0 h-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-fast text-left',
                tab === t.id ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <t.icon className="w-4 h-4 flex-shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Company */}
          {tab === 'company' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-slate-800">Company Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', placeholder: 'VendorBridge Corp', defaultValue: 'VendorBridge Corp' },
                  { label: 'Registration Number', placeholder: 'REG-123456', defaultValue: 'REG-2024-0012' },
                  { label: 'Tax ID (EIN)', placeholder: 'XX-XXXXXXX', defaultValue: '94-0001234' },
                  { label: 'Industry', placeholder: 'Technology', defaultValue: 'Technology / SaaS' },
                  { label: 'Default Currency', placeholder: 'USD', defaultValue: 'USD' },
                  { label: 'Fiscal Year Start', placeholder: 'January', defaultValue: 'January' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="label">{f.label}</label>
                    <input className="input" placeholder={f.placeholder} defaultValue={f.defaultValue} />
                  </div>
                ))}
              </div>
              <div>
                <label className="label">Company Address</label>
                <textarea className="input resize-none" rows={2} defaultValue="123 Procurement Plaza, Suite 400, San Francisco, CA 94102" />
              </div>
            </motion.div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="font-heading font-semibold text-slate-800">Users & Roles</h2>
                <button className="btn btn-primary btn-sm"><Users className="w-4 h-4" /> Invite User</button>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead><tr><th>User</th><th>Role</th><th>Department</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {USERS.map((u) => (
                      <tr key={u.email}>
                        <td>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td><span className="badge badge-brand capitalize">{u.role}</span></td>
                        <td className="text-slate-600">{u.dept}</td>
                        <td><span className={cn('badge', u.status === 'active' ? 'badge-success' : 'badge-neutral')}>{u.status}</span></td>
                        <td><button className="btn btn-sm btn-ghost text-slate-500">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-slate-800">Notification Preferences</h2>
              {[
                { label: 'PO Approved', desc: 'When a purchase order gets approved', enabled: true },
                { label: 'Invoice Overdue', desc: 'When an invoice passes its due date', enabled: true },
                { label: 'Budget Alert (>90%)', desc: 'When department budget exceeds 90%', enabled: true },
                { label: 'New Vendor Onboarded', desc: 'When a new vendor completes registration', enabled: false },
                { label: 'PO Rejection', desc: 'When a submitted PO is rejected', enabled: true },
                { label: 'Weekly Summary Email', desc: 'Weekly procurement digest email', enabled: false },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{n.label}</p>
                    <p className="text-xs text-slate-400">{n.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={n.enabled} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-brand-500/30 rounded-full peer peer-checked:bg-brand-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </motion.div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-slate-800">Security Settings</h2>
              <div className="space-y-3">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Enhance your account security with 2FA via authenticator app.</p>
                <button className="btn btn-outline btn-sm">Enable 2FA</button>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          {tab !== 'users' && (
            <div className="flex justify-end">
              <button onClick={handleSave} className={cn('btn', saved ? 'btn-success' : 'btn-primary')}>
                {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

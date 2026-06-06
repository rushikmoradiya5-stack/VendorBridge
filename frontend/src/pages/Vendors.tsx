import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, LayoutGrid, List, Star, MapPin, ExternalLink } from 'lucide-react';
import { useDataStore } from '@/store';
import { currency, statusColor, cn } from '@/lib/utils';

const CATEGORIES = ['All', 'IT & Software', 'Manufacturing', 'Office Supplies', 'Raw Materials', 'Cloud & Hosting', 'Logistics', 'Security'];
const STATUSES = ['All', 'active', 'inactive', 'pending', 'blacklisted'];

export default function Vendors() {
  const { vendors, addVendor } = useDataStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [view, setView] = useState<'table' | 'grid'>('table');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [cat, setCat] = useState('IT & Software');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('USA');
  const [tagsInput, setTagsInput] = useState('');

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      (!q || v.name.toLowerCase().includes(q) || v.contact.toLowerCase().includes(q) || v.email.toLowerCase().includes(q)) &&
      (category === 'All' || v.category === category) &&
      (status === 'All' || v.status === status)
    );
  });

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !email) return;

    addVendor({
      name,
      category: cat,
      contact,
      email,
      phone,
      country,
      status: 'active',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    });

    // Reset
    setName('');
    setCat('IT & Software');
    setContact('');
    setEmail('');
    setPhone('');
    setCountry('USA');
    setTagsInput('');
    setModalOpen(false);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Vendors</h1>
          <p className="text-sm text-slate-400 mt-0.5">{vendors.length} registered suppliers</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9 h-9" placeholder="Search vendors…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input h-9 w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input h-9 w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button onClick={() => setView('table')} className={cn('px-3 py-1.5 text-sm transition-fast', view === 'table' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50')}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('grid')} className={cn('px-3 py-1.5 text-sm transition-fast', view === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50')}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-slate-500 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>On-Time</th>
                  <th>Total Spend</th>
                  <th>Orders</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{v.name}</p>
                          <p className="text-[11px] text-slate-400">{v.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-brand">{v.category}</span></td>
                    <td className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400" />{v.country}</td>
                    <td><span className={cn('badge', statusColor(v.status))}>{v.status}</span></td>
                    <td>
                      {v.rating > 0 ? (
                        <span className="flex items-center gap-1 text-sm font-medium">
                          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                          {v.rating.toFixed(1)}
                        </span>
                      ) : <span className="text-xs text-slate-400">N/A</span>}
                    </td>
                    <td>
                      {v.onTimeDelivery > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn('h-full rounded-full', v.onTimeDelivery >= 90 ? 'bg-success' : v.onTimeDelivery >= 75 ? 'bg-warning' : 'bg-danger')} style={{ width: `${v.onTimeDelivery}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{v.onTimeDelivery}%</span>
                        </div>
                      ) : <span className="text-xs text-slate-400">N/A</span>}
                    </td>
                    <td className="font-medium">{v.totalSpend > 0 ? currency(v.totalSpend) : '—'}</td>
                    <td>{v.totalOrders > 0 ? v.totalOrders : '—'}</td>
                    <td>
                      <Link to={`/vendors/${v.id}`} className="btn btn-sm btn-ghost text-brand-600">
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={`/vendors/${v.id}`} className="card card-hover p-5 block group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{v.name}</p>
                      <p className="text-xs text-slate-400">{v.category}</p>
                    </div>
                  </div>
                  <span className={cn('badge', statusColor(v.status))}>{v.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Total Spend</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{v.totalSpend > 0 ? currency(v.totalSpend) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Rating</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                      {v.rating > 0 ? <><Star className="w-3 h-3 text-warning fill-warning" />{v.rating.toFixed(1)}</> : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">On-Time</p>
                    <p className={cn('font-semibold mt-0.5', v.onTimeDelivery >= 90 ? 'text-success' : v.onTimeDelivery >= 75 ? 'text-warning' : 'text-danger')}>
                      {v.onTimeDelivery > 0 ? `${v.onTimeDelivery}%` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Orders</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{v.totalOrders > 0 ? v.totalOrders : '—'}</p>
                  </div>
                </div>
                {v.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {v.tags.map((t) => (
                      <span key={t} className="badge badge-neutral">{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Vendor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-100 rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6 animate-slide-up space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h2 className="text-lg font-heading font-bold text-slate-800">Add New Vendor</h2>
              <button onClick={() => setModalOpen(false)} className="btn-icon btn-ghost text-slate-400 hover:text-slate-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddVendor} className="space-y-3">
              <div>
                <label className="label">Company Name *</label>
                <input className="input text-sm" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Acme Corp" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category *</label>
                  <select className="input text-sm" value={cat} onChange={(e) => setCat(e.target.value)} required>
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Country *</label>
                  <input className="input text-sm" type="text" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="e.g. USA" />
                </div>
              </div>

              <div>
                <label className="label">Contact Person *</label>
                <input className="input text-sm" type="text" value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="e.g. John Doe" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Email *</label>
                  <input className="input text-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@acme.com" />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input className="input text-sm" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+1 555 0199" />
                </div>
              </div>

              <div>
                <label className="label">Tags (comma-separated)</label>
                <input className="input text-sm" type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. preferred, strategic" />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

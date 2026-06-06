import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Info, Package, Star } from 'lucide-react';
import { currency } from '@/lib/utils';

const CATALOG_ITEMS = [
  {
    id: 'c_item_1',
    name: 'Enterprise Software License',
    description: 'TechNova Enterprise software seat licenses, tier 1 corporate package.',
    category: 'IT & Software',
    price: 1200,
    unit: 'seat',
    vendorId: 'v1',
    vendorName: 'TechNova Solutions',
    defaultDept: 'IT',
    image: '💻',
    rating: 4.8,
  },
  {
    id: 'c_item_2',
    name: 'Custom Machined Parts (Batch 12)',
    description: 'High precision aluminum and titanium machined aerospace parts.',
    category: 'Manufacturing',
    price: 340,
    unit: 'unit',
    vendorId: 'v2',
    vendorName: 'Apex Manufacturing',
    defaultDept: 'Production',
    image: '⚙️',
    rating: 4.5,
  },
  {
    id: 'c_item_3',
    name: 'Printer Paper A4 (500 reams)',
    description: 'Eco-friendly high brightness office printing sheets.',
    category: 'Office Supplies',
    price: 6,
    unit: 'ream',
    vendorId: 'v3',
    vendorName: 'GreenLeaf Supplies',
    defaultDept: 'Admin',
    image: '📄',
    rating: 4.2,
  },
  {
    id: 'c_item_4',
    name: 'Office Stationery Bundle',
    description: 'Set of high-quality pens, notebooks, folders, and sticky notes.',
    category: 'Office Supplies',
    price: 25,
    unit: 'pack',
    vendorId: 'v3',
    vendorName: 'GreenLeaf Supplies',
    defaultDept: 'Admin',
    image: '✏️',
    rating: 4.2,
  },
  {
    id: 'c_item_5',
    name: 'Steel Rods Grade A (5000 units)',
    description: 'Hardened structural carbon steel rods for manufacturing.',
    category: 'Raw Materials',
    price: 45,
    unit: 'unit',
    vendorId: 'v5',
    vendorName: 'SteelCore Industries',
    defaultDept: 'Operations',
    image: '🏗️',
    rating: 4.6,
  },
  {
    id: 'c_item_6',
    name: 'Cloud Compute Instance (50 nodes)',
    description: 'AWS/GCP hosted node compute cluster for heavy deployment.',
    category: 'Cloud & Hosting',
    price: 4200,
    unit: 'month',
    vendorId: 'v6',
    vendorName: 'CloudHarbor Services',
    defaultDept: 'IT',
    image: '☁️',
    rating: 4.9,
  },
  {
    id: 'c_item_7',
    name: 'Express Freight Shipping',
    description: 'Express cargo logistics routing across West Africa and Europe.',
    category: 'Logistics',
    price: 28000,
    unit: 'shipment',
    vendorId: 'v8',
    vendorName: 'Pristine Logistics',
    defaultDept: 'Logistics',
    image: '🚚',
    rating: 4.3,
  },
];

const CATEGORIES = ['All', 'IT & Software', 'Manufacturing', 'Office Supplies', 'Raw Materials', 'Cloud & Hosting', 'Logistics'];

export default function Catalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToPO = (item: typeof CATALOG_ITEMS[0]) => {
    navigate('/orders/new', {
      state: {
        prefilledItem: {
          description: item.name,
          qty: 1,
          unit: item.unit,
          unitPrice: item.price,
          vendorId: item.vendorId,
          department: item.defaultDept,
        },
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-800">Approved Item Catalog</h1>
        <p className="text-sm text-slate-400 mt-0.5">Pre-negotiated catalog items linked to preferred vendors</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9 h-10"
            placeholder="Search catalog items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-fast border',
                activeCategory === c
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="card card-hover flex flex-col justify-between overflow-hidden"
          >
            {/* Upper Content */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-3xl p-2 bg-slate-100 rounded-xl leading-none">{item.image}</span>
                <span className="badge badge-brand text-[10px]">{item.category}</span>
              </div>

              <div>
                <h3 className="text-base font-heading font-bold text-slate-800 leading-snug">{item.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-8">{item.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <span className="font-medium">Vendor:</span>
                <span className="text-brand-600 font-semibold">{item.vendorName}</span>
                <span className="flex items-center gap-0.5 text-warning font-semibold ml-auto">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  {item.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Price & Action Row */}
            <div className="flex items-center justify-between p-4 bg-slate-50/80 border-t border-slate-100">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold leading-none">Pre-Negotiated</p>
                <p className="text-base font-extrabold text-slate-800 mt-1">
                  {currency(item.price)}
                  <span className="text-xs font-normal text-slate-500"> / {item.unit}</span>
                </p>
              </div>

              <button
                onClick={() => handleAddToPO(item)}
                className="btn btn-primary btn-sm flex items-center gap-1.5 px-3 py-2 shadow-sm font-semibold"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to PO
              </button>
            </div>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">No items found matching search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline helper for class concatenation
function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

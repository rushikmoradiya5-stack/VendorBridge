import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Catalog() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Package className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-xl font-heading font-semibold text-slate-800">Item Catalog</h1>
      <p className="text-sm text-slate-400 max-w-sm">
        Centralized catalog of approved items and services. This module is coming in the next release.
      </p>
      <Link to="/dashboard" className="btn btn-outline btn-sm">Back to Dashboard</Link>
    </div>
  );
}

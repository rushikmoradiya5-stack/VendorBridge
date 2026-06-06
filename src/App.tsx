import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store';

// Lazy pages
const Login          = lazy(() => import('@/pages/Login'));
const Dashboard      = lazy(() => import('@/pages/Dashboard'));
const Vendors        = lazy(() => import('@/pages/Vendors'));
const VendorDetail   = lazy(() => import('@/pages/VendorDetail'));
const PurchaseOrders = lazy(() => import('@/pages/PurchaseOrders'));
const PODetail       = lazy(() => import('@/pages/PODetail'));
const NewPO          = lazy(() => import('@/pages/NewPO'));
const Invoices       = lazy(() => import('@/pages/Invoices'));
const InvoiceDetail  = lazy(() => import('@/pages/InvoiceDetail'));
const Analytics      = lazy(() => import('@/pages/Analytics'));
const Settings       = lazy(() => import('@/pages/Settings'));
const Catalog        = lazy(() => import('@/pages/Catalog'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <svg className="animate-spin w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-sm text-slate-400 font-medium">Loading VendorBridge…</p>
    </div>
  </div>
);

// Protected Route
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected — inside DashboardLayout */}
            <Route
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route path="/dashboard"      element={<Dashboard />} />
              <Route path="/vendors"        element={<Vendors />} />
              <Route path="/vendors/:id"    element={<VendorDetail />} />
              <Route path="/orders"         element={<PurchaseOrders />} />
              <Route path="/orders/new"     element={<NewPO />} />
              <Route path="/orders/:id"     element={<PODetail />} />
              <Route path="/invoices"       element={<Invoices />} />
              <Route path="/invoices/:id"   element={<InvoiceDetail />} />
              <Route path="/analytics"      element={<Analytics />} />
              <Route path="/catalog"        element={<Catalog />} />
              <Route path="/settings"       element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

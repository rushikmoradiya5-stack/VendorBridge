import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingCart, FileText, BarChart3,
  Settings, ChevronLeft, ChevronRight, Building2, LogOut, Package,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { cn, initials } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/vendors',   icon: Users,           label: 'Vendors' },
      { to: '/orders',    icon: ShoppingCart,     label: 'Purchase Orders' },
      { to: '/invoices',  icon: FileText,         label: 'Invoices' },
      { to: '/analytics', icon: BarChart3,        label: 'Analytics' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { to: '/catalog',  icon: Package,  label: 'Item Catalog' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar() {
  const { collapsed, toggleSidebar } = { collapsed: useUIStore((s) => s.sidebarCollapsed), toggleSidebar: useUIStore((s) => s.toggleSidebar) };
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-sidebar-bg border-r border-sidebar-border shadow-sidebar flex-shrink-0 overflow-hidden z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <p className="text-white font-heading font-bold text-sm leading-tight">VendorBridge</p>
              <p className="text-sidebar-text text-[10px] leading-tight">Procurement ERP</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && <p className="sidebar-section">{group.label}</p>}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn('sidebar-link', isActive && 'active', collapsed && 'justify-center px-0')
                }
                title={collapsed ? label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="truncate">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className={cn('border-t border-sidebar-border p-3 flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials(user.name)}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user.name}</p>
                <p className="text-sidebar-text text-[10px] truncate capitalize">{user.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={handleLogout} className="text-sidebar-text hover:text-white p-1 rounded transition-fast" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-sidebar-surface border border-sidebar-border flex items-center justify-center text-sidebar-text hover:text-white hover:bg-brand-600 transition-fast shadow-md z-40"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}

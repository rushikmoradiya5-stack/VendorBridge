import { Bell, Search, Menu } from 'lucide-react';
import { useAuthStore, useNotifStore, useUIStore } from '@/store';
import { initials, formatRelative } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifStore();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [notifOpen, setNotifOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const uc = unreadCount();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden btn-icon btn-ghost">
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-slate-800 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 leading-tight">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9 pr-3 h-9 w-56 text-sm"
            placeholder="Search…"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="btn-icon btn-ghost relative"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {uc > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {uc}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 card shadow-card-hover z-50 overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-slate-50 transition-fast',
                      !n.read && 'bg-brand-50'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-2 h-2 mt-1.5 rounded-full bg-brand-500 flex-shrink-0" />}
                      {n.read && <span className="w-2 h-2 mt-1.5 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{formatRelative(n.timestamp)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              {initials(user.name)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

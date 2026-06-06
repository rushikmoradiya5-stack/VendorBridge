import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(amount: number, code = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: code, maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active': case 'approved': case 'fulfilled': case 'paid': return 'badge-success';
    case 'pending': case 'sent': case 'unpaid': case 'review': return 'badge-warning';
    case 'draft': return 'badge-neutral';
    case 'overdue': case 'cancelled': case 'blacklisted': case 'disputed': return 'badge-danger';
    case 'inactive': return 'badge-neutral';
    default: return 'badge-info';
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'low': return 'badge-neutral';
    case 'medium': return 'badge-info';
    case 'high': return 'badge-warning';
    case 'urgent': return 'badge-danger';
    default: return 'badge-neutral';
  }
}

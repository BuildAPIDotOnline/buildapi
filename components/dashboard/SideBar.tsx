"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Key,
  ShoppingBag,
  LifeBuoy,
  FileText,
  ArrowUpRight,
  Shield,
  CreditCard,
  Layers,
  Ban,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api-client';

const mainNav = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'API Keys', icon: Key, href: '/dashboard/keys' },
  { name: 'Purchase API', icon: ShoppingBag, href: '/dashboard/purchase-keys' },
  { name: 'Help & Support', icon: LifeBuoy, href: '/dashboard/support' },
];

const adminNav = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard/admin' },
  { name: 'Approve Users', icon: UserCheck, href: '/dashboard/admin/users' },
  { name: 'Plans & Industries', icon: Layers, href: '/dashboard/admin/plans-industries' },
  { name: 'Payments', icon: CreditCard, href: '/dashboard/admin/payments' },
  { name: 'Disable API Keys', icon: Ban, href: '/dashboard/admin/keys' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const isAdminArea = pathname.startsWith('/dashboard/admin');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ user: { isAdmin?: boolean } }>('/api/users/me');
        setIsAdmin(!!res.user?.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    })();
  }, []);

  const navItems = isAdminArea ? adminNav : mainNav;

  return (
    <aside className="hidden md:flex w-72 border-r border-slate-100 bg-white h-screen sticky top-0 flex-col p-6 overflow-y-auto">
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-600">
          API<span className="text-slate-900">CORE</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 mb-8">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {isAdminArea ? 'Admin' : 'Main Menu'}
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard/admin'
              ? pathname === '/dashboard/admin'
              : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
        {!isAdminArea && isAdmin && (
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-slate-600 hover:bg-slate-50 border-t border-slate-100 mt-2 pt-2"
          >
            <Shield size={18} className="text-amber-500" />
            Admin
          </Link>
        )}
        {isAdminArea && (
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-slate-600 hover:bg-slate-50 border-t border-slate-100 mt-2 pt-2"
          >
            <LayoutDashboard size={18} />
            Back to Dashboard
          </Link>
        )}
      </div>

   

      {/* View Documentation Card */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="bg-slate-900 rounded-lg p-5 text-white relative overflow-hidden group">
          {/* Decorative Background Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/40 transition-all" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">View Documentation</span>
            </div>
            
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              API guides for Banking, CRM, and E-commerce.
            </p>

            <Link 
              href="/dashboard/docs"
              className="flex items-center justify-between w-full border border-white/20 p-4 rounded-lg hover:bg-white hover:text-slate-900 transition-all group/link"
            >
              <span className="font-bold text-sm">Open Docs</span>
              <ArrowUpRight size={18} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

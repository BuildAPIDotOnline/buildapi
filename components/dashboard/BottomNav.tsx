"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Key,
  ShoppingBag,
  LifeBuoy,
  Shield,
  CreditCard,
  Layers,
  Ban,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api-client';

const userNavItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Keys', icon: Key, href: '/dashboard/keys' },
  { name: 'Purchase', icon: ShoppingBag, href: '/dashboard/purchase-keys' },
  { name: 'Support', icon: LifeBuoy, href: '/dashboard/support' },
];

const adminNavItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard/admin' },
  { name: 'Users', icon: UserCheck, href: '/dashboard/admin/users' },
  { name: 'Plans', icon: Layers, href: '/dashboard/admin/plans-industries' },
  { name: 'Payments', icon: CreditCard, href: '/dashboard/admin/payments' },
  { name: 'Keys', icon: Ban, href: '/dashboard/admin/keys' },
];

export default function BottomNav() {
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

  const navItems = isAdminArea ? adminNavItems : userNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 shadow-2xl w-full z-50 safe-area-pb">
      <div className="bg-gray-100 p-2">
        <div className="flex items-center space-x-2 justify-around h-16 px-4">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard/admin'
                ? pathname === '/dashboard/admin'
                : pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center rounded-xl justify-center flex-1 min-w-0 gap-1 transition-colors ${
                  isActive ? 'text-white shadow-2xl bg-blue-600 p-3' : 'text-slate-500 p-3'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium truncate w-full text-center">
                  {item.name}
                </span>
              </Link>
            );
          })}
          {!isAdminArea && isAdmin && (
            <Link
              href="/dashboard/admin"
              className={`flex flex-col items-center rounded-xl justify-center flex-1 min-w-0 gap-1 transition-colors p-3 ${
                pathname.startsWith('/dashboard/admin')
                  ? 'text-white shadow-2xl bg-amber-500'
                  : 'text-slate-500'
              }`}
            >
              <Shield size={20} strokeWidth={pathname.startsWith('/dashboard/admin') ? 2.5 : 2} />
              <span className="text-[10px] font-medium truncate w-full text-center">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

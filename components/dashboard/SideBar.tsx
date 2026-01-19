"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Key, 
  ShoppingBag, 
  LifeBuoy, 
  Sparkles,
  PlusCircle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'API Keys', icon: Key, href: '/dashboard/keys' },
    { name: 'Purchase API', icon: ShoppingBag, href: '/dashboard/purchase-keys' },
    { name: 'Help & Support', icon: LifeBuoy, href: '/dashboard/support' },
  ];

 

  return (
    <aside className="w-72 border-r border-slate-100 bg-white h-screen sticky top-0 flex flex-col p-6 overflow-y-auto">
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-600">
          API<span className="text-slate-900">CORE</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 mb-8">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
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
      </div>

   

      {/* Purchase Portal Card */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="bg-slate-900 rounded-lg p-5 text-white relative overflow-hidden group">
          {/* Decorative Background Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/40 transition-all" />
          
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Credits Remaining</span>
          </div>
          
          <div className="mb-4">
            <span className="text-2xl font-bold italic">12,450</span>
            <span className="text-xs text-slate-400 ml-2">calls</span>
          </div>

          <Link 
            href="/dashboard/portal"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 py-3 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            <PlusCircle size={14} />
            Purchase Portal
          </Link>
        </div>
      </div>
    </aside>
  );
}

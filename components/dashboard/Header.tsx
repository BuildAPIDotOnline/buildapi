"use client";

import { Search, Bell, ChevronDown, Settings, LogOut, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api-client';
import { removeToken } from '@/lib/auth-storage';
import { useRouter } from 'next/navigation';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get<{ user: UserData }>('/api/users/me');
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  };

  const getAccountType = () => {
    if (!user) return 'Account';
    return user.jobTitle || 'Developer Account';
  };

  return (
    <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Left Section: Search Bar */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search API keys, logs, or documentation..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-600"
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* System Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-lg animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">System Live</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-lg border-2 border-white shadow-sm" />
        </button>

        <div className="h-8 w-px bg-slate-100" />

        {/* User Profile Dropdown */}
        {loading ? (
          <div className="flex items-center gap-3 pl-2 pr-1 py-1">
            <Loader2 className="animate-spin text-slate-400" size={20} />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50 transition-all group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{getFullName()}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{getAccountType()}</p>
                </div>
                <div className="relative h-10 w-10 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-blue-100">
                  <div className="flex items-center justify-center h-full w-full text-blue-600 font-bold text-sm">
                    {getInitials()}
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-2 w-full">
                  <User size={16} />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

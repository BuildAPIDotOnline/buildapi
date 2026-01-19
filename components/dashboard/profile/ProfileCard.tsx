"use client";

import { Mail, Globe, RefreshCw, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  country?: string;
}

export default function ProfileCard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  };

  const getJobTitle = () => {
    if (!user) return 'Account';
    return user.jobTitle || 'Account';
  };

  const getCountry = () => {
    if (!user || !user.country) return 'Not specified';
    return user.country;
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-xl ring-1 ring-slate-100">
          {getInitials()}
        </div>
        <button className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition border-2 border-white">
          <RefreshCw size={14} />
        </button>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{getFullName()}</h3>
      <p className="text-sm text-slate-500 font-medium">{getJobTitle()}</p>
      
      <div className="mt-8 pt-8 border-t border-slate-50 space-y-5 text-left">
        <div className="flex items-start gap-4 text-slate-600">
          <Mail size={18} className="text-slate-300 mt-1" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Email</p>
            <p className="text-sm font-semibold truncate">{user?.email || 'No email'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-slate-600">
          <Globe size={18} className="text-slate-300 mt-1" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Country</p>
            <p className="text-sm font-semibold">{getCountry()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

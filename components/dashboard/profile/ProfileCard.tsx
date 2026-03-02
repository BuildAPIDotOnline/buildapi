"use client";

import { Mail, Globe, Loader2, Camera } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import UserAvatar from '@/components/dashboard/UserAvatar';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  country?: string;
  avatarUrl?: string | null;
}

export default function ProfileCard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      setUploading(true);
      const response = await api.uploadAvatar(file);
      setUser({ ...user, avatarUrl: response.avatarUrl });
      toast({
        title: 'Success',
        description: 'Profile picture updated',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to upload photo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
        <div className="flex items-center justify-center p-8 text-slate-500">No profile data</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-8 text-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
      <div className="relative w-20 h-20 mx-auto mb-6">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          size="md"
          className="w-full h-full rounded-full border-4 border-white shadow-xl ring-1 ring-slate-100"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-0.5 -right-0.5 p-1.5 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition border-2 border-white disabled:opacity-50"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
        </button>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{getFullName()}</h3>
      <p className="text-sm text-slate-500 font-medium">{getJobTitle()}</p>
      
      <div className="mt-8 pt-8 border-t border-slate-50 space-y-5 text-left">
        <div className="flex items-start gap-4 text-slate-600 min-w-0">
          <Mail size={18} className="text-slate-300 mt-1 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Email</p>
            <p className="text-sm font-semibold truncate">{user?.email || 'No email'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-slate-600 min-w-0">
          <Globe size={18} className="text-slate-300 mt-1 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Country</p>
            <p className="text-sm font-semibold">{getCountry()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

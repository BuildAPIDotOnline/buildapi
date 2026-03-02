"use client";

import { useState, useEffect, useRef } from 'react';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera } from 'lucide-react';
import UserAvatar from '@/components/dashboard/UserAvatar';

export default function ProfileTabContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    country: '',
    companyName: '',
    companySize: '',
    industry: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ user: any }>('/api/users/me');
      setAvatarUrl(response.user.avatarUrl || null);
      setFormData({
        firstName: response.user.firstName || '',
        lastName: response.user.lastName || '',
        jobTitle: response.user.jobTitle || '',
        phoneNumber: response.user.phoneNumber || '',
        country: response.user.country || '',
        companyName: response.user.companyName || '',
        companySize: response.user.companySize || '',
        industry: response.user.industry || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/api/users/me', formData);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const response = await api.uploadAvatar(file);
      setAvatarUrl(response.avatarUrl);
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

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-10">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-10">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">Account Information</h2>

      {/* Avatar upload section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-slate-100">
        <div className="relative">
          <UserAvatar
            avatarUrl={avatarUrl}
            firstName={formData.firstName}
            lastName={formData.lastName}
            size="sm"
            className="size-10 sm:size-12"
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
            className="absolute -bottom-0.5 -right-0.5 p-1 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition border-2 border-white disabled:opacity-50 sm:p-1.5"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Profile Picture</p>
          <p className="text-xs text-slate-500 mt-1">JPG, PNG or WebP. Max 2MB.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
          <input 
            type="text" 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
          <input 
            type="text" 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
          <input 
            type="text" 
            value={formData.jobTitle}
            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
          <input 
            type="text" 
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
          <input 
            type="text" 
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Country</label>
          <input 
            type="text" 
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
        </div>
        <button 
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="animate-spin" size={16} />}
          Save Changes
        </button>
      </form>
    </div>
  );
}

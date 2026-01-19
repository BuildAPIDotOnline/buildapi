"use client";

import { useState } from 'react';
import { KeyRound, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface SecurityTabContentProps {
  is2faEnabled: boolean;
  setIs2faEnabled: (enabled: boolean) => void;
}

export default function SecurityTabContent({ is2faEnabled, setIs2faEnabled }: SecurityTabContentProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setChangingPassword(true);
      await api.put('/api/users/me/password', {
        currentPassword,
        newPassword,
      });
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully',
      });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setToggling2FA(true);
      const response = await api.post<{ success: boolean; twoFactorEnabled: boolean }>(
        '/api/users/me/two-factor',
        { enabled: !is2faEnabled }
      );
      
      if (response.success) {
        setIs2faEnabled(response.twoFactorEnabled);
        toast({
          title: response.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled',
          description: `Two-factor authentication has been ${response.twoFactorEnabled ? 'enabled' : 'disabled'}`,
        });
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to update 2FA settings',
        variant: 'destructive',
      });
    } finally {
      setToggling2FA(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><KeyRound size={20} /></div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <input 
            type="password" 
            placeholder="Current Password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
          <input 
            type="password" 
            placeholder="New Password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition" 
          />
          <button 
            type="submit"
            disabled={changingPassword}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {changingPassword && <Loader2 className="animate-spin" size={16} />}
            Update Password
          </button>
        </form>
      </div>

      {/* 2FA Implementation */}
      <div className="bg-white border border-slate-200 rounded-xl p-10 overflow-hidden relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-xl text-green-600"><Smartphone size={20} /></div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Multi-Factor Authentication</h2>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-xl">
          Add an extra layer of security to your account by requiring a code from your mobile device. Essential for accounts managing **Banking APIs**.
        </p>
        
        {!is2faEnabled ? (
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-200">
            <div className="w-32 h-32 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-3 shadow-sm">
               <div className="w-full h-full bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:12px_12px]" />
            </div>
            <div className="space-y-4 flex-1">
              <p className="text-sm font-semibold text-slate-700">Enable Two-Factor Authentication</p>
              <div className="flex gap-2">
                 <button 
                   onClick={handleToggle2FA}
                   disabled={toggling2FA}
                   className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   {toggling2FA && <Loader2 className="animate-spin" size={16} />}
                   Enable 2FA
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="font-bold text-emerald-800">2FA is currently active</span>
            </div>
            <button 
              onClick={handleToggle2FA}
              disabled={toggling2FA}
              className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
            >
              {toggling2FA ? 'Updating...' : 'Disable 2FA'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

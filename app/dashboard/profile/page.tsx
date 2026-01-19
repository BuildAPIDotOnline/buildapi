"use client";

import { useState, useEffect } from 'react';
import { User, Lock, History } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileHeader from '@/components/dashboard/profile/ProfileHeader';
import ProfileCard from '@/components/dashboard/profile/ProfileCard';
import SecurityTip from '@/components/dashboard/profile/SecurityTip';
import ProfileTabContent from '@/components/dashboard/profile/ProfileTabContent';
import SecurityTabContent from '@/components/dashboard/profile/SecurityTabContent';
import DangerZone from '@/components/dashboard/profile/DangerZone';
import { api } from '@/lib/api-client';

export default function ProfilePage() {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<{ user: { twoFactorEnabled?: boolean } }>('/api/users/me');
      setIs2faEnabled(response.user.twoFactorEnabled || false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 relative">
      {/* Background Mesh Overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <ProfileHeader is2faEnabled={is2faEnabled} />

      <div className="flex gap-6">
        
        {/* LEFT COLUMN: Profile & Status */}
        <div className=" space-y-6">
          <ProfileCard />
          <SecurityTip />
        </div>

        {/* RIGHT COLUMN: Settings Content */}
        <div className="">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-slate-100/50 backdrop-blur-sm p-1.5 h-auto w-full justify-start mb-8 rounded-xl ">
              <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 py-3 font-bold text-xs uppercase tracking-widest">
                <User size={14} className="mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 py-3 font-bold text-xs uppercase tracking-widest">
                <Lock size={14} className="mr-2" /> Security
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 py-3 font-bold text-xs uppercase tracking-widest">
                <History size={14} className="mr-2" /> Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0 animate-in fade-in slide-in-from-bottom-2">
              <ProfileTabContent />
            </TabsContent>

            <TabsContent value="security" className="mt-0 animate-in fade-in slide-in-from-bottom-2">
              <SecurityTabContent is2faEnabled={is2faEnabled} setIs2faEnabled={setIs2faEnabled} />
            </TabsContent>
          </Tabs>

          <DangerZone />
        </div>
      </div>
    </div>
  );
}

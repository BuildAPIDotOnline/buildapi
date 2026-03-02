'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Users, Key, CreditCard, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  variant?: 'light' | 'dark';
}

const MetricCard = ({
  title,
  value,
  subtext,
  icon,
  variant = 'light',
}: MetricCardProps) => {
  const isDark = variant === 'dark';
  return (
    <div
      className={`p-4 md:p-8 rounded-xl transition-all border ${
        isDark
          ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className={`flex items-center gap-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
        >
          <div
            className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-blue-50'}`}
          >
            {icon}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">
            {title}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl md:text-4xl font-bold tracking-tighter italic">
          {value}
        </h3>
        <p
          className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {subtext}
        </p>
      </div>
      <div className="mt-6 h-1 w-full bg-slate-100/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
          style={{ width: '65%' }}
        />
      </div>
    </div>
  );
};

interface Stats {
  totalUsers: number;
  totalRevenue: number;
  activeKeysCount: number;
  plansCount: number;
  recentPaymentsCount: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Stats>('/api/admin/stats');
        setStats(res);
      } catch {
        setStats({
          totalUsers: 0,
          totalRevenue: 0,
          activeKeysCount: 0,
          plansCount: 0,
          recentPaymentsCount: 0,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Admin Overview
          </h2>
          <p className="text-slate-500 text-sm">
            Platform metrics at a glance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={s.totalUsers.toLocaleString()}
          subtext="Registered accounts"
          icon={<Users size={20} />}
        />
        <MetricCard
          title="Active API Keys"
          value={s.activeKeysCount.toLocaleString()}
          subtext="Non-revoked keys"
          icon={<Key size={20} />}
        />
        <MetricCard
          title="Pricing Plans"
          value={s.plansCount.toString()}
          subtext="Plans in catalog"
          icon={<CreditCard size={20} />}
        />
        <MetricCard
          title="Total Revenue"
          value={`₦${Number(s.totalRevenue).toLocaleString()}`}
          subtext="From successful payments"
          variant="dark"
          icon={<TrendingUp size={20} />}
        />
        <MetricCard
          title="Payments (7 days)"
          value={s.recentPaymentsCount.toString()}
          subtext="Last 7 days"
          icon={<Activity size={20} />}
        />
      </div>
    </div>
  );
}

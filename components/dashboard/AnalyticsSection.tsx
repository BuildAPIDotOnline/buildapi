"use client";

import React, { useEffect, useState } from 'react';
import { Activity, Zap, ShieldAlert, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { api, ApiClientError } from '@/lib/api-client';

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  variant?: "light" | "dark";
}

const MetricCard = ({ title, value, subtext, trend, icon, variant = "light" }: MetricCardProps) => {
  const isDark = variant === "dark";
  
  return (
    <div className={`p-8 rounded-xl  transition-all border ${
      isDark 
        ? "bg-slate-900 text-white border-slate-800 shadow-xl" 
        : "bg-white text-slate-900 border-slate-200"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-3 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
          <div className={`p-2 rounded-xl ${isDark ? "bg-white/10" : "bg-blue-50"}`}>
            {icon}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">{title}</p>
        </div>
        {trend && trend !== "neutral" && (
          <div className={`flex items-center text-xs font-bold ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
            {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-4xl font-bold tracking-tighter italic">{value}</h3>
        <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {subtext}
        </p>
      </div>

      {/* Decorative sparkline-style visual */}
      <div className="mt-6 h-1 w-full bg-slate-100/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"}`} style={{ width: '65%' }} />
      </div>
    </div>
  );
};

export default function AnalyticsSection() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ overview: any }>('/api/analytics/overview');
      setAnalytics(response.overview);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default values on error
      setAnalytics({
        throughput: { total: 0, value: '0', subtext: 'Total API requests in last 24h', trend: 'neutral' },
        latency: { p99: 0, avg: 0, value: '0ms', subtext: 'P99 response time', trend: 'neutral' },
        successRate: { rate: 100, value: '100%', subtext: 'No failures', trend: 'neutral' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Performance</h2>
            <p className="text-slate-500 text-sm">Real-time health of your Banking, CRM, and CMS endpoints.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const throughput = analytics?.throughput || { total: 0, value: '0', subtext: 'Total API requests in last 24h', trend: 'neutral' };
  const latency = analytics?.latency || { p99: 0, avg: 0, value: '0ms', subtext: 'P99 response time', trend: 'neutral' };
  const successRate = analytics?.successRate || { rate: 100, value: '100%', subtext: 'No failures', trend: 'neutral' };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Performance</h2>
          <p className="text-slate-500 text-sm">Real-time health of your Banking, CRM, and CMS endpoints.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Throughput Card */}
        <MetricCard 
          title="Throughput"
          value={throughput.value}
          subtext={throughput.subtext}
          trend={throughput.trend}
          icon={<Activity size={20} />}
        />

        {/* Latency Card */}
        <MetricCard 
          title="P99 Latency"
          value={latency.value}
          subtext={latency.subtext}
          trend={latency.trend}
          icon={<Zap size={20} />}
        />

        {/* Error Rate Card (Dark variant for emphasis) */}
        <MetricCard 
          title="Success Rate"
          value={successRate.value}
          subtext={successRate.subtext}
          variant="dark"
          trend={successRate.trend}
          icon={<ShieldAlert size={20} />}
        />
      </div>
    </section>
  );
};

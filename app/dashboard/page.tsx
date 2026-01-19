"use client";

import ApiKeyTable from '@/components/dashboard/ApiTable';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import React, { useState } from 'react';
import { 
  Landmark, 
  Users, 
  ShoppingBag, 
  Layout, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Send 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Cell 
} from 'recharts';

// --- Mock Data ---
const usageData = [
  { name: 'Mon', requests: 2400 },
  { name: 'Tue', requests: 4560 },
  { name: 'Wed', requests: 3200 },
  { name: 'Thu', requests: 5800 },
  { name: 'Fri', requests: 4900 },
  { name: 'Sat', requests: 2100 },
  { name: 'Sun', requests: 1200 },
];

const verticals = [
  { id: 'banking', name: 'Banking', icon: Landmark, color: 'bg-blue-50 text-blue-600 border-blue-100', activeBg: 'bg-blue-600' },
  { id: 'crm', name: 'CRM & Sales', icon: Users, color: 'bg-purple-50 text-purple-600 border-purple-100', activeBg: 'bg-purple-600' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', activeBg: 'bg-emerald-600' },
  { id: 'cms', name: 'CMS Dashboards', icon: Layout, color: 'bg-amber-50 text-amber-600 border-amber-100', activeBg: 'bg-amber-600' },
];

export default function DashboardPage() {
  const [selectedVertical, setSelectedVertical] = useState('banking');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("ak_live_51P8Xk2L9mQz7vR4nJ2...");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
  <AnalyticsSection />
<ApiKeyTable />
   
      {/* 3. SUPPORT FORM SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#F3F4F6] rounded-lg p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Contact Support</h2>
          <p className="text-slate-500 mb-10 max-w-md">Describe your integration issue and our engineers will help you deploy within hours.</p>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Topic</label>
              <select className="w-full bg-white border-none rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                <option>API Integration Help</option>
                <option>Billing Question</option>
                <option>Report a Bug</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">App Environment</label>
              <input type="text" placeholder="e.g. Production / Staging" className="w-full bg-white border-none rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
              <textarea rows={4} placeholder="What can we help you with?" className="w-full bg-white border-none rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
            </div>
            <button className="md:col-span-2 bg-blue-600 text-white p-5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-200">
              Submit Ticket <Send size={18} />
            </button>
          </form>
        </div>

        {/* Quick Help Card */}
        <div className="bg-slate-900 rounded-lg p-10 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">View Documentation</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Check our extensive API guides for Banking, CRM, and E-commerce before submitting a ticket.
            </p>
          </div>
          <button className="flex items-center justify-between w-full border border-white/20 p-5 rounded-lg hover:bg-white hover:text-black transition-all group">
            <span className="font-bold">Open Docs</span>
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
}
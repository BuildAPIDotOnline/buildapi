"use client";

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageCircle, 
  FileText, 
  Plus, 
  Minus, 
  ArrowRight,
  LifeBuoy,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  { q: "How do I rotate my Banking API keys?", a: "You can rotate keys in the 'API Keys' section by clicking the 'Rotate' button. This will invalidate the old key immediately." },
  { q: "What is the rate limit for the CRM vertical?", a: "The Pro plan allows for 5,000 requests per minute across all CRM and Sales endpoints." },
  { q: "Do you offer custom SLA for Enterprises?", a: "Yes, we provide 99.99% uptime guarantees for our Enterprise Banking and Finance partners." },
];

interface Ticket {
  id: string;
  subject: string;
  affectedVertical: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Industry {
  id: string;
  name: string;
}

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    affectedVertical: '',
    priority: 'normal',
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, industriesResponse] = await Promise.all([
        api.get<{ tickets: Ticket[] }>('/api/support/tickets'),
        api.get<{ industries: Industry[] }>('/api/industries'),
      ]);

      setTickets(ticketsResponse.tickets);
      setIndustries(industriesResponse.industries);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load support data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.affectedVertical) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post<{ success: boolean; ticket: Ticket }>(
        '/api/support/tickets',
        formData
      );

      if (response.success) {
        toast({
          title: 'Ticket Created',
          description: 'Your support ticket has been created successfully',
        });
        setFormData({
          subject: '',
          description: '',
          affectedVertical: '',
          priority: 'normal',
        });
        await fetchData();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to create ticket',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-600';
      case 'in-progress':
        return 'bg-amber-50 text-amber-600';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-600';
      case 'closed':
        return 'bg-slate-50 text-slate-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-rose-600';
      case 'high':
        return 'text-orange-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="pb-20 relative">
      {/* Mesh Background Overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
          <LifeBuoy size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Help & Support</h1>
          <p className="text-slate-500 font-medium">Get technical assistance for your API integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: Support Ticket Form */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-10">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="text-blue-600" />
            <h2 className="text-2xl font-bold">Open a Support Ticket</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Affected Vertical</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                  value={formData.affectedVertical}
                  onChange={(e) => setFormData({...formData, affectedVertical: e.target.value})}
                  required
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.name}>{ind.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                <select 
                  className={`w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 appearance-none font-bold ${getPriorityColor(formData.priority)}`}
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High (Urgent)</option>
                  <option value="critical">Critical (System Down)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
              <input 
                type="text" 
                placeholder="Summary of the issue" 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                rows={5} 
                placeholder="Include relevant API keys or error codes (no secrets)..." 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none transition"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Send Message <Send size={18} />
                </>
              )}
            </button>
          </form>

          {/* Tickets List */}
          {tickets.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold mb-4">Your Tickets</h3>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm">{ticket.subject}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{ticket.affectedVertical}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: FAQ Accordion */}
        <div className="lg:col-span-2 space-y-6 mt-10">
          <div className="bg-slate-900 rounded-xl p-10 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FileText size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Quick Documentation</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Check our extensive API guides for Banking, CRM, and E-commerce before submitting a ticket.
              </p>
              <button className="flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300 transition group">
                Go to Docs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Common Questions</h3>
            <div className="divide-y divide-slate-50">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">{faq.q}</span>
                    {openFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

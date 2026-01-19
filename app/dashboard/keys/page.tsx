"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Key, Copy, RefreshCw, Trash2, ShieldCheck, 
  ExternalLink, Search, Filter, Plus, Info,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// --- Types ---
interface ApiKey {
  id: string;
  name: string;
  vertical: string;
  key: string;
  status: 'active' | 'revoked' | 'warning';
  usage: number;
  limit: number;
  created: string;
  environment: 'production' | 'test';
}

export default function ApiKeysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyIndustry, setNewKeyIndustry] = useState('');
  const [newKeyPlanId, setNewKeyPlanId] = useState('');
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'production' | 'test'>('production');
  const [creating, setCreating] = useState(false);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [newKeyDisplay, setNewKeyDisplay] = useState<{ key: string; id: string } | null>(null);
  const [industries, setIndustries] = useState<Array<{ id: string; name: string }>>([]);
  const [plans, setPlans] = useState<Array<{ id: string; name: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [industriesResponse, plansResponse] = await Promise.all([
        api.get<{ industries: Array<{ id: string; name: string }> }>('/api/industries'),
        api.get<{ plans: Array<{ id: string; name: string }> }>('/api/pricing/plans'),
      ]);
      setIndustries(industriesResponse.industries);
      setPlans(plansResponse.plans);
      if (plansResponse.plans.length > 0) {
        setNewKeyPlanId(plansResponse.plans[0].id);
      }
      if (industriesResponse.industries.length > 0) {
        setNewKeyIndustry(industriesResponse.industries[0].name);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ keys: ApiKey[] }>('/api/keys');
      setApiKeys(response.keys.map(k => ({
        ...k,
        vertical: k.vertical as string,
        status: k.status === 'revoked' ? 'revoked' : (k.usage / k.limit > 0.8 ? 'warning' : 'active') as 'active' | 'revoked' | 'warning',
      })));
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim() || !newKeyIndustry || !newKeyPlanId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreating(true);
      const response = await api.post<{ success: boolean; key: { id: string; key: string; prefix: string } }>(
        '/api/keys',
        {
          name: newKeyName,
          industry: newKeyIndustry,
          planId: newKeyPlanId,
          environment: newKeyEnvironment,
        }
      );

      if (response.success && response.key) {
        setNewKeyDisplay({ key: response.key.key, id: response.key.id });
        setCreateDialogOpen(false);
        setNewKeyName('');
        await fetchApiKeys();
        toast({
          title: 'API Key Created',
          description: 'Your new API key has been created. Copy it now - you won\'t be able to see it again!',
        });
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRotateKey = async (keyId: string) => {
    try {
      setRotatingId(keyId);
      const response = await api.put<{ success: boolean; key: string; prefix: string }>(
        `/api/keys/${keyId}/rotate`
      );

      if (response.success && response.key) {
        setNewKeyDisplay({ key: response.key, id: keyId });
        await fetchApiKeys();
        toast({
          title: 'Key Rotated',
          description: 'Your API key has been rotated. Copy the new key now!',
        });
      }
    } catch (error) {
      console.error('Error rotating key:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to rotate key',
        variant: 'destructive',
      });
    } finally {
      setRotatingId(null);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete<{ success: boolean }>(`/api/keys/${keyId}`);
      if (response.success) {
        await fetchApiKeys();
        toast({
          title: 'Key Revoked',
          description: 'The API key has been revoked successfully',
        });
      }
    } catch (error) {
      console.error('Error revoking key:', error);
      toast({
        title: 'Error',
        description: error instanceof ApiClientError ? error.message : 'Failed to revoke key',
        variant: 'destructive',
      });
    }
  };

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.vertical.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'revoked':
        return 'Revoked';
      case 'warning':
        return 'Warning';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Secret Keys</h1>
            <p className="text-slate-500 font-medium">Manage production and test credentials for your services.</p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-200 h-12"
          >
            <Plus size={18} /> Create New Key
          </Button>
        </div>

        {/* Security Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <ShieldCheck size={20} />
          </div>
          <div className="text-sm">
            <h4 className="font-bold text-blue-900 mb-1">Protect your keys</h4>
            <p className="text-blue-700/70 leading-relaxed">
              Your API keys carry significant privileges. Never share them in publicly accessible areas such as GitHub or client-side code.
            </p>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex-1 group">
            <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition" />
            <input 
              type="text" 
              placeholder="Search keys by name or industry..." 
              className="bg-transparent text-sm w-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition border border-slate-100">
            <Filter size={18} />
          </button>
        </div>

        {/* Keys Table */}
        <div className="bg-white border border-slate-200 py-8 rounded-xl overflow-hidden">
          {filteredKeys.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              {apiKeys.length === 0 ? 'No API keys found. Create your first key to get started.' : 'No keys match your search.'}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Name</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usage</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key String</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {filteredKeys.map((k) => (
                    <motion.tr 
                      layout
                      key={k.id} 
                      className="group hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm mb-1">{k.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                              k.vertical === 'Banking' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              k.vertical === 'CRM' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                              k.vertical === 'E-commerce' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {k.vertical}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Created {k.created}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-500">{k.usage.toLocaleString()} / {k.limit === 999999999 ? '∞' : k.limit.toLocaleString()}</span>
                            <span className={k.status === 'warning' ? 'text-amber-500' : 'text-slate-400'}>
                              {k.limit === 999999999 ? '0' : Math.round((k.usage / k.limit) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${k.limit === 999999999 ? 0 : (k.usage / k.limit) * 100}%` }}
                              className={`h-full rounded-full ${k.status === 'warning' ? 'bg-amber-500' : 'bg-blue-600'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl w-fit group-hover:bg-white transition">
                          <code className="text-xs font-mono text-slate-500">{k.key}</code>
                          <button 
                            onClick={() => copyToClipboard(k.key, k.id)}
                            className="p-1 text-slate-300 hover:text-blue-600 transition"
                          >
                            {copiedId === k.id ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {k.status !== 'revoked' && (
                            <>
                              <button 
                                onClick={() => handleRotateKey(k.id)}
                                disabled={rotatingId === k.id}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition disabled:opacity-50"
                                title="Rotate Key"
                              >
                                {rotatingId === k.id ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                              </button>
                              <button 
                                onClick={() => handleRevokeKey(k.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition" 
                                title="Revoke Key"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl p-10 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[80px] group-hover:bg-blue-600/30 transition" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 italic">
                <Key size={20} className="text-blue-400" /> Key Rotation Policy
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                We recommend rotating your production keys every 90 days to maintain banking-grade security across your webapps.
              </p>
              <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition">
                Setup Auto-Rotation
              </button>
            </div>
          </div>

          <div className="bg-[#F3F4F6] rounded-xl p-10 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Environment Usage</h3>
            <div className="space-y-4">
              {[
                { label: 'Production', val: apiKeys.filter(k => k.environment === 'production' && k.status !== 'revoked').length, total: apiKeys.filter(k => k.status !== 'revoked').length },
                { label: 'Test', val: apiKeys.filter(k => k.environment === 'test' && k.status !== 'revoked').length, total: apiKeys.filter(k => k.status !== 'revoked').length }
              ].map((env) => {
                const percentage = env.total > 0 ? Math.round((env.val / env.total) * 100) : 0;
                return (
                  <div key={env.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>{env.label}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${env.label === 'Production' ? 'bg-blue-600' : 'bg-slate-300'} rounded-full`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Key Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Enter details for your new API key. You'll be able to see the full key only once after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Key Name</label>
              <Input
                placeholder="e.g. Production Banking Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                value={newKeyIndustry}
                onChange={(e) => setNewKeyIndustry(e.target.value)}
              >
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.name}>{ind.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Pricing Plan</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                value={newKeyPlanId}
                onChange={(e) => setNewKeyPlanId(e.target.value)}
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Environment</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                value={newKeyEnvironment}
                onChange={(e) => setNewKeyEnvironment(e.target.value as 'production' | 'test')}
              >
                <option value="production">Production</option>
                <option value="test">Test</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateKey} disabled={creating || !newKeyName || !newKeyIndustry || !newKeyPlanId}>
                {creating ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Create Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Key Display Dialog */}
      <Dialog open={!!newKeyDisplay} onOpenChange={() => setNewKeyDisplay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your New API Key</DialogTitle>
            <DialogDescription>
              Copy this key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <code className="text-sm break-all">{newKeyDisplay?.key}</code>
            </div>
            <Button 
              onClick={() => {
                if (newKeyDisplay) {
                  copyToClipboard(newKeyDisplay.key, newKeyDisplay.id);
                  setNewKeyDisplay(null);
                }
              }}
              className="w-full"
            >
              Copy Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

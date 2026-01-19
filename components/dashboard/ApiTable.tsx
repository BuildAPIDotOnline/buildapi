"use client";

import { Copy, MoreHorizontal, ShieldCheck, RefreshCw, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  vertical: string;
  key: string;
  status: 'active' | 'revoked' | 'warning';
  created: string;
  environment: 'production' | 'test';
  usage: number;
  limit: number;
}

export default function ApiKeyTable() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

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

  const getColorClass = (vertical: string) => {
    switch (vertical) {
      case 'Banking':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CRM':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'E-commerce':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CMS':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchased API Keys</h2>
            <p className="text-slate-500 text-sm">Manage and rotate credentials for your active webapps.</p>
          </div>
        </div>
        <div className="p-8 text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={24} />
        </div>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchased API Keys</h2>
            <p className="text-slate-500 text-sm">Manage and rotate credentials for your active webapps.</p>
          </div>
        </div>
        <div className="p-8 text-center text-slate-500">
          No API keys found. Purchase your first API key to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchased API Keys</h2>
          <p className="text-slate-500 text-sm">Manage and rotate credentials for your active webapps.</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Name</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">API Key</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {apiKeys.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-lg ${item.status === 'active' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getColorClass(item.vertical)}`}>
                  {item.vertical}
                </span>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg w-fit group-hover:bg-white transition-colors">
                  <code className="text-xs font-mono text-slate-500">{item.key}</code>
                  <button 
                    onClick={() => copyToClipboard(item.key, item.id)}
                    className="text-slate-300 hover:text-blue-600"
                  >
                    {copiedId === item.id ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </td>
              <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                {item.created}
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Rotate Key">
                    <RefreshCw size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Revoke Key">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

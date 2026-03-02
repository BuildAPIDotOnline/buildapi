'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import {
  Key,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Ban,
  ShieldAlert,
} from 'lucide-react';

interface KeyRow {
  id: string;
  keyPrefix: string;
  name: string;
  industry: string;
  planName: string;
  status: string;
  created: string;
  userEmail: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<KeyRow | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revoking, setRevoking] = useState(false);
  const { toast } = useToast();

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search.trim()) params.set('search', search.trim());
      const res = await api.get<{
        keys: KeyRow[];
        pagination: Pagination;
      }>(`/api/admin/keys?${params.toString()}`);
      setKeys(res.keys);
      setPagination(res.pagination);
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof ApiClientError ? e.message : 'Failed to load keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [page]);

  const openRevokeDialog = (k: KeyRow) => {
    setKeyToRevoke(k);
    setRevokeReason('Expired');
    setRevokeDialogOpen(true);
  };

  const confirmRevoke = async () => {
    if (!keyToRevoke) return;
    setRevoking(true);
    try {
      await api.post(`/api/admin/keys/${keyToRevoke.id}/revoke`, {
        reason: revokeReason.trim() || undefined,
      });
      toast({ title: 'API key disabled', description: 'The key has been revoked.' });
      setRevokeDialogOpen(false);
      setKeyToRevoke(null);
      await fetchKeys();
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof ApiClientError ? e.message : 'Failed to revoke key',
        variant: 'destructive',
      });
    } finally {
      setRevoking(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchKeys();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Key size={22} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Disable API Keys</h1>
        </div>
        <p className="text-slate-500 text-sm">
          View all API keys and revoke them (e.g. due to expiration). Revoked keys stop working immediately.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by email or key prefix..."
            className="bg-transparent text-sm w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Search
        </Button>
      </div>

      {/* Security note */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-bold text-amber-900 mb-1">Revoking keys</h4>
          <p className="text-amber-800/90">
            Disabling a key is permanent for that key. The user can purchase a new key if needed. Use this for expiration or policy violations.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Key / Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Industry
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Created
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <code className="text-xs font-mono text-slate-600">{k.keyPrefix}</code>
                          <span className="text-sm font-medium text-slate-900">{k.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{k.userEmail}</td>
                      <td className="px-6 py-4 text-slate-600">{k.industry}</td>
                      <td className="px-6 py-4 text-slate-600">{k.planName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            k.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : k.status === 'revoked'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {k.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{k.created}</td>
                      <td className="px-6 py-4 text-right">
                        {k.status !== 'revoked' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1"
                            onClick={() => openRevokeDialog(k)}
                          >
                            <Ban size={14} /> Disable
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {keys.length === 0 && (
              <div className="p-8 text-center text-slate-500">No API keys found.</div>
            )}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 border-t border-slate-100 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Revoke confirmation dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable API key</DialogTitle>
            <DialogDescription>
              This key will stop working immediately. The user will need to purchase a new key if they want to continue.
            </DialogDescription>
          </DialogHeader>
          {keyToRevoke && (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p><strong>Key:</strong> <code className="text-slate-600">{keyToRevoke.keyPrefix}</code></p>
                <p><strong>Owner:</strong> {keyToRevoke.userEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Reason (optional)</label>
                <Input
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Expired"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRevoke}
                  disabled={revoking}
                >
                  {revoking ? <Loader2 size={16} className="animate-spin" /> : null}
                  Disable key
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

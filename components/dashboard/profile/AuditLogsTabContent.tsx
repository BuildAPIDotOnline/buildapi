"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Activity } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  details: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ACTION_LABELS: Record<string, string> = {
  api_key_created: 'API Key Created',
  api_key_rotated: 'API Key Rotated',
  api_key_revoked: 'API Key Revoked',
  api_key_revealed: 'API Key Revealed',
  api_key_updated: 'API Key Updated',
  profile_updated: 'Profile Updated',
  payment_initiated: 'Payment Initiated',
  payment_successful: 'Payment Successful',
  login: 'Login',
  signup: 'Sign Up',
};

function formatAction(action: string): string {
  return ACTION_LABELS[action] || action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

export default function AuditLogsTabContent() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const fetchLogs = async (p: number) => {
    try {
      setLoading(true);
      const response = await api.get<{ logs: AuditLog[]; pagination: Pagination }>(
        `/api/audit/logs?page=${p}&limit=10`
      );
      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audit logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-10">
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  if (logs.length === 0 && !pagination) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-10">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No audit logs yet</h3>
          <p className="text-slate-500 text-sm max-w-md">
            Your account activity will appear here as you use the platform.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Activity Log</h2>
        <p className="text-slate-500 text-sm mt-1">Recent account and security events.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-3 py-3 md:px-6 md:py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
              <th className="px-3 py-3 md:px-6 md:py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource</th>
              <th className="px-3 py-3 md:px-6 md:py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="hidden md:table-cell px-3 py-3 md:px-6 md:py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-3 py-3 md:px-6 md:py-4">
                  <span className="font-medium text-slate-900 text-sm">{formatAction(log.action)}</span>
                </td>
                <td className="px-3 py-3 md:px-6 md:py-4">
                  <span className="text-slate-600 text-sm capitalize">{log.resourceType}</span>
                </td>
                <td className="px-3 py-3 md:px-6 md:py-4 text-slate-500 text-sm">{formatDate(log.createdAt)}</td>
                <td className="hidden md:table-cell px-3 py-3 md:px-6 md:py-4 text-slate-500 text-sm font-mono">{log.ipAddress || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 border-t border-slate-100 px-4 md:px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="gap-1 sm:gap-2"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="gap-1 sm:gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

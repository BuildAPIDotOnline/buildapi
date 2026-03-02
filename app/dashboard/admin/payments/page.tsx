'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from 'lucide-react';

interface PaymentRow {
  id: string;
  email: string;
  amount: number;
  amountFormatted: string;
  plan: string;
  industry: string;
  status: string;
  date: string;
  transactionReference: string;
  appName?: string;
  invoiceId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const { toast } = useToast();

  const fetchPayments = async (overrides?: { page?: number; email?: string }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(overrides?.page ?? page));
      params.set('limit', '10');
      if (statusFilter) params.set('status', statusFilter);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      const email = (overrides?.email !== undefined ? overrides.email : emailSearch).trim();
      if (email) params.set('email', email);
      const res = await api.get<{
        payments: PaymentRow[];
        pagination: Pagination;
      }>(`/api/admin/payments?${params.toString()}`);
      setPayments(res.payments);
      setPagination(res.pagination);
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof ApiClientError ? e.message : 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter, fromDate, toDate]);

  const applyFilters = () => {
    setPage(1);
    fetchPayments({ page: 1, email: emailSearch });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CreditCard size={22} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 flex-1 min-w-[160px]">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="User email..."
            className="bg-transparent text-sm w-full outline-none"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Apply
        </Button>
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
                      Email
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Industry
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4 text-sm text-slate-900">{p.email}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{p.amountFormatted}</td>
                      <td className="px-6 py-4 text-slate-600">{p.plan}</td>
                      <td className="px-6 py-4 text-slate-600">{p.industry}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            p.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{p.date}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs truncate max-w-[120px]">
                        {p.transactionReference || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && (
              <div className="p-8 text-center text-slate-500">No payments found.</div>
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
    </div>
  );
}

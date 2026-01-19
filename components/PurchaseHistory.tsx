"use client";

import { useEffect, useState } from 'react';
import { FileText, Eye, Download, Filter, X } from 'lucide-react';
import { api, ApiClientError } from '@/lib/api-client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface PurchaseHistoryItem {
  id: string;
  invoiceId: string;
  date: string;
  amount: string;
  status: string;
  industry: string;
  appName: string;
  url: string;
  plan: string;
  transactionReference: string;
  paymentMethod: string;
  email: string;
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function PurchaseHistory({ onViewDetails }: { onViewDetails: (id: string) => void }) {
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Items per page
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);

  useEffect(() => {
    fetchPurchaseHistory();
  }, [page, statusFilter, industryFilter]);

  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);
      // Build query string with filters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (industryFilter && industryFilter !== 'all' && industryFilter.trim() !== '') {
        params.append('industry', industryFilter);
      }

      const response = await api.get<{ payments: PurchaseHistoryItem[]; pagination: PaginationData }>(
        `/api/payments/history?${params.toString()}`
      );
      
      // Filter out pending payments with empty fields (duplicates)
      const validPayments = response.payments.filter(payment => 
        payment.status !== 'pending' || (payment.appName && payment.industry)
      );
      setPurchaseHistory(validPayments);
      setPagination(response.pagination);
      
      // Extract unique industries for filter dropdown
      const industries = [...new Set(validPayments.map(p => p.industry).filter(Boolean))].sort();
      setAvailableIndustries(industries);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching purchase history:', err);
      setError(err instanceof ApiClientError ? err.message : 'Failed to load purchase history');
      setPurchaseHistory([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setPage(newPage);
      // Scroll to top of table when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleIndustryFilterChange = (value: string) => {
    setIndustryFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setIndustryFilter('all');
    setPage(1);
  };

  const getStatusPill = (status: string) => {
    if (!status) {
      return (
        <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Unknown
        </span>
      );
    }
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'success') {
      return (
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Success
        </span>
      );
    } else if (statusLower === 'pending') {
      return (
        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Pending
        </span>
      );
    } else if (statusLower === 'failed') {
      return (
        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Failed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-12">
        <div className="p-8 border-b border-slate-50">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase History</h2>
        </div>
        <div className="p-8 text-center text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-12">
        <div className="p-8 border-b border-slate-50">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase History</h2>
        </div>
        <div className="p-8 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (purchaseHistory.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-12">
        <div className="p-8 border-b border-slate-50">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase History</h2>
        </div>
        <div className="p-8 text-center text-slate-500">No purchase history found.</div>
      </div>
    );
  }

  const hasActiveFilters = statusFilter !== 'all' || industryFilter !== 'all';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-12">
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase History</h2>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400" size={16} />
            <span className="text-sm font-medium text-slate-600">Filters:</span>
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          {/* Industry Filter */}
          <Select value={industryFilter} onValueChange={handleIndustryFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {availableIndustries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-600 hover:text-slate-900"
            >
              <X size={16} className="mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice ID</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {purchaseHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-5 text-sm font-medium text-slate-600">{item.date}</td>
                <td className="px-8 py-5 text-sm font-bold text-slate-900">{item.invoiceId}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {item.industry}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {getStatusPill(item.status)}
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-900">{item.amount}</td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button onClick={() => onViewDetails(item.id)} className="p-2 text-slate-400 hover:text-blue-600 transition">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-900 transition">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-6 border-t border-slate-100">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  aria-disabled={!pagination.hasPrevPage}
                />
              </PaginationItem>

              {/* Page numbers */}
              {(() => {
                const pages: (number | 'ellipsis')[] = [];
                const total = pagination.totalPages;
                const current = page;

                if (total <= 7) {
                  // Show all pages if 7 or fewer
                  for (let i = 1; i <= total; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);

                  if (current > 3) {
                    pages.push('ellipsis');
                  }

                  // Show pages around current
                  const start = Math.max(2, current - 1);
                  const end = Math.min(total - 1, current + 1);

                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }

                  if (current < total - 2) {
                    pages.push('ellipsis');
                  }

                  // Always show last page
                  pages.push(total);
                }

                return pages.map((item, index) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => handlePageChange(item)}
                        isActive={item === page}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  aria-disabled={!pagination.hasNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Pagination info */}
          <div className="mt-4 text-center text-sm text-slate-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.totalCount)} of {pagination.totalCount} payments
          </div>
        </div>
      )}
    </div>
  );
}

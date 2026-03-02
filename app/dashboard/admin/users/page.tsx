'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck, Users } from 'lucide-react';

interface UserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  country: string;
  accountStatus: string;
  emailVerified: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending_approval');
  const { toast } = useToast();

  const fetchUsers = async (overrides?: { page?: number; status?: string }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(overrides?.page ?? page));
      params.set('limit', '20');
      params.set('accountStatus', overrides?.status ?? statusFilter);
      const res = await api.get<{
        users: UserRow[];
        pagination: Pagination;
      }>(`/api/admin/users?${params.toString()}`);
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (e) {
      toast({
        title: 'Error',
        description:
          e instanceof ApiClientError ? e.message : 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleApprove = async (userId: string) => {
    setApprovingId(userId);
    try {
      await api.post(`/api/admin/users/${userId}/approve`);
      toast({
        title: 'User approved',
        description: 'The user can now access the dashboard.',
      });
      fetchUsers();
    } catch (e) {
      toast({
        title: 'Error',
        description:
          e instanceof ApiClientError ? e.message : 'Failed to approve user',
        variant: 'destructive',
      });
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Approve Accounts
          </h2>
          <p className="text-slate-500 text-sm">
            Review and approve users waiting for access.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >
            <option value="pending_approval">Pending approval</option>
            <option value="approved">Approved</option>
            <option value="all">All users</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {users.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Users size={48} className="mx-auto mb-4 text-slate-300" />
              <p>No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Created
                    </th>
                    {statusFilter === 'pending_approval' && (
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {u.companyName || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            u.accountStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.accountStatus === 'pending_approval'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.accountStatus || 'approved'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>
                      {statusFilter === 'pending_approval' && (
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(u.id)}
                            disabled={approvingId === u.id}
                            className="gap-1"
                          >
                            {approvingId === u.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <UserCheck size={14} />
                            )}
                            Approve
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.totalCount} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';
import PendingApprovalScreen from './PendingApprovalScreen';

interface UserResponse {
  user: {
    accountStatus?: 'pending_verification' | 'pending_approval' | 'approved';
    email?: string;
  };
}

export default function DashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<'loading' | 'pending_approval' | 'approved' | 'pending_verification'>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<UserResponse>('/api/users/me');
        if (cancelled) return;
        const accountStatus = res.user?.accountStatus || 'approved';
        setEmail(res.user?.email || null);
        if (accountStatus === 'pending_approval') {
          setStatus('pending_approval');
        } else if (accountStatus === 'pending_verification') {
          setStatus('pending_verification');
        } else {
          setStatus('approved');
        }
      } catch {
        if (!cancelled) {
          setStatus('approved');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === 'pending_verification') {
      const params = email ? `?email=${encodeURIComponent(email)}` : '';
      router.replace(`/verify-email${params}`);
    }
  }, [status, email, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (status === 'pending_approval') {
    return <PendingApprovalScreen />;
  }

  return <>{children}</>;
}

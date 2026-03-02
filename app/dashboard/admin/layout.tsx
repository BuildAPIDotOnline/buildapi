'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ user: { isAdmin?: boolean } }>('/api/users/me');
        if (cancelled) return;
        if (!res.user?.isAdmin) {
          router.replace('/dashboard');
          return;
        }
        setAllowed(true);
      } catch {
        if (!cancelled) {
          router.replace('/dashboard');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

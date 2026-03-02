'use client';

import { Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeToken } from '@/lib/auth-storage';
import { useRouter } from 'next/navigation';

export default function PendingApprovalScreen() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Account under review
          </h1>
          <p className="text-muted-foreground">
            Your account is currently under review. It will be accessible within{' '}
            <strong>2–3 business days</strong>. We&apos;ll send you an email once
            it&apos;s approved.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { api, ApiClientError } from '@/lib/api-client';
import { setToken } from '@/lib/auth-storage';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEmail(emailParam);
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || otp.length !== 6) {
      toast({
        title: 'Invalid input',
        description: 'Please enter your email and 6-digit verification code.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post<{
        success: boolean;
        token: string;
        redirectTo: string;
      }>('/api/auth/verify-email', { email: email.trim().toLowerCase(), otp });

      if (response.success && response.token) {
        setToken(response.token);
        toast({
          title: 'Email verified',
          description: 'Your account is under review. You can sign in to check status.',
        });
        router.push(response.redirectTo || '/dashboard');
      }
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Failed to verify email.';
      toast({
        title: 'Verification failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    setResendLoading(true);
    try {
      await api.post('/api/auth/resend-otp', { email: email.trim().toLowerCase() });
      toast({
        title: 'Code sent',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Failed to resend code.';
      toast({
        title: 'Resend failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Verify your email
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Enter the 6-digit code we sent to your email address.
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={!!emailParam}
                  className="disabled:opacity-70"
                />
              </div>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium mb-2"
                >
                  Verification code
                </label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Verifying...' : 'Verify email'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResend}
                disabled={resendLoading || !email}
              >
                {resendLoading ? 'Sending...' : 'Resend code'}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || !email}
                className="text-primary hover:underline font-medium"
              >
                Resend
              </button>
            </p>
            <p className="mt-4">
              <Link href="/login" className="text-primary hover:underline font-medium">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

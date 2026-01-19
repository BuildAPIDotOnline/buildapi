'use client'

import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import LoginForm from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />
      
      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Welcome back
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Sign in to your BuildAPI account to continue building.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-lg border border-border p-8 md:p-12">
            <LoginForm />
          </div>

          {/* Sign up Link */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">99.99%</div>
              <div className="text-xs text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">1000+</div>
              <div className="text-xs text-muted-foreground">Developer Users</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">SOC 2</div>
              <div className="text-xs text-muted-foreground">Type II Certified</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}




import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Sparkles, Wrench, Bug } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Changelog | BuildAPI - What\'s New',
  description: 'Latest product updates, new features, improvements, and bug fixes from BuildAPI.',
}

const releases = [
  {
    version: '1.4.0',
    date: '2025-02-10',
    items: [
      { type: 'feature' as const, text: 'Webhook retry configuration with exponential backoff' },
      { type: 'feature' as const, text: 'Bulk API key rotation endpoint' },
      { type: 'improvement' as const, text: 'Improved audit log query performance' },
      { type: 'fix' as const, text: 'Fixed pagination cursor for large result sets' },
    ],
  },
  {
    version: '1.3.2',
    date: '2025-01-28',
    items: [
      { type: 'feature' as const, text: 'Python SDK v1.0 released' },
      { type: 'improvement' as const, text: 'Rate limit headers now include reset time' },
      { type: 'fix' as const, text: 'Resolved timezone handling in usage reports' },
    ],
  },
  {
    version: '1.3.0',
    date: '2025-01-15',
    items: [
      { type: 'feature' as const, text: 'Two-factor authentication for dashboard accounts' },
      { type: 'feature' as const, text: 'Profile avatar upload support' },
      { type: 'improvement' as const, text: 'Mobile-responsive dashboard and purchase flow' },
    ],
  },
  {
    version: '1.2.0',
    date: '2024-12-20',
    items: [
      { type: 'feature' as const, text: 'Purchase history with filters and pagination' },
      { type: 'feature' as const, text: 'API key reveal for secure copy-to-clipboard' },
      { type: 'improvement' as const, text: 'Enhanced payment verification flow' },
    ],
  },
]

function TypeIcon({ type }: { type: 'feature' | 'improvement' | 'fix' }) {
  if (type === 'feature') return <Sparkles className="w-4 h-4 text-emerald-500" />
  if (type === 'improvement') return <Wrench className="w-4 h-4 text-blue-500" />
  return <Bug className="w-4 h-4 text-amber-500" />
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              What&apos;s new at BuildAPI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Product updates, new features, improvements, and bug fixes. Subscribe to stay in the loop.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="text-xs text-slate-500">New features</span>
              <span className="text-xs text-slate-500">Improvements</span>
              <span className="text-xs text-slate-500">Bug fixes</span>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            {releases.map((release) => (
              <div
                key={release.version}
                className="border-b border-slate-200 py-10 first:pt-0"
              >
                <div className="flex items-baseline justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{release.version}</h2>
                  <time className="text-sm text-slate-500">{release.date}</time>
                </div>
                <ul className="space-y-3">
                  {release.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5">
                        <TypeIcon type={item.type} />
                      </span>
                      <span className="text-slate-600">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Stay up to date</h2>
            <p className="text-slate-500 mb-8">
              Get product updates delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button className="shrink-0">Subscribe</Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to build?</h2>
            <p className="text-slate-500 mb-8">
              Start using the latest features today.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Get Started <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

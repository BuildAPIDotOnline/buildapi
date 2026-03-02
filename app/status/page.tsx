import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Status | BuildAPI - System Status',
  description: 'BuildAPI system status, uptime, and incident history. 99.99% uptime SLA.',
}

const services = [
  { name: 'API', status: 'operational' as const },
  { name: 'Dashboard', status: 'operational' as const },
  { name: 'Payments', status: 'operational' as const },
  { name: 'Authentication', status: 'operational' as const },
  { name: 'Webhooks', status: 'operational' as const },
]

const stats = [
  { label: 'Current uptime', value: '99.99%' },
  { label: 'Avg response time', value: '42ms' },
  { label: 'Successful requests (24h)', value: '2.4M' },
]

const incidents = [
  {
    date: '2025-02-08',
    title: 'Brief API latency spike',
    status: 'resolved' as const,
    duration: '8 minutes',
  },
  {
    date: '2025-01-15',
    title: 'Scheduled maintenance',
    status: 'resolved' as const,
    duration: '15 minutes',
  },
]

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All systems operational
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              System Status
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time status of BuildAPI services. We aim for 99.99% uptime.
            </p>
          </div>
        </section>

        {/* Status Overview */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Service status</h2>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-center justify-between px-6 py-4 border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-slate-900">{svc.name}</span>
                  <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Operational
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Uptime Stats */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Uptime</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-slate-200 p-6 text-center"
                >
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 h-24 bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-slate-400 text-sm">Uptime chart (last 90 days)</span>
            </div>
          </div>
        </section>

        {/* Incident History */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Incident history</h2>
            {incidents.length === 0 ? (
              <p className="text-slate-500">No incidents in the past 90 days.</p>
            ) : (
              <div className="space-y-4">
                {incidents.map((inc) => (
                  <div
                    key={inc.date + inc.title}
                    className="rounded-xl border border-slate-200 p-6 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">{inc.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {inc.date} · {inc.duration}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full shrink-0">
                      Resolved
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Subscribe */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscribe to updates</h2>
            <p className="text-slate-500 mb-8">
              Get notified of incidents and scheduled maintenance via email.
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Questions?</h2>
            <p className="text-slate-500 mb-8">
              Contact our support team for help.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                Contact Support <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

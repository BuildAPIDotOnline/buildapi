import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Lock,
  FileCheck,
  UserCheck,
  Database,
  ArrowUpRight,
  Award,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security | BuildAPI - Banking-Grade Security',
  description:
    'BuildAPI is SOC 2 Type II certified with end-to-end encryption, RBAC, audit logs, and 2FA. Built for compliance.',
}

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    desc: 'AES-256 encryption for data at rest and TLS 1.3 in transit. Your data is protected at every layer.',
  },
  {
    icon: UserCheck,
    title: 'Role-Based Access Control',
    desc: 'Fine-grained permissions for teams. Control who can create keys, view logs, and manage billing.',
  },
  {
    icon: FileCheck,
    title: 'Audit Logs',
    desc: 'Complete activity tracking for every API call, login, and configuration change. Immutable and tamper-proof.',
  },
  {
    icon: Shield,
    title: 'Two-Factor Authentication',
    desc: 'Optional 2FA for dashboard accounts. Add an extra layer of protection for sensitive operations.',
  },
  {
    icon: Database,
    title: 'Compliance',
    desc: 'Designed for PCI DSS, GDPR, and industry-specific requirements. SOC 2 Type II certified.',
  },
]

const certifications = [
  { name: 'SOC 2 Type II', desc: 'Annual audit of security controls' },
  { name: 'PCI DSS', desc: 'Payment card industry compliance' },
  { name: 'GDPR', desc: 'Data protection for EU customers' },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              SOC 2 Type II Certified
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Banking-grade security
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              We take security seriously. BuildAPI is built with enterprise-grade controls so you can trust your data is safe.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Get Started <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all"
                >
                  <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                    <f.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Certifications & compliance
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {certifications.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-slate-200 p-6 text-center"
                >
                  <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-20 px-6 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">99.99%</div>
                <div className="text-slate-400 text-sm mt-1">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold">AES-256</div>
                <div className="text-slate-400 text-sm mt-1">Encryption</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-slate-400 text-sm mt-1">Security Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-slate-400 text-sm mt-1">Data Breaches</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Build on a secure foundation</h2>
            <p className="text-slate-500 mb-8">
              Start with BuildAPI and focus on your product, not infrastructure.
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

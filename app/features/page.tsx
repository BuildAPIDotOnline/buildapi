import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import {
  Lock,
  Shield,
  Database,
  Zap,
  FileText,
  Webhook,
  Code2,
  CheckCircle2,
  ArrowUpRight,
  Activity,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features | BuildAPI - Production-Ready APIs',
  description:
    'Explore BuildAPI features: authentication, encryption, rate limiting, audit logs, webhooks, SDKs, and compliance. Built for scale.',
}

const features = [
  {
    icon: Lock,
    title: 'Authentication & Authorization',
    description:
      'Multi-factor authentication, OAuth2, JWT tokens, and role-based access control. Secure user identity management out of the box.',
  },
  {
    icon: Shield,
    title: 'End-to-End Encryption',
    description:
      'Military-grade AES-256 encryption for data at rest and in transit. Protect sensitive information across all platforms.',
  },
  {
    icon: Database,
    title: 'Data Management',
    description:
      'Scalable database APIs with built-in backup, replication, and disaster recovery for mission-critical applications.',
  },
  {
    icon: Zap,
    title: 'Rate Limiting & Quotas',
    description:
      'Intelligent rate limiting, usage tracking, and quota management. Perfect for multi-tenant and API-driven platforms.',
  },
  {
    icon: FileText,
    title: 'Audit Logs',
    description:
      'Comprehensive activity tracking for every API call. Meet compliance requirements and troubleshoot issues with full visibility.',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description:
      'Real-time event notifications for payments, key rotations, and account changes. Stay in sync with your integrations.',
  },
  {
    icon: Code2,
    title: 'SDKs & Libraries',
    description:
      'Official SDKs for JavaScript, Python, and more. Type-safe clients with built-in retry logic and error handling.',
  },
  {
    icon: CheckCircle2,
    title: 'Compliance',
    description:
      'SOC 2 Type II certified. Built for PCI DSS, GDPR, and industry-specific regulatory requirements.',
  },
]

const scaleStats = [
  { label: 'Throughput', value: '10M+', subtext: 'Requests per day' },
  { label: 'P99 Latency', value: '<50ms', subtext: 'Response time' },
  { label: 'Uptime SLA', value: '99.99%', subtext: 'Guaranteed availability' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Production-Ready APIs for Every Use Case
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Comprehensive, enterprise-grade APIs designed to accelerate development and reduce time-to-market across Banking, CRM, E-commerce, and CMS applications.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Start Building <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all"
                >
                  <div className="mb-4 inline-flex p-3 bg-blue-50 rounded-xl">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Scale */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for Scale</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Engineered to handle enterprise workloads with reliability and performance you can count on.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {scaleStats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Highlights */}
        <section className="py-20 px-6 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Activity className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">RESTful APIs</h3>
                <p className="text-slate-400 text-sm">
                  Clean, predictable endpoints with OpenAPI specs. Integrate in minutes with standard HTTP clients.
                </p>
              </div>
              <div>
                <Webhook className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Webhooks</h3>
                <p className="text-slate-400 text-sm">
                  Receive real-time events for payments, key rotations, and account changes. Retries and signing included.
                </p>
              </div>
              <div>
                <Code2 className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">SDKs</h3>
                <p className="text-slate-400 text-sm">
                  Official SDKs for popular languages. Type-safe, well-documented, and maintained by our team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to build?</h2>
            <p className="text-slate-500 mb-8">
              Join thousands of developers using BuildAPI to power their applications.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Start Building <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

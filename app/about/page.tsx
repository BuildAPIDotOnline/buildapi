import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Target, Zap, Shield, Users, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | BuildAPI - We Power the Next Generation of APIs',
  description: 'BuildAPI mission, values, and team. Production-ready APIs for developers worldwide.',
}

const values = [
  {
    icon: Zap,
    title: 'Developer-first',
    desc: 'We build for developers. Clear docs, sensible defaults, and support when you need it.',
  },
  {
    icon: Shield,
    title: 'Security by design',
    desc: 'Banking-grade security isn\'t optional. We bake it into every layer of our platform.',
  },
  {
    icon: Users,
    title: 'Customer-obsessed',
    desc: 'Your success is our success. We listen, iterate, and ship what you need.',
  },
  {
    icon: Target,
    title: 'Ship faster',
    desc: 'Spend less time on infrastructure, more time building what matters to your users.',
  },
]

const stats = [
  { value: '1000+', label: 'Developer users' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '4', label: 'Industry verticals' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              We power the next generation of APIs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              BuildAPI provides production-ready APIs for Banking, CRM, E-commerce, and CMS. Our mission is to help developers ship faster by handling the complexity of infrastructure, security, and compliance.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Get Started <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Our mission</h2>
            <p className="text-slate-600 leading-relaxed">
              We believe every developer deserves access to enterprise-grade APIs without the enterprise complexity. BuildAPI removes the barriers between ideas and production—so you can focus on building what matters.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-slate-200 p-8 text-center">
                  <div className="p-3 bg-blue-50 rounded-xl w-fit mx-auto mb-4">
                    <v.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-6 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-bold">{s.value}</div>
                  <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Join us</h2>
            <p className="text-slate-500 mb-8">
              Start building with BuildAPI today.
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

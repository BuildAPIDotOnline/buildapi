import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart,
  GitBranch,
  Landmark,
  Building2,
  Store,
  Layout,
  ArrowUpRight,
  Quote,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Use Cases | BuildAPI - Built for Your Industry',
  description:
    'BuildAPI powers marketplaces, SaaS platforms, fintech startups, enterprises, e-commerce, and CMS applications.',
}

const useCases = [
  {
    title: 'For Marketplaces',
    desc: 'Seamless money movement between buyers and sellers. Handle escrow, payouts, and disputes with built-in APIs.',
    icon: ShoppingCart,
    href: '/signup',
  },
  {
    title: 'For SaaS Platforms',
    desc: 'Embed financial services into your software with minimal effort. Add payments, invoicing, and billing in days.',
    icon: GitBranch,
    href: '/signup',
  },
  {
    title: 'For Fintech Startups',
    desc: 'Build your own banking solutions with ease. Core banking, cards, and compliance APIs ready to integrate.',
    icon: Landmark,
    href: '/signup',
  },
  {
    title: 'For Enterprises',
    desc: 'Custom financial solutions to optimize operations at scale. Dedicated support and SLA guarantees.',
    icon: Building2,
    href: '/contact',
  },
  {
    title: 'For E-commerce',
    desc: 'Power online stores with inventory, orders, and customer APIs. Connect to Shopify, WooCommerce, and more.',
    icon: Store,
    href: '/integrations',
  },
  {
    title: 'For CMS & Content',
    desc: 'Manage content and publish across websites and apps. Headless CMS APIs with real-time sync.',
    icon: Layout,
    href: '/integrations',
  },
]

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Built for your industry
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Whether you run a marketplace, SaaS platform, fintech, or enterprise, BuildAPI provides the APIs you need to ship faster.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Start Building <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Use Case Cards */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((uc) => (
                <Link
                  key={uc.title}
                  href={uc.href}
                  className="group block rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all bg-white"
                >
                  <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                    <uc.icon className="w-6 h-6 text-slate-700 group-hover:text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{uc.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{uc.desc}</p>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1">
                    Learn more <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 px-6 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-12 h-12 text-blue-400 mx-auto mb-6 opacity-50" />
            <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
              &ldquo;BuildAPI cut our integration time from weeks to days. The documentation is clear, and the team is incredibly responsive.&rdquo;
            </blockquote>
            <footer>
              <cite className="not-italic font-semibold">Sarah Chen</cite>
              <p className="text-slate-400 text-sm mt-1">CTO, FinFlow</p>
            </footer>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Find your use case</h2>
            <p className="text-slate-500 mb-8">
              Get started with BuildAPI and build in days, not months.
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

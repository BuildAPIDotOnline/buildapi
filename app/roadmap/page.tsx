import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Roadmap | BuildAPI - What We\'re Building',
  description: 'BuildAPI product roadmap. See what we\'re building next and share your feedback.',
}

const phases = [
  {
    label: 'Now',
    color: 'bg-emerald-500',
    items: [
      'GraphQL API support',
      'Additional webhook events',
      'Usage dashboards and alerts',
      'Bulk operations API',
    ],
  },
  {
    label: 'Next',
    color: 'bg-blue-500',
    items: [
      'GraphQL subscriptions',
      'Custom webhook signatures',
      'Team workspaces',
      'SSO and SAML',
    ],
  },
  {
    label: 'Later',
    color: 'bg-slate-400',
    items: [
      'Multi-region deployment',
      'Self-hosted option',
      'White-label dashboard',
      'Advanced analytics',
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              What we&apos;re building next
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Our product roadmap is shaped by customer feedback. Vote on features and help us prioritize.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Share feedback
              </Button>
            </Link>
          </div>
        </section>

        {/* Roadmap Phases */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {phases.map((phase) => (
                <div key={phase.label} className="rounded-2xl border border-slate-200 bg-white p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                    <h2 className="text-lg font-bold text-slate-900">{phase.label}</h2>
                  </div>
                  <ul className="space-y-4">
                    {phase.items.map((item) => (
                      <li key={item} className="text-slate-600 text-sm flex items-start gap-2">
                        <span className="text-slate-300 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-sm mt-8">
              Dates and priorities may change based on customer feedback and business needs.
            </p>
          </div>
        </section>

        {/* Feedback CTA */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Have a feature request?</h2>
            <p className="text-slate-500 mb-8">
              We read every piece of feedback. Share your ideas and help shape the product.
            </p>
            <Link href="/contact">
              <Button className="gap-2">
                Submit feedback <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Start building today</h2>
            <p className="text-slate-500 mb-8">
              Get access to our current features and be first to try new ones.
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

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Check, ArrowUpRight, Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const tiers = [
  {
    name: 'Starter',
    price: 49900,
    period: '/month',
    description: 'Perfect for side projects and early-stage startups.',
    features: [
      '10,000 API calls/month',
      '3 API keys',
      'Email support',
      'Basic documentation',
      '7-day free trial',
    ],
    cta: 'Start free trial',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Professional',
    price: 149900,
    period: '/month',
    description: 'For growing teams with production workloads.',
    features: [
      '100,000 API calls/month',
      'Unlimited API keys',
      'Priority support',
      'Advanced analytics',
      'Webhooks',
      'Audit logs',
    ],
    cta: 'Get started',
    href: '/signup',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    period: '',
    description: 'Custom solutions for large organizations.',
    features: [
      'Unlimited API calls',
      'Dedicated infrastructure',
      'SLA guarantee',
      'Custom integrations',
      '24/7 support',
      'Compliance assistance',
    ],
    cta: 'Contact sales',
    href: '/contact',
    popular: false,
  },
]

const faqs = [
  {
    q: 'Do you charge any undisclosed fees?',
    a: 'No. Our pricing is transparent. You pay the advertised rate plus any overage for API calls beyond your plan limit. No setup fees, no hidden charges.',
  },
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept major credit cards and Paystack for Nigerian customers. Enterprise customers can request invoicing.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. The Starter plan includes a 7-day free trial. No credit card required to start.',
  },
  {
    q: 'What happens if I exceed my API limit?',
    a: 'We notify you before you hit your limit. Overage is charged at a fair per-request rate. You can upgrade your plan at any time to avoid overage.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl border p-8 ${
                    tier.popular
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <p className="text-slate-600 text-sm mb-6">{tier.description}</p>
                  <div className="mb-6">
                    {tier.price !== null ? (
                      <>
                        <span className="text-3xl font-bold">₦{tier.price.toLocaleString()}</span>
                        <span className="text-slate-500">{tier.period}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">Custom</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.href}>
                    <Button
                      className={`w-full ${
                        tier.popular ? 'bg-primary hover:bg-primary/90' : 'bg-slate-900 hover:bg-slate-800'
                      } text-white`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="py-6 cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">{faq.q}</h3>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-4 text-slate-500 leading-relaxed"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Need custom */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Need a custom plan?</h2>
            <p className="text-slate-500 mb-8">
              Enterprise customers get volume discounts, dedicated support, and custom SLAs.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                Contact Sales <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

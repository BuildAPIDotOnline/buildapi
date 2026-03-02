import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import {
  Landmark,
  Users,
  ShoppingCart,
  Layout,
  BarChart3,
  CreditCard,
  ArrowUpRight,
  Plug,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Integrations | BuildAPI - Connect Your Tools',
  description:
    'Connect BuildAPI with banking providers, CRM platforms, payment gateways, and analytics. Custom integrations available.',
}

const categories = [
  {
    title: 'Banking Providers',
    desc: 'Seamless connections to core banking systems and payment networks.',
    icon: Landmark,
    integrations: ['Bank A', 'Payment Network', 'Core Banking', 'Settlement'],
  },
  {
    title: 'CRM Platforms',
    desc: 'Sync customer data and activity across your sales and support tools.',
    icon: Users,
    integrations: ['Salesforce', 'HubSpot', 'Zoho', 'Pipedrive'],
  },
  {
    title: 'Payment Gateways',
    desc: 'Accept payments and manage subscriptions with leading processors.',
    icon: CreditCard,
    integrations: ['Paystack', 'Stripe', 'PayPal', 'Flutterwave'],
  },
  {
    title: 'E-commerce',
    desc: 'Power online stores with inventory, orders, and customer APIs.',
    icon: ShoppingCart,
    integrations: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce'],
  },
  {
    title: 'CMS & Content',
    desc: 'Manage content and publish across websites and apps.',
    icon: Layout,
    integrations: ['WordPress', 'Contentful', 'Strapi', 'Sanity'],
  },
  {
    title: 'Analytics',
    desc: 'Track usage, performance, and business metrics in real time.',
    icon: BarChart3,
    integrations: ['Mixpanel', 'Amplitude', 'Segment', 'PostHog'],
  },
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Connect with the tools you already use
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              BuildAPI integrates with leading banking, CRM, payment, and analytics platforms. Extend with custom integrations when you need more.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Get Started <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <cat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{cat.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.integrations.map((name) => (
                      <span
                        key={name}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Integrations */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-slate-900 text-white p-12 md:p-16 text-center">
              <Plug className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a custom integration?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Our team can build custom connectors for your specific workflows. Enterprise customers get dedicated integration support.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Start integrating today</h2>
            <p className="text-slate-500 mb-8">
              Sign up and connect your first integration in minutes.
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

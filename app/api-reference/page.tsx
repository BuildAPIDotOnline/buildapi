import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { BookOpen, Key, CreditCard, FileText, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Reference | BuildAPI - Complete API Documentation',
  description: 'BuildAPI REST API reference. Authentication, keys, payments, and more.',
}

const endpoints = [
  {
    name: 'Authentication',
    desc: 'Bearer token authentication for all API requests.',
    icon: Key,
  },
  {
    name: 'API Keys',
    desc: 'Create, list, rotate, and revoke API keys.',
    icon: Key,
  },
  {
    name: 'Payments',
    desc: 'Create payments, verify transactions, and manage subscriptions.',
    icon: CreditCard,
  },
  {
    name: 'Audit Logs',
    desc: 'Query activity logs for compliance and debugging.',
    icon: FileText,
  },
]

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Complete API Reference
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              RESTful endpoints for Banking, CRM, E-commerce, and CMS. OpenAPI specs and SDKs available.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard/docs">
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                  View Full Docs <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Get API Key</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick start</h2>
            <div className="rounded-xl bg-slate-900 text-slate-100 p-6 font-mono text-sm overflow-x-auto">
              <pre>{`# Set your API key
export BUILDAPI_KEY="ak_live_..."

# Make a request
curl -X GET https://api.buildapi.com/v1/keys \\
  -H "Authorization: Bearer $BUILDAPI_KEY"`}</pre>
            </div>
          </div>
        </section>

        {/* Endpoint Overview */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Endpoint overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {endpoints.map((ep) => (
                <div
                  key={ep.name}
                  className="rounded-xl border border-slate-200 p-6 flex items-start gap-4"
                >
                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                    <ep.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{ep.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Link to Dashboard Docs */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Full documentation</h2>
            <p className="text-slate-500 mb-8">
              Log in to access the complete API documentation with code examples, OpenAPI specs, and SDK guides.
            </p>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                Log in to view docs
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to integrate?</h2>
            <p className="text-slate-500 mb-8">
              Sign up and get your API key in minutes.
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

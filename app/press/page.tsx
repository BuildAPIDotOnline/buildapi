import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { FileText, Download, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Press | BuildAPI - Press & Media',
  description: 'BuildAPI press kit, media assets, and press releases.',
}

const pressReleases = [
  {
    date: '2025-02-01',
    title: 'BuildAPI Launches Enterprise-Grade API Platform for Nigerian Developers',
    excerpt: 'New platform simplifies integration of Banking, CRM, and E-commerce APIs for startups and enterprises.',
  },
  {
    date: '2024-12-15',
    title: 'BuildAPI Reaches 1,000 Developer Milestone',
    excerpt: 'Growing adoption reflects demand for production-ready API infrastructure across Africa.',
  },
  {
    date: '2024-11-01',
    title: 'BuildAPI Achieves SOC 2 Type II Certification',
    excerpt: 'Security certification underscores commitment to enterprise-grade data protection.',
  },
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Press & media
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              For media inquiries, press kit, or interview requests, get in touch with our communications team.
            </p>
          </div>
        </section>

        {/* Press Kit */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Press kit</h2>
                  <p className="text-slate-600 mb-6">
                    Download our press kit including logos, brand guidelines, product screenshots, and company overview.
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download press kit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Press releases</h2>
            <div className="space-y-6">
              {pressReleases.map((pr) => (
                <article
                  key={pr.date + pr.title}
                  className="border-b border-slate-100 pb-6 last:border-0"
                >
                  <time className="text-sm text-slate-500">{pr.date}</time>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">{pr.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pr.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-slate-900">Media contact</h2>
            </div>
            <p className="text-slate-500 mb-8">
              For press inquiries, interview requests, or partnership opportunities, contact our communications team.
            </p>
            <Link href="/contact">
              <Button className="gap-2">
                Contact press team
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

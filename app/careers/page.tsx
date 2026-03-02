import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowUpRight, Heart, Zap, Coffee } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers | BuildAPI - Join Our Team',
  description: 'BuildAPI careers. Join our team and help power the next generation of APIs.',
}

const roles = [
  { title: 'Senior Backend Engineer', team: 'Engineering', location: 'Remote' },
  { title: 'Frontend Engineer', team: 'Engineering', location: 'Remote' },
  { title: 'Product Designer', team: 'Design', location: 'Remote' },
  { title: 'Developer Advocate', team: 'Developer Experience', location: 'Remote' },
]

const benefits = [
  { icon: Heart, title: 'Health & wellness', desc: 'Comprehensive health coverage for you and your family' },
  { icon: Zap, title: 'Flexible work', desc: 'Remote-first with flexible hours' },
  { icon: Coffee, title: 'Learning budget', desc: 'Annual stipend for courses, books, and conferences' },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Join our team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              We&apos;re building the API infrastructure that powers modern applications. Come help us shape the future.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                Get in touch
              </Button>
            </Link>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Open roles</h2>
            <div className="space-y-4">
              {roles.map((role) => (
                <Link
                  key={role.title}
                  href="/contact"
                  className="block rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {role.team} · <span className="flex items-center gap-1 inline"><MapPin className="w-3 h-3" />{role.location}</span>
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-12 text-center">Why join us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-200 p-8">
                  <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                    <b.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-600 text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Don&apos;t see a fit?</h2>
            <p className="text-slate-500 mb-8">
              We&apos;re always looking for talented people. Send us your resume and tell us what you&apos;d love to work on.
            </p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Get in touch <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

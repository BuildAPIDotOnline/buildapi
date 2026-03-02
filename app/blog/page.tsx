import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | BuildAPI',
  description: 'BuildAPI blog. Stay tuned for tutorials, product updates, and industry insights.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              BuildAPI Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Tutorials, product updates, and insights for developers building with our APIs. Coming soon.
            </p>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 md:p-16">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Stay tuned</h2>
              <p className="text-slate-500 mb-8">
                We&apos;re putting together articles on API best practices, integration guides, and product updates. Subscribe to be notified when we launch.
              </p>

              {/* Email signup */}
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button type="submit" className="shrink-0">
                  Notify me
                </Button>
              </form>

              <p className="text-sm text-slate-500">
                In the meantime, check out our{' '}
                <Link href="/changelog" className="text-primary hover:underline font-medium">
                  changelog
                </Link>
                {' '}for the latest product updates.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Start building</h2>
            <p className="text-slate-500 mb-8">
              Get your API key and start integrating today.
            </p>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

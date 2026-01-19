'use client'

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  { name: 'Isabella Rodriguez', title: 'CTO at FinTech Startup', quote: 'BuildAPI authentication APIs reduced our security implementation time from 3 months to 2 weeks. Enterprise-grade with developer simplicity.' },
  { name: 'Marcus Chen', title: 'Lead Backend Engineer', quote: 'The encryption APIs are incredible. Zero configuration needed, and the performance is outstanding. Exactly what we needed for HIPAA compliance.' },
  { name: 'Sarah Johnson', title: 'VP Engineering at EdTech Co', quote: 'BuildAPI\'s data management APIs saved us from building infrastructure. We scaled from 1K to 1M users without touching our backend architecture.' },
  { name: 'David Patel', title: 'Founder of SaaS Platform', quote: 'Rate limiting and quota management out of the box meant we could launch multi-tenant from day one. Phenomenal developer experience.' },
  { name: 'Emma Williams', title: 'Security Lead', quote: 'Military-grade encryption combined with compliance certifications? Perfect for financial services. BuildAPI handles the security complexity.' },
  { name: 'James Murphy', title: 'Startup CTO', quote: 'Going from zero to production APIs in minutes. BuildAPI is production-ready code that actually works. No more reinventing the wheel.' },
  { name: 'Lisa Wong', title: 'Full Stack Developer', quote: 'The documentation and SDKs are chef\'s kiss. Integration took 30 minutes. Been using for 8 months without a single issue.' },
  { name: 'Alex Rivera', title: 'DevOps Manager', quote: 'Built-in monitoring, logging, and alerting mean I sleep better at night. Infrastructure as code made simple.' },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 4) % testimonials.length)
  const prev = () => setCurrent((current - 4 + testimonials.length) % testimonials.length)

  const visible = [
    testimonials[(current) % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
    testimonials[(current + 3) % testimonials.length],
  ]

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Developers
            <br />
            Trusted by Enterprises.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            BuildAPI powers authentication, encryption, and core infrastructure for thousands of applications worldwide. From startups to Fortune 500 companies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visible.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-foreground text-sm leading-relaxed mb-4">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

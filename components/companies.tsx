'use client'

export default function Companies() {
  const companies = [
    'Ipsum',
    'Drift',
    'Logosium',
    'Ipsum',
    'Logosium',
    'Drift',
    'Logosium',
    'Ipsum',
    'Logosium',
  ]

  return (
    <section className="py-16 px-6 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-12">
          Love By Developers At
        </h3>
        
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {companies.map((company, i) => (
            <div
              key={i}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

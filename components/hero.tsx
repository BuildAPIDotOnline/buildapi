'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative px-6 py-20 md:py-25 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-red-500/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto">
 
        <h1 className="text-5xl md:text-8xl font-black   mb-8 text-balance">
          The unified API for Commerce, Finance, and <strong>Customer Intelligence</strong>.
        </h1>

        <div className='flex justify-between mt-10 '>
        <p className=" text-lg text-muted-foreground max-w-2xl  mb-12 text-pretty">
          BuildAPI provides production-ready authentication, encryption, and core infrastructure APIs. Scale from startups to enterprise with a single integration.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 text-base px-8">
              Start Building
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" className="h-12 text-base px-8 gap-2 bg-transparent">
            Talk to an expert
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
</div>

        <div className=" relative mx-auto w-full">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
            <div className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden aspect-video flex items-center justify-center">
               <p className="text-slate-400 italic">[ Your Dashboard Screenshot / Video Here ]</p>
            </div>
          </div>
        </div>
     
      </div>
    </section>
  )
}

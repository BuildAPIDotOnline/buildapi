'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, ArrowUpRight } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-lg">BuildAPI</span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1 text-sm hover:text-primary cursor-pointer">
            <span>Product</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-primary cursor-pointer">
            <span>Use Cases</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-primary cursor-pointer">
            <span>Developer</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-primary cursor-pointer">
            <span>Resources</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <span className="text-sm hover:text-primary cursor-pointer">Pricing</span>
          
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 text-sm">
              Start Building
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

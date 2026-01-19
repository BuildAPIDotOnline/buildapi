'use client'

import Image from 'next/image'

export default function FeaturesShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Screenshots Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Screenshot */}
          <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">Product Design Meeting</div>
          </div>

          {/* Center Screenshot - Main Focus */}
          <div className="relative h-96 md:h-auto md:row-span-2 md:col-span-1 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="pt-12 px-6 py-6">
              <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary"></div>
                <div className="w-8 h-8 rounded-full bg-secondary"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Right Screenshot */}
          <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">Team Collaboration</div>
          </div>

          {/* Bottom Left Screenshot */}
          <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          </div>

          {/* Bottom Right Screenshot */}
          <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

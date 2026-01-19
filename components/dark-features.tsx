'use client'

import { Monitor, Zap, Shield, Layers, Clock, Headphones, ArrowUpRight } from 'lucide-react'

const features = [
  {
    title: 'Clear Audio Conferencing',
    description: 'Experience the simplicity of building live experiences with tools designed.',
    icon: Monitor,
    gradient: 'from-blue-500/20 to-transparent',
  },
  {
    title: 'Reliability',
    description: 'Experience the simplicity of building live experiences with tools.',
    icon: Shield,
    gradient: 'from-purple-500/20 to-transparent',
  },
  {
    title: 'Complete Customization',
    description: 'Experience the simplicity of building live experiences with tools designed.',
    icon: Zap,
    gradient: 'from-pink-500/20 to-transparent',
  },
  {
    title: 'Multiple Grid system',
    description: 'Experience the simplicity of building live experiences with tools designed.',
    icon: Layers,
    gradient: 'from-cyan-500/20 to-transparent',
  },
  {
    title: '24/7 Support',
    description: 'Experience the simplicity of building live experiences with tools.',
    icon: Headphones,
    gradient: 'from-blue-500/20 to-transparent',
  },
]

export default function DarkFeatures() {
  return (
    <section className="w-full bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience the simplicity of building
            <br />
            live experience
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the simplicity of building live experiences with tools designed to make creation effortless and intuitive.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6 hover:border-gray-700 transition-all overflow-hidden"
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                    <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resources Card 1 */}
            <div className="rounded-xl bg-gradient-to-br from-cyan-400/10 to-blue-400/10 border border-gray-800 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1">Docs</h3>
                  <p className="text-gray-400 text-sm">
                    Our solution is built for maximum flexibility and speed, giving you.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <button className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors mt-4">
                View Docs File
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Resources Card 2 */}
            <div className="rounded-xl bg-gradient-to-br from-orange-400/10 to-pink-400/10 border border-gray-800 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1">Sample Project</h3>
                  <p className="text-gray-400 text-sm">
                    Our solution is built for maximum flexibility and speed, giving you.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <button className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors mt-4">
                Sample App
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

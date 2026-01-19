'use client'

import React from "react"
import { Video, Mic, MessageCircle, Lock, Shield, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

interface FeatureCard {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  image?: boolean
}

export default function FeaturesGrid() {
  const features: FeatureCard[] = [
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: 'Authentication & Authorization',
      description:
        'Multi-factor authentication, OAuth2, JWT tokens, and role-based access control. Secure user identity management out of the box.',
      image: true,
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'End-to-End Encryption',
      description:
        'Military-grade AES-256 encryption for data at rest and in transit. Protect sensitive information across all platforms.',
      image: true,
    },
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: 'Data Management',
      description:
        'Scalable database APIs with built-in backup, replication, and disaster recovery for mission-critical applications.',
      image: true,
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: 'Rate Limiting & Quotas',
      description:
        'Intelligent rate limiting, usage tracking, and quota management. Perfect for multi-tenant and API-driven platforms.',
      badge: 'Latest',
      image: true,
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-5xl font-bold mb-6 text-balance">
            Core APIs built for developers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comprehensive, production-ready APIs designed to accelerate development and reduce time-to-market across all application types.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Feature Header */}
              <div className="p-8">
                <div className="mb-4 inline-flex p-3 bg-blue-50 rounded-lg">
                  {feature.icon}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  {feature.badge && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

       

                
                  <Button
                    size="icon"
                    className="absolute bottom-4 left-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                
             
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

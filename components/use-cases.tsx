'use client'

import { BarChart3, DollarSign, ShoppingCart, Building2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const useCases = [
  {
    icon: <BarChart3 className="w-12 h-12 text-blue-600" />,
    title: 'CMS & Content Management',
    description: 'Role-based access for editors, publishers, and admins. Encryption for sensitive content and user data protection.',
    features: ['Multi-user authentication', 'Fine-grained permissions', 'Audit logging'],
    accentColor: 'from-blue-50 to-blue-100',
  },
  {
    icon: <DollarSign className="w-12 h-12 text-emerald-600" />,
    title: 'Banking & Finance',
    description: 'Regulatory-compliant authentication, encryption for PII and financial data, fraud detection integration.',
    features: ['PCI DSS compliance', 'End-to-end encryption', 'Transaction logging'],
    accentColor: 'from-emerald-50 to-emerald-100',
  },
  {
    icon: <ShoppingCart className="w-12 h-12 text-orange-600" />,
    title: 'Ecommerce',
    description: 'Secure checkout flows, customer authentication, payment data protection, and multi-tenant vendor management.',
    features: ['PCI compliance ready', 'Customer auth at scale', 'Payment data security'],
    accentColor: 'from-orange-50 to-orange-100',
  },
  {
    icon: <Building2 className="w-12 h-12 text-purple-600" />,
    title: 'SaaS & Enterprise',
    description: 'Multi-tenant architectures, SSO integration, usage tracking, and comprehensive audit trails for enterprises.',
    features: ['SSO/SAML support', 'Usage analytics', 'Enterprise audit logs'],
    accentColor: 'from-purple-50 to-purple-100',
  },
]

export default function UseCases() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-5xl font-bold mb-6 text-balance">
            Built for every industry
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            BuildAPI provides production-grade infrastructure APIs tailored for diverse application types and regulatory requirements.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Header with accent */}
              <div className={`h-2 bg-gradient-to-r ${useCase.accentColor}`} />

              {/* Content */}
              <div className="p-8">
                {/* Icon */}
                <div className="mb-6 inline-flex p-4 rounded-xl" style={{
                  backgroundColor: useCase.accentColor.split(' ')[1] === 'to-blue-100' ? '#dbeafe' : 
                                 useCase.accentColor.split(' ')[1] === 'to-emerald-100' ? '#d1fae5' :
                                 useCase.accentColor.split(' ')[1] === 'to-orange-100' ? '#fed7aa' :
                                 '#e9d5ff'
                }}>
                  {useCase.icon}
                </div>

                {/* Title and Description */}
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">
                  {useCase.description}
                </p>

                {/* Features List */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-foreground mb-3">Key Features:</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2 h-11">
                  Learn More
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

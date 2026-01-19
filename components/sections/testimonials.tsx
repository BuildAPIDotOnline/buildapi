'use client'

import Image from 'next/image'
import { Quote } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatarId: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc.',
    content: 'BuildAPI has completely transformed how we handle real-time data synchronization. The API is intuitive, well-documented, and incredibly reliable. We\'ve reduced our infrastructure costs by 40% while improving performance.',
    avatarId: 'sarah-chen'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Lead Developer',
    company: 'CloudSync',
    content: 'The authentication system is rock-solid and the WebSocket implementation is flawless. We migrated from our custom solution in under a week. The team loves how clean the codebase is.',
    avatarId: 'marcus-rodriguez'
  },
  {
    name: 'Emily Watson',
    role: 'Product Manager',
    company: 'DataViz Pro',
    content: 'We needed real-time collaboration features for our product. BuildAPI delivered everything we needed and more. The SDKs are fantastic, and the support team responds within hours.',
    avatarId: 'emily-watson'
  },
  {
    name: 'David Kim',
    role: 'Engineering Director',
    company: 'StreamLine',
    content: 'After evaluating multiple API providers, BuildAPI stood out for its flexibility and performance. We can handle millions of concurrent connections without breaking a sweat. Highly recommend!',
    avatarId: 'david-kim'
  },
  {
    name: 'Priya Patel',
    role: 'Founder',
    company: 'ConnectHub',
    content: 'As a startup, we needed infrastructure that could scale with us. BuildAPI has been perfect - we went from zero to handling 100K+ users without any major issues. The pricing is also very fair.',
    avatarId: 'priya-patel'
  },
  {
    name: 'James Thompson',
    role: 'Senior Engineer',
    company: 'GameSync Studios',
    content: 'We use BuildAPI for multiplayer game synchronization. The low latency and reliability are exactly what we needed. Our players have noticed the improvement in real-time interactions.',
    avatarId: 'james-thompson'
  },
  {
    name: 'Lisa Zhang',
    role: 'Backend Architect',
    company: 'FinTech Solutions',
    content: 'Security and compliance were critical for our financial application. BuildAPI meets all our requirements and the encryption is top-notch. It\'s given us peace of mind.',
    avatarId: 'lisa-zhang'
  },
  {
    name: 'Alex Morgan',
    role: 'DevOps Lead',
    company: 'ScaleUp Labs',
    content: 'The monitoring and analytics tools are excellent. We can track everything in real-time and the dashboard is intuitive. It\'s made our operations so much smoother.',
    avatarId: 'alex-morgan'
  }
]

// Generate avatar URL using UI Avatars service
const getAvatarUrl = (name: string, id: string) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128&bold=true&font-size=0.5`
}

const TestimonialCard = ({ name, role, company, content, avatarId }: Testimonial) => {
  const avatarUrl = getAvatarUrl(name, avatarId)
  
  return (
    <div className="w-[380px] h-auto shrink-0 bg-[#F3F4F6] p-5 rounded-lg flex flex-col justify-between gap-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex-1 flex flex-col">
        <Quote className="text-black mb-4 fill-black shrink-0" size={32} />
        <p className="text-[#6B7280] text-sm leading-relaxed break-words hyphens-auto">
          {content}
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0 pt-4 border-t border-gray-200">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
          <Image 
            src={avatarUrl}
            alt={name}
            width={48}
            height={48}
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-900 text-sm truncate">{name}</h4>
          <p className="text-slate-500 text-xs truncate">{role} at {company}</p>
        </div>
      </div>
    </div>
  )
}

export const Testimonials = () => {
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Trusted by developers<br />worldwide
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          See what developers are saying about BuildAPI
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1 - Moving Left */}
        <div className="flex gap-6 animate-scroll-left">
          {duplicatedTestimonials.map((testimonial, i) => (
            <TestimonialCard key={`left-${i}`} {...testimonial} />
          ))}
        </div>

        {/* Row 2 - Moving Right */}
        <div className="flex gap-6 animate-scroll-right">
          {duplicatedTestimonials.map((testimonial, i) => (
            <TestimonialCard key={`right-${i}`} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { Cpu, Smartphone, Zap, Globe } from 'lucide-react';

const platforms = [
  { name: 'Web SDK', icon: Cpu, color: 'bg-emerald-50/60', border: 'border-emerald-100', iconBg: 'bg-emerald-500', text: 'text-emerald-900', sub: 'text-emerald-700/70', desc: 'React, Next.js, and Vue support out of the box.' },
  { name: 'Mobile', icon: Smartphone, color: 'bg-orange-50/60', border: 'border-orange-100', iconBg: 'bg-orange-500', text: 'text-orange-900', sub: 'text-orange-700/70', desc: 'Native Swift and Kotlin SDKs for mobile excellence.' },
  { name: 'Serverless', icon: Zap, color: 'bg-amber-50/60', border: 'border-amber-100', iconBg: 'bg-amber-500', text: 'text-amber-900', sub: 'text-amber-700/70', desc: 'Edge-ready functions for Vercel and Cloudflare.' },
  { name: 'Global', icon: Globe, color: 'bg-blue-50/60', border: 'border-blue-100', iconBg: 'bg-blue-500', text: 'text-blue-900', sub: 'text-blue-700/70', desc: 'Connect to any region with automatic routing.' },
];

export const IntegrationGrid = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <h2 className="text-center text-3xl font-bold mb-16 tracking-tight">Any Platform. Any Device.</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((p) => (
          <div key={p.name} className={`p-10 rounded-[2.5rem] ${p.color} border ${p.border} group hover:scale-[1.02] transition duration-300`}>
            <div className={`w-14 h-14 ${p.iconBg} rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg`}>
              <p.icon size={28} />
            </div>
            <h3 className={`text-xl font-bold ${p.text} mb-2`}>{p.name}</h3>
            <p className={`${p.sub} text-sm leading-relaxed`}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
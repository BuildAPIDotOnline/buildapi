import Link from 'next/link'
import { MoveUpRight } from 'lucide-react';

export const CTAFinal = () => (
  <section className="relative py-32 overflow-hidden bg-white">
    {/* Subtle Grid Background */}
    <div className="absolute inset-0 z-0 opacity-[0.03]" 
         style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
    
    {/* Purple/Blue Radial Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-[600px] w-[800px] bg-indigo-100/40 blur-[120px] rounded-full" />

    <div className="container relative z-10 mx-auto px-6 text-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
        Any Platform. Any Device.<br />Done In Minutes.
      </h2>
      <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
        Our solution is built for maximum flexibility and speed, giving you the freedom to work wherever you are and however you choose.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <Link href="/signup">
          <button className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Start Building <MoveUpRight size={18} />
          </button>
        </Link>
        <button className="flex items-center gap-2 font-semibold text-[#2563EB] hover:underline">
          Talk to an expert <MoveUpRight size={18} />
        </button>
      </div>
    </div>
  </section>
);
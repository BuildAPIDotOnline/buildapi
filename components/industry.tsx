import { ShoppingCart, GitBranch, Landmark, Building2 } from 'lucide-react';

const industries = [
  { title: "For Marketplaces", desc: "Seamless money movement between buyers and sellers", icon: ShoppingCart },
  { title: "For SaaS Platforms", desc: "Embed financial services into your software with minimal effort", icon: GitBranch },
  { title: "For Fintech Startups", desc: "Build your own banking solutions with ease", icon: Landmark },
  { title: "For Enterprises", desc: "Custom financial solutions to optimize operations at scale", icon: Building2 },
];

export const Industry = () => (
    <section className="relative py-24 px-6 bg-[#020817] text-white overflow-hidden">
        <div className='max-w-6xl mx-auto'>
    {/* Radial Background Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-full bg-[radial-gradient(circle_at_50%_-20%,#1e3a8a_0%,transparent_60%)] opacity-50" />
    
    <div className="container relative z-10 mx-auto">
      <span className="text-blue-500 text-xs font-semibold tracking-widest uppercase mb-4 block">Who is it for?</span>
      <h2 className="text-4xl font-semibold mb-4">Financial Solutions for Every Industry</h2>
      <p className="text-slate-400 max-w-2xl mb-16">Our platform empowers you to handle transactions, streamline operations, and integrate financial services seamlessly.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {industries.map((ind) => (
          <div key={ind.title} className="bg-white/5 border border-white/10 rounded-2xl p-10 hover:bg-white/10 transition">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-black mb-8">
              <ind.icon size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{ind.title}</h3>
            <p className="text-slate-400 leading-relaxed">{ind.desc}</p>
          </div>
        ))}
      </div>
            </div>
            </div>
  </section>
);
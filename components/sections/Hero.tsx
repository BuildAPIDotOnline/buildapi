import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 bg-blue-50/50 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 text-center">
        {/* Announcement Badge */}
        <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-6">
          v2.0 is now live
        </div>
        
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
          Power your product with <span className="text-blue-600">live interactions.</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
          The most powerful API for real-time data, communication, and synchronization. Built for developers who value speed and reliability.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 bg-blue-600 text-lg">
            Start Building
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">
            View Documentation
          </Button>
        </div>

        {/* Floating Mockup Component */}
        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
            <div className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden aspect-video flex items-center justify-center">
               <p className="text-slate-400 italic">[ Your Dashboard Screenshot / Video Here ]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
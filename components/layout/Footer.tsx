import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-slate-400 py-16 px-6">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2 lg:col-span-2">
          <h2 className="text-white text-xl font-bold mb-4">APILogo</h2>
          <p className="max-w-xs text-sm leading-relaxed">
            Building the infrastructure for the next generation of real-time applications.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition">Features</Link></li>
            <li><Link href="#" className="hover:text-white transition">API Reference</Link></li>
            <li><Link href="#" className="hover:text-white transition">SDKs</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition">About</Link></li>
            <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
            <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 APIService Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-white">Twitter</span>
          <span className="cursor-pointer hover:text-white">GitHub</span>
          <span className="cursor-pointer hover:text-white">Discord</span>
        </div>
      </div>
    </footer>
  );
}
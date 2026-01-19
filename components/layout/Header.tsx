import Link from "next/link";
import { Button } from "@/components/ui/button"; 

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            APILogo
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/products" className="hover:text-black">
              Products
            </Link>
            <Link href="/developers" className="hover:text-black">
              Developers
            </Link>
            <Link href="/pricing" className="hover:text-black">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600">
            Log in
          </Link>
          <Button className="rounded-full bg-blue-600 px-6 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

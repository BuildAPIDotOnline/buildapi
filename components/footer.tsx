'use client'

import { Facebook, Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Footer Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-lg">BuildAPI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Power your product with live interactions that keep users engaged.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition">Features</li>
              <li className="hover:text-white cursor-pointer transition">Pricing</li>
              <li className="hover:text-white cursor-pointer transition">Security</li>
              <li className="hover:text-white cursor-pointer transition">Roadmap</li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition">Documentation</li>
              <li className="hover:text-white cursor-pointer transition">API Reference</li>
              <li className="hover:text-white cursor-pointer transition">Blog</li>
              <li className="hover:text-white cursor-pointer transition">Contact</li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition">About</li>
              <li className="hover:text-white cursor-pointer transition">Blog</li>
              <li className="hover:text-white cursor-pointer transition">Careers</li>
              <li className="hover:text-white cursor-pointer transition">Press</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8 flex flex-col md:flex-row items-center justify-between">
          {/* Left */}
          <div className="text-gray-400 text-sm mb-6 md:mb-0">
            <p>&copy; 2024 BuildAPI. All rights reserved.</p>
          </div>

          {/* Right - Social Links */}
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

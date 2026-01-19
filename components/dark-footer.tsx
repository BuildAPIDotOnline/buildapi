'use client'

import { ArrowUpRight, Facebook, Instagram, Youtube } from 'lucide-react'

export default function DarkFooter() {
  return (
    <section className="w-full bg-black py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="group rounded-3xl bg-white p-8 hover:shadow-lg transition-all cursor-pointer overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-gray-500 text-sm mb-2">want to know more?</p>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-0">
                Learn How We Can Help
              </h3>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="group rounded-3xl bg-white p-8 hover:shadow-lg transition-all cursor-pointer overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-gray-500 text-sm mb-2">Ready to Elevate Your Business?</p>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-0">
                Let's Discuss Your Idea
              </h3>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-gray-800">
          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Live Video
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Voice Conference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Live Streaming
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                  Feature <span className="text-xs">▼</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Developers</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Developers Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Showcase
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-white font-semibold mb-4">Use Cases</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ed-tech
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Telehealth
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  HR Tech
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Fitness
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Social
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gaming
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Customers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contract
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-400 text-sm">All System Operation</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 text-xs mb-6 md:mb-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Term of service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Website term of use</a>
            <span>•</span>
            <span>© Website term of use</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Facebook className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Right side info */}
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-8 pt-12 border-t border-gray-800 mt-12">
          <div className="text-right">
            <p className="text-white font-semibold">hellow.fserr.com</p>
            <p className="text-gray-400 text-sm">+773 3343 234545</p>
            <p className="text-gray-400 text-xs mt-2">jalan Antrar​ise no 23 sutrahn 33445544</p>
          </div>
        </div>
      </div>
    </section>
  )
}

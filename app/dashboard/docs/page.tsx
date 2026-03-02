"use client";

import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Documentation</h1>
        <p className="text-slate-500 mt-2">API guides for Banking, CRM, and E-commerce.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <FileText className="mx-auto text-slate-300 mb-4" size={64} />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Documentation Coming Soon</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Our extensive API guides for Banking, CRM, and E-commerce integrations will be available here.
        </p>
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
        >
          Contact Support for help
        </Link>
      </div>
    </div>
  );
}

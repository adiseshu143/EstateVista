import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto space-y-4">
      <div className="w-16 h-16 bg-amber-50 text-[#c59b27] rounded-full flex items-center justify-center mx-auto shadow-sm">
        <Search className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-serif font-normal text-[#0b132b] tracking-tight">Page Not Found</h1>
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        The luxury residence or page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0b132b] text-white text-xs font-semibold rounded-lg hover:bg-[#1c2541] transition font-sans"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
        <Link
          href="/properties"
          className="flex items-center gap-2 px-6 py-2.5 bg-[#c59b27] text-white text-xs font-bold rounded-lg hover:bg-[#b38a1f] transition"
        >
          <span>Browse Properties</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

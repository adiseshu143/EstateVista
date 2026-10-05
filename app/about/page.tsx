'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Users, Target, Compass, Heart, ArrowRight } from 'lucide-react';
import { SEED_AGENTS } from '@/data/seed/agents';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero */}
      <div className="relative bg-[#0b132b] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block">
            ABOUT ESTATEVISTA
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal max-w-3xl mx-auto tracking-tight leading-tight">
            Building Better Lives Through Exceptional Real Estate
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal font-sans">
            At EstateVista, we believe that a home is more than just a place — it is the foundation for a brighter tomorrow.
          </p>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-sans font-bold text-[#0b132b]">10,000+</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Happy Clients</p>
          </div>
          <div>
            <p className="text-3xl font-sans font-bold text-[#0b132b]">500+</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Properties Listed</p>
          </div>
          <div>
            <p className="text-3xl font-sans font-bold text-[#0b132b]">10+</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Cities Served</p>
          </div>
          <div>
            <p className="text-3xl font-sans font-bold text-[#0b132b]">15+</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Years of Experience</p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block">
              OUR HERITAGE
            </span>
            <h2 className="text-3xl font-serif font-normal text-[#0b132b] tracking-tight">
              Redefining Luxury Living in India
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-sans">
              Founded with the singular mission of bringing transparency, architectural integrity, and client-first ethics to Indian real estate, EstateVista has grown into the country&apos;s leading boutique advisory for high-net-worth homebuyers and discerning families.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed font-sans">
              We curate only verified properties with clear titles, superior construction standards, and verified legal approvals across Hyderabad, Bangalore, Mumbai, Pune, and Chennai.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-serif font-normal text-[#0b132b] tracking-tight">
            Our Guiding Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-[#c59b27] rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-semibold text-lg text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              To make real estate discovery simple, transparent, and accessible for discerning buyers through technology and expert on-ground advisory.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-[#c59b27] rounded-xl flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-semibold text-lg text-slate-900">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              To be India&apos;s most trusted and customer-centric luxury real estate brand, setting new benchmarks in architectural quality.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-[#c59b27] rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-semibold text-lg text-slate-900">Our Values</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Integrity, absolute transparency, customer focus, and long-term relationships over short-term transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Advisors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block mb-1">
            EXPERT GUIDANCE
          </span>
          <h2 className="text-3xl font-serif font-normal text-[#0b132b] tracking-tight">
            Senior Portfolio Advisors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_AGENTS.map((agent) => (
            <div
              key={agent.uid}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-5 text-center space-y-3"
            >
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#c59b27]">
                <Image src={agent.avatarUrl || ''} alt={agent.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-sans font-semibold text-slate-900 text-sm">{agent.name}</h4>
                <p className="text-xs text-[#c59b27] font-semibold font-sans">{agent.title}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-sans">{agent.agencyName}</p>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 italic font-sans">&ldquo;{agent.bio}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

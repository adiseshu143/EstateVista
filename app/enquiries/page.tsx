'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/authContext';
import { fetchLeads } from '@/lib/firebase/firestore';
import { Lead } from '@/types/lead';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Building,
  ArrowRight,
  User,
  Phone,
  Mail,
  Tag,
} from 'lucide-react';

const STATUS_COLORS: { [key: string]: string } = {
  New: 'bg-blue-100 text-blue-800 border-blue-200',
  Contacted: 'bg-amber-100 text-amber-800 border-amber-200',
  Interested: 'bg-purple-100 text-purple-800 border-purple-200',
  'Visit Scheduled': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Closed: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function EnquiriesPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await fetchLeads({
          userId: user?.uid || user?.email,
        });
        setLeads(list);
      } catch (err) {
        console.error('Failed to load enquiries:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-[#0b132b] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
            MY ACTIVITY
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal flex items-center gap-3 tracking-tight">
            <MessageSquare className="w-8 h-8 text-[#c59b27]" />
            <span>Property Enquiries ({leads.length})</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl font-normal font-sans">
            Track your consultations, brochures, and agent follow-up communications.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 my-8 font-sans">
            <div className="w-16 h-16 bg-amber-50 text-[#c59b27] rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-sans font-semibold text-xl text-[#0b132b]">No Enquiries Submitted</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              When you contact an agent or request a brochure for a property, your message history will appear here.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] transition font-sans"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition font-sans"
              >
                <div className="flex gap-4 items-center">
                  {lead.propertyImage && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <Image src={lead.propertyImage} alt="Property" fill className="object-cover" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans font-semibold text-base text-slate-900">
                        {lead.propertyTitle || 'General Advisory Request'}
                      </h3>
                      <span
                        className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border ${
                          STATUS_COLORS[lead.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Submitted on {formatDate(lead.createdAt)} &bull; Assigned Advisor:{' '}
                      <strong className="text-slate-800">{lead.assignedAgentName || 'Assigned Specialist'}</strong>
                    </p>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic max-w-xl">
                      &ldquo;{lead.message}&rdquo;
                    </p>

                    {lead.notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        <strong>Advisor Update:</strong> {lead.notes}
                      </p>
                    )}
                  </div>
                </div>

                {lead.propertySlug && (
                  <Link
                    href={`/properties/${lead.propertySlug}`}
                    className="px-4 py-2 bg-slate-100 hover:bg-[#0b132b] hover:text-white text-slate-800 text-xs font-semibold rounded-lg transition shrink-0"
                  >
                    View Listing Details
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

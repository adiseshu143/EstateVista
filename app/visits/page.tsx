'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/authContext';
import { fetchVisits } from '@/lib/firebase/firestore';
import { Visit } from '@/types/visit';
import { formatDate } from '@/lib/utils';
import {
  CalendarCheck,
  Clock,
  MapPin,
  CheckCircle,
  Building,
  ArrowRight,
  User,
} from 'lucide-react';

const VISIT_STATUS_COLORS: { [key: string]: string } = {
  Requested: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rescheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-purple-100 text-purple-800 border-purple-200',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function VisitsPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await fetchVisits({
          userId: user?.uid || user?.email,
        });
        setVisits(list);
      } catch (err) {
        console.error('Failed to load visits:', err);
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
            MY SCHEDULE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal flex items-center gap-3 tracking-tight">
            <CalendarCheck className="w-8 h-8 text-[#c59b27]" />
            <span>Scheduled Site Visits ({visits.length})</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl font-normal font-sans">
            Review your upcoming and past private property tours and gate passes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 my-8 font-sans">
            <div className="w-16 h-16 bg-amber-50 text-[#c59b27] rounded-full flex items-center justify-center mx-auto">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <h3 className="font-sans font-semibold text-xl text-[#0b132b]">No Scheduled Visits</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Experience the craftsmanship in person. Open any property details page and click &quot;Schedule Visit&quot; to book your private viewing slot.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] transition font-sans"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition font-sans"
              >
                <div className="flex gap-4 items-center">
                  {v.propertyImage && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <Image src={v.propertyImage} alt="Property" fill className="object-cover" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans font-semibold text-base text-slate-900">
                        {v.propertyTitle}
                      </h3>
                      <span
                        className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border ${
                          VISIT_STATUS_COLORS[v.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <CalendarCheck className="w-3.5 h-3.5 text-[#c59b27]" />
                        {v.preferredDate} &bull; {v.preferredTime}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {v.propertyLocation}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Assigned Agent Advisor:{' '}
                      <strong className="text-slate-800">{v.assignedAgentName || 'Senior Specialist'}</strong>
                    </p>

                    {v.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <strong>Notes:</strong> {v.notes}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/properties/${v.propertySlug}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-[#0b132b] hover:text-white text-slate-800 text-xs font-semibold rounded-lg transition shrink-0"
                >
                  View Property Page
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

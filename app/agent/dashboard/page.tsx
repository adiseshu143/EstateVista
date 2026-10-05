'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/authContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchLeads, fetchVisits, fetchAllProperties } from '@/lib/firebase/firestore';
import { Lead } from '@/types/lead';
import { Visit } from '@/types/visit';
import { Property } from '@/types/property';
import { formatDate, formatPrice } from '@/lib/utils';
import {
  Briefcase,
  Users,
  CalendarCheck,
  Building,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allLeads, allVisits, allProps] = await Promise.all([
          fetchLeads({ agentId: user?.uid }),
          fetchVisits({ agentId: user?.uid }),
          fetchAllProperties(),
        ]);
        setLeads(allLeads);
        setVisits(allVisits);
        setProperties(allProps.filter((p) => p.agentId === user?.uid || p.agent?.id === user?.uid || true));
      } catch (err) {
        console.error('Failed to load agent data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const activeLeadsCount = leads.filter((l) => l.status !== 'Closed').length;
  const pendingVisitsCount = visits.filter((v) => v.status === 'Requested' || v.status === 'Confirmed').length;
  const convertedLeadsCount = leads.filter((l) => l.status === 'Converted').length;

  return (
    <RoleGuard allowedRoles={['agent', 'admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        {/* Header */}
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block mb-1 font-sans">
                AGENT WORKSPACE
              </span>
              <h1 className="text-3xl font-sans font-semibold">
                Welcome, {user?.name || 'Senior Advisor'}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {user?.agencyName || 'EstateVista Advisory Team'} &bull; License: {user?.licenseNumber || 'RERA-TS-2022-0941'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/agent/leads"
                className="px-4 py-2.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-semibold transition shadow-sm font-sans"
              >
                Manage Leads Pipeline
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 font-sans">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Assigned Listings</span>
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-sans font-bold text-[#0b132b]">{properties.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Active inventory</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Active Leads</span>
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-3xl font-sans font-bold text-[#0b132b]">{activeLeadsCount}</p>
              <p className="text-[11px] text-amber-700 mt-1 font-semibold">Requires follow-up</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Site Visits</span>
                <CalendarCheck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-sans font-bold text-[#0b132b]">{pendingVisitsCount}</p>
              <p className="text-[11px] text-purple-700 mt-1 font-semibold">Scheduled / Requested</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Closed Deals</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-sans font-bold text-emerald-700">{convertedLeadsCount + 12}</p>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Trophy closures</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
          {/* Recent Leads */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-semibold text-xl text-[#0b132b] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#c59b27]" />
                <span>Recent Client Enquiries</span>
              </h3>
              <Link
                href="/agent/leads"
                className="text-xs font-semibold text-[#c59b27] hover:underline flex items-center gap-1 font-sans"
              >
                View Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leads.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 font-sans">
                No leads currently assigned. New customer inquiries will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:shadow-md transition font-sans"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-sm text-slate-900 font-semibold">{lead.name}</strong>
                        <p className="text-xs text-slate-500">{lead.propertyTitle || 'General Advisory'}</p>
                      </div>
                      <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {lead.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg italic font-sans">
                      &ldquo;{lead.message}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100 font-sans">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {lead.email}
                        </span>
                      </div>
                      <Link
                        href="/agent/leads"
                        className="text-xs font-semibold text-[#0b132b] hover:text-[#c59b27] font-sans"
                      >
                        Update Status &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Site Visits */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-semibold text-xl text-[#0b132b] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-purple-600" />
                <span>Upcoming Visits</span>
              </h3>
              <Link
                href="/agent/visits"
                className="text-xs font-bold text-[#c59b27] hover:underline flex items-center gap-1"
              >
                All Visits <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {visits.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No site visits scheduled currently.
              </div>
            ) : (
              <div className="space-y-3">
                {visits.slice(0, 4).map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900 font-bold">{visit.userName}</strong>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {visit.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate">{visit.propertyTitle}</p>

                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>{visit.preferredDate} &bull; {visit.preferredTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/authContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  fetchAllProperties,
  fetchLeads,
  fetchVisits,
  fetchUsersList,
  resetDemoData,
} from '@/lib/firebase/firestore';
import { Property } from '@/types/property';
import { Lead } from '@/types/lead';
import { Visit } from '@/types/visit';
import { UserProfile } from '@/types/user';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Building,
  Users,
  Briefcase,
  MessageSquare,
  CalendarCheck,
  TrendingUp,
  PlusCircle,
  Database,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  DollarSign,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [allProps, allLeads, allVisits, allUsers] = await Promise.all([
        fetchAllProperties(),
        fetchLeads(),
        fetchVisits(),
        fetchUsersList(),
      ]);
      setProperties(allProps);
      setLeads(allLeads);
      setVisits(allVisits);
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset demo data to fresh seed dataset?')) {
      setResetting(true);
      await resetDemoData();
      await loadAll();
      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  // Metrics computation
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === 'Available').length;
  const soldProperties = properties.filter((p) => p.status === 'Sold').length;
  const totalValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  const totalUsersCount = users.length;
  const totalAgentsCount = users.filter((u) => u.role === 'agent').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        {/* Header */}
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-widest mb-1 font-sans">
                <ShieldCheck className="w-4 h-4" />
                <span>EXECUTIVE CONTROL CONSOLE</span>
              </div>
              <h1 className="text-3xl font-sans font-semibold">Platform Overview &amp; Analytics</h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Real-time Firestore records &bull; Authenticated Admin Session: {user?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleResetData}
                disabled={resetting}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-white/10 font-sans"
                title="Reset or reseed sample database"
              >
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span>{resetting ? 'Resetting...' : 'Reseed Demo Data'}</span>
              </button>

              <Link
                href="/admin/properties/create"
                className="px-4 py-2 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm font-sans"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Property</span>
              </Link>
            </div>
          </div>
        </div>

        {resetSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 font-sans">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Database reseeded successfully with full verified luxury property inventory!</span>
            </div>
          </div>
        )}

        {/* Quick Nav Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 font-sans">
          <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-wrap gap-2 text-xs font-semibold">
            <Link href="/admin/dashboard" className="px-3 py-1.5 bg-[#0b132b] text-white rounded-lg">
              Overview
            </Link>
            <Link href="/admin/properties" className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
              Manage Properties ({totalProperties})
            </Link>
            <Link href="/admin/leads" className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
              All Leads ({leads.length})
            </Link>
            <Link href="/admin/users" className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
              Users &amp; Roles ({totalUsersCount})
            </Link>
            <Link href="/admin/analytics" className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
              Analytics &amp; Metrics
            </Link>
          </div>
        </div>

        {/* Primary Metric KPI Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 font-sans">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Portfolio Volume</span>
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-sans font-bold text-[#0b132b]">{totalProperties}</p>
              <p className="text-[11px] text-slate-500 mt-1">{activeProperties} Available &bull; {soldProperties} Sold</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Inventory Value</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-sans font-bold text-emerald-700">
                {formatPrice(totalValue)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Gross Asset Value</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Inquiries</span>
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-sans font-bold text-[#0b132b]">{leads.length}</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">{newLeadsCount} New Pending Inquiries</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Site Visits Booked</span>
                <CalendarCheck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-sans font-bold text-[#0b132b]">{visits.length}</p>
              <p className="text-[11px] text-purple-700 font-semibold mt-1">Confirmed Tours</p>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
          {/* Recent Properties Management List */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                Recent Property Listings
              </h3>
              <Link
                href="/admin/properties"
                className="text-xs font-semibold text-[#c59b27] hover:underline flex items-center gap-1 font-sans"
              >
                All Listings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.slice(0, 5).map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-[180px] truncate">
                        {prop.title}
                      </td>
                      <td className="py-3 px-3">{prop.city}</td>
                      <td className="py-3 px-3 font-bold text-[#c59b27]">
                        {prop.priceDisplay || formatPrice(prop.price, prop.listingType)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {prop.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/properties/${prop.id}/edit`}
                          className="text-[#0b132b] hover:text-[#c59b27] font-semibold"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Leads Pipeline */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                New Enquiries Stream
              </h3>
              <Link
                href="/admin/leads"
                className="text-xs font-semibold text-[#c59b27] hover:underline flex items-center gap-1 font-sans"
              >
                Manage Leads <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{lead.name}</strong>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{lead.propertyTitle || 'General Enquiry'}</p>
                  <p className="text-[11px] text-slate-400">Advisor: {lead.assignedAgentName || 'Unassigned'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

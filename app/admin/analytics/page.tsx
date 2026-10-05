'use client';

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchAllProperties, fetchLeads, fetchVisits } from '@/lib/firebase/firestore';
import { Property } from '@/types/property';
import { Lead } from '@/types/lead';
import { Visit } from '@/types/visit';
import { formatPrice } from '@/lib/utils';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Building,
  Users,
  CalendarCheck,
  Globe2,
  DollarSign,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [props, lds, vsts] = await Promise.all([
          fetchAllProperties(),
          fetchLeads(),
          fetchVisits(),
        ]);
        setProperties(props);
        setLeads(lds);
        setVisits(vsts);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute breakdown metrics
  const cityCounts: { [city: string]: number } = {};
  properties.forEach((p) => {
    cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
  });

  const typeCounts: { [type: string]: number } = {};
  properties.forEach((p) => {
    typeCounts[p.propertyType] = (typeCounts[p.propertyType] || 0) + 1;
  });

  const totalPortfolioValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  const avgPrice = properties.length > 0 ? totalPortfolioValue / properties.length : 0;
  const leadConversionRate = leads.length > 0 ? ((leads.filter((l) => l.status === 'Converted').length / leads.length) * 100).toFixed(1) : '0';

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto space-y-2">
            <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
              REAL-TIME ANALYTICS
            </span>
            <h1 className="text-3xl font-sans font-semibold">Platform Performance &amp; Insights</h1>
            <p className="text-xs text-slate-300 font-sans">
              Live computed statistics from active Firestore collections.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 font-sans">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Total Portfolio Value</span>
              <p className="text-2xl font-sans font-bold text-[#0b132b] mt-1">{formatPrice(totalPortfolioValue)}</p>
              <p className="text-[11px] text-slate-500 mt-1">Across {properties.length} residences</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Average Asset Ticket</span>
              <p className="text-2xl font-sans font-bold text-[#c59b27] mt-1">{formatPrice(avgPrice)}</p>
              <p className="text-[11px] text-slate-500 mt-1">Per luxury residence</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Lead Conversion Rate</span>
              <p className="text-2xl font-sans font-bold text-emerald-700 mt-1">{leadConversionRate}%</p>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{leads.length} total captured leads</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Tour Velocity</span>
              <p className="text-2xl font-sans font-bold text-purple-700 mt-1">{visits.length} Tours</p>
              <p className="text-[11px] text-purple-600 mt-1 font-semibold">Active on-site viewings</p>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* City Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b] flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#c59b27]" />
                <span>Geographic Inventory Distribution</span>
              </h3>

              <div className="space-y-3 pt-2">
                {Object.entries(cityCounts).map(([city, count]) => {
                  const percentage = Math.round((count / properties.length) * 100);
                  return (
                    <div key={city} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{city}</span>
                        <span>{count} Listings ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0b132b] rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Property Type Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#c59b27]" />
                <span>Asset Class Composition</span>
              </h3>

              <div className="space-y-3 pt-2">
                {Object.entries(typeCounts).map(([type, count]) => {
                  const percentage = Math.round((count / properties.length) * 100);
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{type}</span>
                        <span>{count} Units ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#c59b27] rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

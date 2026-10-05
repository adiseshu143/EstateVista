'use client';

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchLeads, updateLeadStatus } from '@/lib/firebase/firestore';
import { Lead, LeadStatus } from '@/types/lead';
import { formatDate } from '@/lib/utils';
import { SEED_AGENTS } from '@/data/seed/agents';
import {
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Filter,
  UserCheck,
  Building,
} from 'lucide-react';

const STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Interested',
  'Visit Scheduled',
  'Converted',
  'Closed',
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const list = await fetchLeads();
      setLeads(list);
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const updated = await updateLeadStatus(leadId, newStatus);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    }
  };

  const handleAssignAgent = async (leadId: string, agentId: string) => {
    const agent = SEED_AGENTS.find((a) => a.uid === agentId);
    if (agent) {
      const updated = await updateLeadStatus(
        leadId,
        'Contacted',
        undefined,
        agent.uid,
        agent.name
      );
      if (updated) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      }
    }
  };

  const filtered = leads.filter((l) => {
    if (filterStatus === 'All') return true;
    return l.status === filterStatus;
  });

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
                ADMIN LEAD MANAGEMENT
              </span>
              <h1 className="text-3xl font-sans font-semibold">
                Customer Inquiries &amp; CRM ({leads.length})
              </h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Assign leads to specialized portfolio agents and monitor closure pipelines.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/10">
              <span className="text-xs font-semibold text-slate-300 ml-2">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white text-slate-900 px-3 py-1.5 rounded-md text-xs font-semibold outline-none"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Property of Interest</th>
                    <th className="py-3 px-4">Assigned Agent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Received Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {lead.name}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">{lead.phone}</p>
                          <p className="text-[11px] text-slate-400">{lead.email}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <p className="font-semibold text-slate-800 truncate">
                          {lead.propertyTitle || 'General Consultation'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate italic">
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.assignedAgentId || 'agent-1'}
                          onChange={(e) => handleAssignAgent(lead.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800 outline-none"
                        >
                          {SEED_AGENTS.map((ag) => (
                            <option key={ag.uid} value={ag.uid}>
                              {ag.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

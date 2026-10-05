'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchLeads, updateLeadStatus } from '@/lib/firebase/firestore';
import { Lead, LeadStatus } from '@/types/lead';
import { formatDate } from '@/lib/utils';
import {
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Filter,
  Save,
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

export default function AgentLeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>('New');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const list = await fetchLeads();
        setLeads(list);
      } catch (err) {
        console.error('Error loading leads:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    const updated = await updateLeadStatus(selectedLead.id, editStatus, editNotes);
    setSaving(false);

    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLead(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const filtered = leads.filter((l) => {
    if (filterStatus === 'All') return true;
    return l.status === filterStatus;
  });

  return (
    <RoleGuard allowedRoles={['agent', 'admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
                LEAD PIPELINE &amp; CRM
              </span>
              <h1 className="text-3xl font-sans font-semibold">Client Enquiries ({leads.length})</h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Manage follow-ups, consultation notes, and deal conversion stages.
              </p>
            </div>

            {/* Filter by status */}
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/10">
              <span className="text-xs font-semibold text-slate-300 ml-2">Status:</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Leads List Table / Cards */}
            <div className="lg:col-span-8 space-y-4">
              {filtered.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => openLeadModal(lead)}
                  className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition cursor-pointer ${
                    selectedLead?.id === lead.id ? 'border-[#c59b27] ring-1 ring-[#c59b27]' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {lead.enquiryType}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {lead.propertyTitle || 'General Advisory Enquiry'}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        lead.status === 'Converted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lead.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg my-3 italic">
                    &ldquo;{lead.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Phone className="w-3.5 h-3.5" /> {lead.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {lead.email}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Received {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action / Status Updater Panel */}
            <div className="lg:col-span-4 font-sans">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-4">
                <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                  {selectedLead ? 'Update Lead Status' : 'Select a Lead to Manage'}
                </h3>

                {selectedLead ? (
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    {saveSuccess && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Lead status updated successfully!</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] text-slate-400 uppercase block">Client Name</span>
                      <strong className="text-sm text-slate-900">{selectedLead.name}</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 uppercase block">Property Interest</span>
                      <p className="text-xs text-slate-700 font-semibold">
                        {selectedLead.propertyTitle || 'General Portfolio Consultation'}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                        Pipeline Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                        Advisor Follow-up Notes
                      </label>
                      <textarea
                        rows={4}
                        placeholder="e.g. Spoke with client regarding floor plans. Scheduled private Sunday viewing..."
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-2.5 bg-[#0b132b] hover:bg-[#1c2541] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>{saving ? 'Saving...' : 'Save Pipeline Changes'}</span>
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Click on any lead card in the left list to view contact details, log follow-up notes, and update client conversion status.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

'use client';

import React, { useState } from 'react';
import { submitInquiry } from '@/lib/firebase/inquiries';
import { useAuth } from '@/lib/auth/authContext';
import { GoogleLocationMap } from '@/components/map/GoogleLocationMap';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  Building,
} from 'lucide-react';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [subject, setSubject] = useState('Buying a Villa / Apartment');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: `[${subject}] ${message.trim()}`,
        userId: user?.uid,
        enquiryType: 'general',
        preferredContactMethod: 'phone',
        assignedAgentId: 'agent-1',
        assignedAgentName: 'Rajesh Sharma',
      });

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setSubmitted(true);
      setMessage('');
    } catch (err) {
      console.error('Failed to submit message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero */}
      <div className="relative bg-[#0b132b] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight leading-tight">
            We&apos;re Here to Help You Find Your Next Home
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal font-sans">
            Connect directly with our luxury property advisory team across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Interactive Location Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-sans font-semibold text-xl text-[#0b132b]">
                Headquarters &amp; Advisory Desk
              </h3>

              <div className="space-y-4 text-sm text-slate-600 font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#c59b27] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Office Address</strong>
                    <p className="text-xs text-slate-600 mt-0.5">
                      123 Business Park, Financial District, Gachibowli, Hyderabad, Telangana 500032
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#c59b27] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Phone Hotline</strong>
                    <a href="tel:+919876543210" className="text-xs text-slate-600 hover:text-[#c59b27] block mt-0.5">
                      +91 98765 43210 / +91 98765 43211
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#c59b27] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Email Inquiries</strong>
                    <a href="mailto:hello@estatevista.com" className="text-xs text-slate-600 hover:text-[#c59b27] block mt-0.5">
                      hello@estatevista.com / sales@estatevista.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">WhatsApp Concierge</strong>
                    <a
                      href="https://wa.me/919876543210?text=Hi,%20I%20would%20like%20to%20enquire%20about%20EstateVista%20properties."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 font-semibold hover:underline block mt-0.5"
                    >
                      Chat with us on WhatsApp &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#c59b27] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Advisory Hours</strong>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Monday &ndash; Saturday: 9:00 AM &ndash; 7:30 PM (IST)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Location Map for EstateVista HQ */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#0b132b] uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#c59b27]" />
                  Headquarters Map Location
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Gachibowli, Hyderabad</span>
              </div>
              <GoogleLocationMap
                latitude={17.4401}
                longitude={78.3489}
                title="EstateVista Financial District Hub"
                address="123 Business Park, Financial District, Gachibowli, Hyderabad"
                zoom={14}
                height="h-64"
              />
            </div>
          </div>

          {/* Right: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-sans font-semibold text-2xl text-[#0b132b]">
                Send Us a Message
              </h3>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="font-sans font-semibold text-xl text-slate-900">Message Received!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto font-sans">
                    Thank you, {name}. Our client relations team has received your enquiry and will respond within 2 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] font-sans"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                        I Am Interested In
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                      >
                        <option value="Buying a Villa / Apartment">Buying a Villa / Apartment</option>
                        <option value="Listing My Property for Sale">Listing My Property for Sale</option>
                        <option value="Luxury Rental Inquiry">Luxury Rental Inquiry</option>
                        <option value="Commercial Office Space">Commercial Office Space</option>
                        <option value="General Consultation">General Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Tell us about your preferred location, budget, or any specific requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#0b132b] hover:bg-[#1c2541] text-white font-semibold text-sm rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{submitting ? 'Submitting Message...' : 'Submit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

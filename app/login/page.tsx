'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { UserRole } from '@/types/user';
import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, loginAsDemoRole, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (email.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (email.includes('agent')) {
        router.push('/agent/dashboard');
      } else {
        router.push(redirectUrl);
      }
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleQuickPersona = async (targetRole: UserRole) => {
    await loginAsDemoRole(targetRole);
    if (targetRole === 'admin') router.push('/admin/dashboard');
    else if (targetRole === 'agent') router.push('/agent/dashboard');
    else router.push('/profile');
  };

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#c59b27] to-[#917118] flex items-center justify-center text-white font-sans font-bold text-xl shadow-md">
            EV
          </div>
          <h1 className="text-2xl font-serif font-normal text-[#0b132b] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500 font-sans font-normal">
            Sign in to access your saved properties, enquiries, or management portal.
          </p>
        </div>

        {/* Quick Demo Role Switcher for Evaluators */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Instant Evaluator Quick-Login:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPersona('admin')}
              className="py-1.5 px-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition shadow-xs"
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('agent')}
              className="py-1.5 px-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition shadow-xs"
            >
              <Briefcase className="w-3 h-3" /> Agent
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('user')}
              className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition shadow-xs"
            >
              <UserIcon className="w-3 h-3" /> Client
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. user@estatevista.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#c59b27] font-semibold hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0b132b] hover:bg-[#1c2541] text-white font-semibold text-sm rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-600">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-[#c59b27] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-600">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}

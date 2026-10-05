'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { UserRole } from '@/types/user';
import Link from 'next/link';
import { ShieldAlert, LogIn, Home } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-[#c59b27] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Verifying access permissions...</p>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-amber-50 text-[#c59b27] rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-200">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0b132b] mb-2">Authentication Required</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Please log in to your EstateVista account to access this section.
          </p>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-sm font-semibold hover:bg-[#1c2541] transition"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      )
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return (
      fallback || (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0b132b] mb-2">Access Restricted</h2>
          <p className="text-slate-600 mb-3 text-sm">
            You do not have the required permissions ({allowedRoles.join(' or ')}) to view this portal. Your current role is{' '}
            <span className="font-semibold uppercase text-[#c59b27] bg-amber-50 px-2 py-0.5 rounded text-xs">
              {role}
            </span>
            .
          </p>
          <p className="text-xs text-slate-500 mb-6">
            If you believe this is an error, please contact your EstateVista administrator.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-sm font-semibold hover:bg-[#1c2541] transition"
            >
              <Home className="w-4 h-4" /> Go to Homepage
            </Link>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

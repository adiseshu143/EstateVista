'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Building,
  ShieldCheck,
  Briefcase,
  PlusCircle,
  ChevronDown,
  CalendarCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, favorites, logout, loginAsDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setDemoSwitcherOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Buy', href: '/properties?listingType=Sale' },
    { name: 'Rent', href: '/properties?listingType=Rent' },
    { name: 'Properties', href: '/properties' },
    { name: 'Locations', href: '/locations' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/properties' && pathname === '/properties') return true;
    if (href.startsWith('/properties?') && pathname === '/properties') return false;
    return pathname === href;
  };

  const isHome = pathname === '/';

  return (
    <header
      className={`z-50 w-full ${
        isHome
          ? 'absolute top-0 left-0 right-0 bg-transparent text-white border-b border-transparent'
          : 'relative bg-[#0b132b] text-white border-b border-white/10'
      }`}
    >
      {/* Top micro banner for quick persona switcher & live status */}
      <div
        className={`text-xs py-1.5 px-4 ${
          isHome
            ? 'bg-transparent text-slate-200 border-b border-transparent'
            : 'bg-[#070d1e] text-slate-300 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide">
              EstateVista Live Portfolio &bull; Ultra-Luxury Residences
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoSwitcherOpen(!demoSwitcherOpen)}
                className="flex items-center gap-1.5 text-[11px] font-medium bg-white/10 hover:bg-white/15 px-2.5 py-0.5 rounded text-amber-300 border border-amber-400/30 transition"
                title="Switch persona for testing RBAC"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Persona: <strong className="uppercase">{role || 'Guest'}</strong></span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {demoSwitcherOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      loginAsDemoRole('admin');
                      setDemoSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 ${
                      role === 'admin' ? 'font-bold text-[#c59b27] bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Administrator</p>
                      <p className="text-[10px] text-slate-500">Full platform & property CRUD</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      loginAsDemoRole('agent');
                      setDemoSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 ${
                      role === 'agent' ? 'font-bold text-[#c59b27] bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Real Estate Agent</p>
                      <p className="text-[10px] text-slate-500">Assigned leads & visits</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      loginAsDemoRole('user');
                      setDemoSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 ${
                      role === 'user' ? 'font-bold text-[#c59b27] bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Buyer / Client</p>
                      <p className="text-[10px] text-slate-500">Saved favorites & enquiries</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setDemoSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout (Guest Mode)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c59b27] to-[#917118] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              EV
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center font-sans">
                Estate<span className="text-[#c59b27]">Vista</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-400 font-medium">
                Signature Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-[#c59b27] bg-white/10 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Favorites Icon */}
            <Link
              href="/favorites"
              className="relative p-2 text-slate-200 hover:text-[#c59b27] hover:bg-white/5 rounded-full transition"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#c59b27] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#0b132b]">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition text-sm"
                >
                  <span className="font-medium text-xs max-w-[120px] truncate">{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-[#c59b27] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {user.role}
                      </span>
                    </div>

                    {/* Role-specific Links */}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Console
                      </Link>
                    )}

                    {user.role === 'agent' && (
                      <Link
                        href="/agent/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        <Briefcase className="w-4 h-4" /> Agent Portal
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Heart className="w-4 h-4 text-slate-400" /> Favorite Properties ({favorites.length})
                    </Link>
                    <Link
                      href="/enquiries"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" /> My Enquiries
                    </Link>
                    <Link
                      href="/visits"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <CalendarCheck className="w-4 h-4 text-slate-400" /> Scheduled Visits
                    </Link>

                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => logout()}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 text-white rounded-lg transition border border-white/10"
                >
                  Register
                </Link>
              </div>
            )}

            {/* List Property CTA */}
            {role === 'admin' ? (
              <Link
                href="/admin/properties/create"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white font-medium text-sm rounded-lg shadow-sm transition hover:shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> List Property
              </Link>
            ) : (
              <Link
                href="/contact?type=list_property"
                className="px-4 py-2.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white font-medium text-sm rounded-lg shadow-sm transition hover:shadow-md"
              >
                List Property
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              href="/favorites"
              className="relative p-2 text-slate-200"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#c59b27] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b132b] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? 'text-[#c59b27] bg-white/10 font-bold'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 pt-3 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#c59b27] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="block px-3 py-2 text-sm font-semibold text-purple-400 hover:bg-white/5 rounded-lg"
                  >
                    Admin Console
                  </Link>
                )}
                {user.role === 'agent' && (
                  <Link
                    href="/agent/dashboard"
                    className="block px-3 py-2 text-sm font-semibold text-blue-400 hover:bg-white/5 rounded-lg"
                  >
                    Agent Portal
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg"
                >
                  My Profile
                </Link>
                <Link
                  href="/enquiries"
                  className="block px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg"
                >
                  My Enquiries
                </Link>
                <Link
                  href="/visits"
                  className="block px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg"
                >
                  Scheduled Visits
                </Link>

                <button
                  onClick={() => logout()}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  className="w-full text-center px-4 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center px-4 py-2.5 bg-[#c59b27] text-white rounded-lg font-medium text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

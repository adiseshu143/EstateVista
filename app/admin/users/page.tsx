'use client';

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchUsersList, updateUserRoleOrStatus } from '@/lib/firebase/firestore';
import { UserProfile, UserRole } from '@/types/user';
import { formatDate } from '@/lib/utils';
import {
  Users,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersList();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    const updated = await updateUserRoleOrStatus(uid, { role: newRole });
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.uid === uid ? updated : u)));
    }
  };

  const handleToggleActive = async (uid: string, currentStatus: boolean) => {
    const updated = await updateUserRoleOrStatus(uid, { active: !currentStatus });
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.uid === uid ? updated : u)));
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto space-y-2">
            <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
              ROLE-BASED ACCESS CONTROL
            </span>
            <h1 className="text-3xl font-sans font-semibold">User Directory &amp; RBAC ({users.length})</h1>
            <p className="text-xs text-slate-300 font-sans">
              Manage platform permissions, promote agents, and control account status.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Member Since</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center uppercase font-bold text-xs">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">{u.email}</td>

                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                          className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="user">User (Client)</option>
                          <option value="agent">Agent (Advisor)</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleActive(u.uid, u.active)}
                          className={`px-3 py-1 rounded text-xs font-bold transition ${
                            u.active
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.active ? 'Disable' : 'Enable'}
                        </button>
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

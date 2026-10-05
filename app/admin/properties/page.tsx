'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/authContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchAllProperties, deleteProperty, updateProperty } from '@/lib/firebase/firestore';
import { Property, PropertyStatus } from '@/types/property';
import { formatPrice } from '@/lib/utils';
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Eye,
  Star,
  CheckCircle2,
  Building,
  ArrowRight,
} from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProperties();
      setProperties(data);
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const ok = await deleteProperty(id);
      if (ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setActionSuccess(`Property "${title}" deleted.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  const handleToggleFeatured = async (property: Property) => {
    const updated = await updateProperty(property.id, { featured: !property.featured });
    if (updated) {
      setProperties((prev) => prev.map((p) => (p.id === property.id ? updated : p)));
    }
  };

  const handleStatusChange = async (property: Property, newStatus: PropertyStatus) => {
    const updated = await updateProperty(property.id, { status: newStatus });
    if (updated) {
      setProperties((prev) => prev.map((p) => (p.id === property.id ? updated : p)));
    }
  };

  const filtered = properties.filter((p) => {
    if (filterCity !== 'All' && p.city.toLowerCase() !== filterCity.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
                ADMIN INVENTORY
              </span>
              <h1 className="text-3xl font-sans font-semibold">
                Manage Property Listings ({properties.length})
              </h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Full CRUD control: publish, update pricing, feature on homepage, or archive.
              </p>
            </div>

            <Link
              href="/admin/properties/create"
              className="px-4 py-2.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-sm font-sans"
            >
              <PlusCircle className="w-4 h-4" /> Add New Property
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {actionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search properties by title or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="All">All Cities</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                            <Image
                              src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/properties/${prop.slug}`}
                              className="font-bold text-slate-900 hover:text-[#c59b27] transition line-clamp-1"
                            >
                              {prop.title}
                            </Link>
                            <p className="text-[11px] text-slate-400">{prop.location}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {prop.propertyType} &bull; {prop.listingType}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#c59b27]">
                        {prop.priceDisplay || formatPrice(prop.price, prop.listingType)}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={prop.status}
                          onChange={(e) => handleStatusChange(prop, e.target.value as PropertyStatus)}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Sold">Sold</option>
                          <option value="Rented">Rented</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(prop)}
                          className={`p-1 rounded-md transition ${
                            prop.featured ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${prop.slug}`}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
                            title="View Public Listing"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/properties/${prop.id}/edit`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit Listing"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(prop.id, prop.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

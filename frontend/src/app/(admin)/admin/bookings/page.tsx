"use client";

import React, { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { BookingTable } from "@/components/bookings/BookingTable";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AdminBookingsPage() {
  const { allBookings, isLoading, cancelBooking, refreshBookings } = useAdmin();
  const [filters, setFilters] = useState({
    status: "",
    hall_id: "",
    date_from: "",
    date_to: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refreshBookings(newFilters);
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Admin Notice: Are you sure you want to cancel this booking?")) {
      await cancelBooking(id);
    }
  };

  if (isLoading) return <Spinner size="xl" className="mt-20" />;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Manage Bookings</h1>
          <p className="text-gray-500">View and manage all reservations across the system.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <Badge variant="info">{allBookings.length} Total</Badge>
          <Badge variant="confirmed">{allBookings.filter(b => b.status === "confirmed").length} Active</Badge>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="date" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />
        </div>
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by hall name or title..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            // Filter client-side if needed, or implement search endpoint
          />
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <BookingTable bookings={allBookings} onCancel={handleCancel} isAdmin />
      </div>
    </div>
  );
}

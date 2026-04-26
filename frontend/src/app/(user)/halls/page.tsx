"use client";

import React, { useState, useMemo } from "react";
import { useHalls } from "@/hooks/useHalls";
import { useBookings } from "@/hooks/useBookings";
import { HallGrid } from "@/components/halls/HallGrid";
import { BookingModal } from "@/components/halls/BookingModal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Hall } from "@/types";
import { Search, SlidersHorizontal, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function HallsPage() {
  const { halls, isLoading } = useHalls();
  const { createBooking } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'none'>('none');
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

  const filteredHalls = useMemo(() => {
    let result = halls.filter(h => 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (minCapacity > 0) {
      result = result.filter(h => h.capacity >= minCapacity);
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price_per_hour - b.price_per_hour);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price_per_hour - a.price_per_hour);
    }

    return result;
  }, [halls, searchTerm, minCapacity, sortBy]);

  const handleBooking = async (data: any) => {
    await createBooking(data);
    alert("Booking successful!");
  };

  if (isLoading) return <Spinner size="xl" className="mt-20" />;

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-4">
        <h1 className="text-3xl font-black text-gray-900">Explore Beautiful Halls</h1>
        <p className="text-gray-500 max-w-2xl">Find the perfect space for your wedding, reception, or corporate event. Verified venues with exclusive pricing.</p>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name or location..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              value={minCapacity}
              onChange={(e) => setMinCapacity(parseInt(e.target.value))}
            >
              <option value="0">Any Capacity</option>
              <option value="100">100+ guests</option>
              <option value="500">500+ guests</option>
              <option value="1000">1000+ guests</option>
            </select>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="none">Sort by Price</option>
              <option value="price_asc">Lowest First</option>
              <option value="price_desc">Highest First</option>
            </select>
          </div>
        </div>
      </header>

      <HallGrid halls={filteredHalls} onBook={(hall) => setSelectedHall(hall)} />

      <BookingModal 
        hall={selectedHall} 
        isOpen={!!selectedHall} 
        onClose={() => setSelectedHall(null)}
        onSubmit={handleBooking}
      />
    </div>
  );
}

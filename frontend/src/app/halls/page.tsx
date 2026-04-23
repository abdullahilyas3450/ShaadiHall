"use client";

import { useState, useEffect } from "react";
import HallCard from "@/components/HallCard";
import { getHalls } from "@/lib/api";
import { Search, MapPin, SlidersHorizontal, Loader2, Landmark } from "lucide-react";

export default function HallsPage() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    event_type: "",
    min_capacity: "",
  });

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const data = await getHalls(currentFilters);
      setHalls(data);
    } catch (error) {
      console.error("Error fetching halls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    fetchHalls(updatedFilters);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Area */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
            Discover <span className="text-red-600">Perfect Venues</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium">Explore 50+ premium event halls across Lahore for your special occasion.</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 mb-12 border border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center ml-1">
                   <MapPin className="h-3 w-3 mr-1" /> Location
                 </label>
                 <select 
                   name="location"
                   value={filters.location}
                   onChange={handleFilterChange}
                   className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-gray-900 font-bold focus:ring-2 focus:ring-red-500 transition-all appearance-none"
                 >
                   <option value="">All Lahore</option>
                   <option value="Gulberg">Gulberg</option>
                   <option value="DHA">DHA</option>
                   <option value="Johar Town">Johar Town</option>
                   <option value="Model Town">Model Town</option>
                   <option value="Bahria Town">Bahria Town</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center ml-1">
                   <Landmark className="h-3 w-3 mr-1" /> Event Type
                 </label>
                 <select 
                   name="event_type"
                   value={filters.event_type}
                   onChange={handleFilterChange}
                   className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-gray-900 font-bold focus:ring-2 focus:ring-red-500 transition-all appearance-none"
                 >
                   <option value="">Any Event</option>
                   <option value="Wedding">Wedding</option>
                   <option value="Mehndi">Mehndi</option>
                   <option value="Walima">Walima</option>
                   <option value="Birthday">Birthday</option>
                   <option value="Corporate">Corporate</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center ml-1">
                   <SlidersHorizontal className="h-3 w-3 mr-1" /> Guests
                 </label>
                 <input 
                   type="number"
                   name="min_capacity"
                   value={filters.min_capacity}
                   onChange={handleFilterChange}
                   placeholder="Min Capacity"
                   className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-gray-900 font-bold focus:ring-2 focus:ring-red-500 transition-all"
                 />
              </div>

              <button 
                onClick={() => fetchHalls()}
                className="bg-red-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search Halls</span>
              </button>
           </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
             <p className="text-gray-400 font-bold text-xl tracking-tight">Accessing Hall Database...</p>
          </div>
        ) : halls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {halls.map((hall: any) => (
              <HallCard key={hall.id} hall={hall} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] shadow-sm border border-gray-100">
             <Landmark className="h-20 w-20 text-gray-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-gray-900 mb-2">No halls found</h3>
             <p className="text-gray-500 font-medium">Try adjusting your filters or search criteria.</p>
             <button 
               onClick={() => {
                 setFilters({ location: "", event_type: "", min_capacity: "" });
                 fetchHalls({ location: "", event_type: "", min_capacity: "" });
               }}
               className="mt-8 text-red-600 font-bold hover:underline"
             >
               Clear all filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

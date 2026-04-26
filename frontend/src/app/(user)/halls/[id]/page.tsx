"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getHallById } from "@/lib/api";
import { 
  Star, MapPin, Users, Utensils, Car, 
  ChevronLeft, ArrowRight, CheckCircle2, 
  Landmark, Info, ShieldCheck, Calendar
} from "lucide-react";
import Link from "next/link";

export default function HallDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hall, setHall] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHall();
    }
  }, [id]);

  const fetchHall = async () => {
    setLoading(true);
    try {
      const data = await getHallById(id as string);
      setHall(data);
    } catch (error) {
      console.error("Error fetching hall:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
           <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-gray-400 font-bold text-xl">Loading Venue Details...</p>
        </div>
      </div>
    );
  }

  if (!hall || hall.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <Landmark className="h-24 w-24 text-gray-200 mb-6" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">Venue Not Found</h1>
        <p className="text-gray-500 text-center max-w-md mb-10">The hall you are looking for doesn't exist or has been removed from our listings.</p>
        <Link href="/halls" className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all">
          Browse All Halls
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center text-gray-400 hover:text-red-600 transition-colors font-bold mb-10"
        >
          <ChevronLeft className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-10">
               <div className="flex flex-wrap items-center gap-4 mb-6">
                 {hall.event_types?.split(';').map((type: string, idx: number) => (
                   <span key={idx} className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                     {type}
                   </span>
                 ))}
                 <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-black text-yellow-700">{hall.rating} Rating</span>
                 </div>
               </div>
               
               <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
                 {hall.name}
               </h1>
               
               <div className="flex items-center text-xl text-gray-500 font-medium">
                  <MapPin className="h-6 w-6 text-red-500 mr-2" />
                  {hall.location}
               </div>
            </div>

            {/* Gallery Placeholder */}
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-[3rem] mb-16 overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-1000">
                   <Landmark className="h-48 w-48 text-gray-400" />
                </div>
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center shadow-lg border border-white">
                   <Info className="h-5 w-5 text-red-500 mr-2" />
                   <span className="text-gray-900 font-bold">Premium Verified Venue</span>
                </div>
            </div>

            {/* Description */}
            <div className="mb-16">
               <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight flex items-center">
                 About the Hall
                 <div className="ml-4 flex-grow h-[2px] bg-gray-100" />
               </h2>
               <p className="text-xl text-gray-600 leading-relaxed font-medium">
                 {hall.description || "Welcome to our premium venue. Located in the heart of Lahore, this hall offers state-of-the-art facilities for your most precious moments. With customizable layouts and dedicated support, we ensure your event is nothing short of legendary."}
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
               {[
                 { icon: Users, label: "Capacity", value: `${hall.capacity_min}-${hall.capacity_max} Pax` },
                 { icon: Utensils, label: "Catering", value: hall.catering === "Yes" ? "Included" : "Separate" },
                 { icon: Car, label: "Parking", value: hall.parking === "Yes" ? "Available" : "No" },
                 { icon: ShieldCheck, label: "Security", value: "24/7 Monitored" }
               ].map((feature, idx) => (
                 <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-red-200 transition-colors group">
                    <feature.icon className="h-8 w-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{feature.label}</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">{feature.value}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar / Booking Card */}
          <div className="relative">
            <div className="sticky top-40 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
               
               <div className="mb-8">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-2 leading-none">Price per day</p>
                  <p className="text-4xl font-black text-gray-900 leading-none">PKR {hall.price_per_day?.toLocaleString()}</p>
               </div>

               <div className="space-y-6 mb-10">
                  <div className="flex items-center space-x-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
                     <CheckCircle2 className="h-5 w-5" />
                     <span className="font-bold">Instant Booking Available</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm font-bold text-gray-500 border-b border-gray-50 pb-2">
                        <span>Min Guests</span>
                        <span className="text-gray-900">{hall.capacity_min}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-bold text-gray-500 border-b border-gray-50 pb-2">
                        <span>Max Guests</span>
                        <span className="text-gray-900">{hall.capacity_max}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-bold text-gray-500 border-b border-gray-50 pb-2">
                        <span>Contact</span>
                        <span className="text-gray-900">{hall.contact_phone}</span>
                     </div>
                  </div>
               </div>

               <button className="w-full bg-red-600 text-white py-6 rounded-3xl text-xl font-black shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all flex items-center justify-center group mb-6 active:scale-95">
                  Book via Chat
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
               </button>
               
               <p className="text-center text-gray-400 text-sm font-medium">No initial payment required for AI booking.</p>
               
               {/* Contact Box */}
               <div className="mt-10 pt-10 border-t border-gray-50">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-red-500" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Need a tour?</p>
                        <p className="text-gray-900 font-black">Schedule Visit</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

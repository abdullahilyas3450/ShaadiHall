"use client";

import { Star, MapPin, Users, Utensils, Car, Landmark } from "lucide-react";
import Link from "next/link";

interface Hall {
  id: number;
  name: string;
  location: string;
  capacity_max: number;
  price_per_day: number;
  rating: number;
  event_types: string;
  catering: string;
  parking: string;
  description: string;
}

interface HallCardProps {
  hall: Hall;
  onSelect?: (hall: Hall) => void;
  showSelectButton?: boolean;
}

const HallCard = ({ hall, onSelect, showSelectButton = false }: HallCardProps) => {
  const eventTypes = hall.event_types?.split(';') || [];

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
      {/* Visual Placeholder / Image Area */}
      <div className="relative h-48 bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
           <Landmark className="h-16 w-16 text-red-300" />
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm">
          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
          <span className="text-sm font-bold text-gray-700">{hall.rating}</span>
        </div>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {eventTypes.slice(0, 2).map((type, idx) => (
            <span key={idx} className="bg-red-600 text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-md shadow-lg">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">{hall.name}</h3>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin className="h-3 w-3 mr-1 text-red-400" />
            <span className="text-xs truncate">{hall.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="h-3 w-3" />
            <span className="text-[10px] font-medium">{hall.capacity_max} Pax</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Car className="h-3 w-3" />
            <span className="text-[10px] font-medium">{hall.parking === "Yes" ? "Parking" : "Limited"}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide leading-none mb-1">PKR / Day</p>
            <p className="text-sm font-black text-gray-900 leading-none">{hall.price_per_day?.toLocaleString()}</p>
          </div>
          
          <div className="flex space-x-2">
            {!showSelectButton ? (
              <Link 
                href={`/halls/${hall.id}`} 
                className="bg-gray-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-black transition-colors shadow-md"
              >
                Details
              </Link>
            ) : (
              <button 
                onClick={() => onSelect?.(hall)}
                className="bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors shadow-md animate-pulse"
              >
                Select This Hall
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallCard;

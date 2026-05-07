"use client";

import React from "react";
import Image from "next/image";
import { Users, MapPin, DollarSign } from "lucide-react";
import { Hall } from "@/types";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface HallCardProps {
  hall: Hall;
  onBook: (hall: Hall) => void;
}

export const HallCard = ({ hall, onBook }: HallCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="relative h-48 w-full group">
        <Image
          src={hall.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"}
          alt={hall.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-sm line-clamp-2">{hall.description}</p>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{hall.name}</h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span>{hall.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span>Capacity: {hall.capacity} guests</span>
          </div>
          <div className="flex items-center text-gray-900 font-semibold">
            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
            <span>{hall.price_per_hour}/hour</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onBook(hall)}
          className="w-full mt-auto"
        >
          Book Now
        </Button>
      </div>
    </motion.div>
  );
};

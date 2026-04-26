"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Clock, User } from "lucide-react";
import { formatCurrency, formatTime } from "@/lib/utils";

interface LiveBooking {
  id: string;
  title: string;
  hall_name: string;
  start_time: string;
  total_price: string;
  timestamp: number;
}

interface LiveFeedProps {
  bookings: LiveBooking[];
}

export const LiveFeed = ({ bookings }: LiveFeedProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Booking Feed
          </h3>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Real-time</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {bookings.map((booking) => (
            <motion.div
              key={booking.id + booking.timestamp}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-200 group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{booking.title}</p>
                    <p className="text-xs text-gray-500">{booking.hall_name}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-600">{formatCurrency(Number(booking.total_price))}</span>
              </div>
              <div className="flex items-center space-x-4 ml-11">
                <div className="flex items-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(booking.start_time)}
                </div>
              </div>
            </motion.div>
          ))}
          {bookings.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-10">
              <Clock className="h-10 w-10 text-gray-300 mb-2 animate-pulse" />
              <p className="text-sm text-gray-400">Waiting for incoming bookings...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

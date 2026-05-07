"use client";

import React from "react";
import { Booking } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface BookingTableProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
  isAdmin?: boolean;
}

export const BookingTable = ({ bookings, onCancel, isAdmin = false }: BookingTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 font-bold">Hall</th>
            <th className="px-6 py-4 font-bold">Event</th>
            <th className="px-6 py-4 font-bold">Date</th>
            <th className="px-6 py-4 font-bold">Time</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Price</th>
            <th className="px-6 py-4 font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">
                {booking.hall?.name || "Shaadi Hall"}
              </td>
              <td className="px-6 py-4">{booking.title}</td>
              <td className="px-6 py-4">{formatDate(booking.start_time)}</td>
              <td className="px-6 py-4">
                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
              </td>
              <td className="px-6 py-4">
                <Badge variant={booking.status as any}>
                  {booking.status.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">
                {formatCurrency(Number(booking.total_price))}
              </td>
              <td className="px-6 py-4">
                {booking.status === 'confirmed' && (
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => onCancel(booking.id)}
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

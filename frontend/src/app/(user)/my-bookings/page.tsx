"use client";

import React from "react";
import { useBookings } from "@/hooks/useBookings";
import { BookingTable } from "@/components/bookings/BookingTable";
import { Spinner } from "@/components/ui/Spinner";
import { Calendar, PackageOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MyBookingsPage() {
  const { bookings, isLoading, cancelBooking } = useBookings();

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        alert("Booking cancelled successfully.");
      } catch (err: any) {
        alert(err);
      }
    }
  };

  if (isLoading) return <Spinner size="xl" className="mt-20" />;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Bookings</h1>
          <p className="text-gray-500">Manage your upcoming and past event reservations.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-bold text-gray-700">{bookings.filter(b => b.status === 'confirmed').length} Upcoming Events</span>
        </div>
      </header>

      {bookings.length > 0 ? (
        <BookingTable bookings={bookings} onCancel={handleCancel} />
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-200 text-center flex flex-col items-center">
          <div className="bg-blue-50 p-6 rounded-full mb-6">
            <PackageOpen className="h-12 w-12 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 max-w-sm mb-8">You haven't made any reservations. Explore our beautiful venues to find the perfect one for your event.</p>
          <Link href="/halls">
            <Button size="lg" className="px-10">Browse Venues</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

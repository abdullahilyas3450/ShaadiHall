"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Booking, BookingCreate } from "@/types";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapped in useCallback so it can be safely listed as a useEffect dependency
  const fetchMyBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/bookings/me");
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBooking = async (data: BookingCreate) => {
    try {
      const response = await api.post("/bookings/", data);
      // Functional updater — avoids stale closure over `bookings`
      setBookings((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || "Booking failed";
      throw new Error(message);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      // Functional updater — avoids stale closure over `bookings`
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
      );
    } catch (err: any) {
      const message = err.response?.data?.detail || "Cancellation failed";
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]); // fetchMyBookings is stable (useCallback with [])

  return { bookings, isLoading, error, createBooking, cancelBooking, refreshBookings: fetchMyBookings };
};

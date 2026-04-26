"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AdminStats, Booking, Hall } from "@/types";

export const useAdmin = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllBookings = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/bookings", { params });
      setAllBookings(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await api.patch(`/admin/bookings/${id}/cancel`);
      setAllBookings(allBookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      console.error(err);
    }
  };

  const addHall = async (data: any) => {
    try {
      const response = await api.post("/halls/", data);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAllBookings();
  }, []);

  return { stats, allBookings, isLoading, cancelBooking, addHall, refreshStats: fetchStats, refreshBookings: fetchAllBookings };
};

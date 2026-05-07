"use client";

import { useState, useEffect, useCallback } from "react";

export const useAdminSocket = () => {
  const [liveBookings, setLiveBookings] = useState<any[]>([]);

  const connect = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "") || "localhost:8000";
    const ws = new WebSocket(`${protocol}//${host}/ws/admin/bookings?token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_BOOKING") {
        setLiveBookings((prev) => [
          { ...data.booking, timestamp: Date.now() },
          ...prev.slice(0, 19), // Keep last 20
        ]);
      }
    };

    ws.onclose = () => {
      // Reconnet after 3 seconds
      setTimeout(connect, 3000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws?.close();
    };
  }, [connect]);

  return { liveBookings };
};

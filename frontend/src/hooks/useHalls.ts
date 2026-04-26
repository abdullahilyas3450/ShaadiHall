"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Hall } from "@/types";

export const useHalls = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHalls = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/halls");
      setHalls(response.data);
    } catch (err: any) {
      setError("Failed to fetch halls");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  return { halls, isLoading, error, refreshHalls: fetchHalls };
};

export const useHallDetails = (id: string) => {
  const [hall, setHall] = useState<Hall | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchHall = async () => {
      try {
        const response = await api.get(`/halls/${id}`);
        setHall(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHall();
  }, [id]);

  return { hall, isLoading };
};

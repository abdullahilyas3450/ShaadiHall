"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/store/authStore";
import { Spinner } from "@/components/ui/Spinner";
import { decodeToken } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const token = localStorage.getItem("access_token");
        if (token) {
          const payload = decodeToken(token);
          if (payload?.role === 'admin') {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/halls");
          }
        }
      } else {
        router.replace("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Initializing ShaadiHall...</p>
      </div>
    </div>
  );
}

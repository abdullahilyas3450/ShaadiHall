"use client";

import React from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { StatsCard } from "@/components/admin/StatsCard";
import { LiveFeed } from "@/components/admin/LiveFeed";
import { Spinner } from "@/components/ui/Spinner";
import { Calendar, DollarSign, Users, Building2, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { stats, isLoading } = useAdmin();
  const { liveBookings } = useAdminSocket();

  if (isLoading || !stats) return <Spinner size="xl" className="mt-20" />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value={stats.total_bookings}
          icon={Calendar}
          color="blue"
          trend={{ value: 12, isUp: true }}
          description="Total lifetime bookings"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(Number(stats.total_revenue))}
          icon={DollarSign}
          color="green"
          trend={{ value: 8, isUp: true }}
          description="Confirmed payments"
        />
        <StatsCard
          title="Today's Bookings"
          value={stats.bookings_today}
          icon={TrendingUp}
          color="yellow"
          description="Updated 1m ago"
        />
        <StatsCard
          title="Active Halls"
          value={stats.active_halls}
          icon={Building2}
          color="red"
          description="Available for booking"
        />
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* We could add a chart here if library was available */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/[0.08] transition-colors" />
            <div className="relative text-center space-y-4">
              <div className="bg-blue-600 text-white p-4 rounded-2xl inline-block shadow-xl shadow-blue-200">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Full reporting and visual analytics are under maintenance. Your data is still being tracked safely.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[600px]">
          <LiveFeed bookings={liveBookings} />
        </div>
      </div>
    </div>
  );
}

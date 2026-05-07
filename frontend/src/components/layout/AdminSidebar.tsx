"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Search, Settings, Users, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Hall Management', href: '/admin/halls', icon: Search },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
              pathname === item.href
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 mr-3 transition-colors",
              pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-blue-600"
            )} />
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-50">
        <Link 
          href="/halls" 
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all"
        >
          <ArrowLeft className="h-5 w-5 mr-3" />
          User View
        </Link>
      </div>
    </aside>
  );
};

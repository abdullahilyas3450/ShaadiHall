"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard, Calendar, Search, MessageSquare } from "lucide-react";
import { useAuthContext } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Halls', href: '/admin/halls', icon: Search },
      ]
    : [
        { name: 'Browse Halls', href: '/halls', icon: Search },
        { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
        { name: 'AI Chat', href: '/chat', icon: MessageSquare },
      ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShaadiHall
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user.full_name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-100" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => router.push("/login")}>Login</Button>
                <Button onClick={() => router.push("/register")}>Get Started</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

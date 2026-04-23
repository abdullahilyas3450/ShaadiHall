"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Landmark } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Landmark className={`h-8 w-8 ${scrolled ? "text-red-600" : "text-red-500"}`} />
            <span className={`text-2xl font-bold tracking-tight ${scrolled ? "text-gray-900" : "text-white drop-shadow-md"}`}>
              Shaadi<span className="text-red-600">Hall</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium transition-colors ${scrolled ? "text-gray-600 hover:text-red-600" : "text-white/90 hover:text-white"}`}>Home</Link>
            <Link href="/halls" className={`font-medium transition-colors ${scrolled ? "text-gray-600 hover:text-red-600" : "text-white/90 hover:text-white"}`}>Browse Halls</Link>
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg">
              Book Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? "text-gray-900" : "text-white"}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center border-t border-gray-100">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 border-b border-gray-50">Home</Link>
            <Link href="/halls" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 border-b border-gray-50">Browse Halls</Link>
            <div className="py-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold w-full max-w-xs">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

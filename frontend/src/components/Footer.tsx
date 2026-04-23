import Link from "next/link";
import { Landmark, Mail, Phone, MapPin, Heart, X, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Landmark className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold tracking-tight">
                Shaadi<span className="text-red-500">Hall</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Lahore's first AI-powered hall booking platform. Making your special day planning seamless and stress-free.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 border-b border-red-500 w-fit pb-1">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/halls" className="hover:text-red-500 transition-colors">Browse Halls</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 border-b border-red-500 w-fit pb-1">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-500" />
                <span>Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500" />
                <span>hello@shaadihall.com</span>
              </li>
            </ul>
          </div>

          {/* Social Presence */}
          <div>
            <h4 className="text-lg font-semibold mb-6 border-b border-red-500 w-fit pb-1">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-all transform hover:-translate-y-1">
                <Heart className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-all transform hover:-translate-y-1">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-all transform hover:-translate-y-1">
                <X className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ShaadiHall.com. All rights reserved. Designed for excellence in Lahore.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

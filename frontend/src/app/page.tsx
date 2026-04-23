import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Star, Calendar, MessageSquare, Bot, Landmark, MapPin } from "lucide-react";
import HallCard from "@/components/HallCard";
import { getHalls } from "@/lib/api";

export default async function Home() {
  // Fetch halls for the featured section (mock or API)
  let featuredHalls = [];
  try {
    featuredHalls = await getHalls();
    featuredHalls = featuredHalls.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch featured halls:", error);
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-gray-900 pt-16">
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center grayscale-[20%] opacity-60 scale-105 animate-pulse-slow" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-red-600/20 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <Sparkles className="h-5 w-5 text-red-400" />
               <span className="text-red-300 font-semibold text-sm tracking-wide uppercase">Lahore's First AI Booking Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Shaadi Hall</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              AI-powered search. Instant availability checks. Zero hassle corporate & wedding bookings. Discover and book in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <Link href="/halls" className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl text-xl font-bold flex items-center shadow-2xl shadow-red-600/30 transition-all transform hover:scale-105 active:scale-95 group">
                Browse Halls
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105">
                Chat With AI
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
           <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent rounded-full" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Partner Halls", value: "50+", icon: Landmark },
                { label: "Successful Bookings", value: "500+", icon: CheckCircle2 },
                { label: "Customer Rating", value: "4.9/5", icon: Star },
                { label: "AI Conversations", value: "10K+", icon: MessageSquare },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="inline-flex p-4 rounded-3xl bg-red-50 text-red-600 mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-500 font-medium tracking-wide">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Halls Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0 text-center md:text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Explore Featured Halls</h2>
              <p className="text-xl text-gray-500 font-medium max-w-xl">Handpicked premium event venues in Lahore, verified for quality and excellence.</p>
            </div>
            <Link href="/halls" className="text-red-600 font-bold flex items-center justify-center md:justify-start hover:text-red-700 transition-colors py-2 group">
              View all venues
              <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredHalls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {featuredHalls.map((hall: any) => (
                <HallCard key={hall.id} hall={hall} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <Landmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-medium text-lg">Halls are loading from our Lahore database...</p>
             </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -ml-48 -mb-48 opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-20 tracking-tight">Simple 3-Step Booking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                step: "01", 
                title: "Tell AI your Needs", 
                desc: "Chat with our smart assistant about your guest count, location, and date in English, Urdu, or Hinglish.",
                icon: MessageSquare
              },
              { 
                step: "02", 
                title: "Pick Your Venue", 
                desc: "Choose from 50+ premium halls filtered by your budget and availability instantly.",
                icon: Landmark
              },
              { 
                step: "03", 
                title: "Instant Confirmation", 
                desc: "Provide your details and get a confirmed booking ID immediately. It's that simple.",
                icon: CheckCircle2
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group text-center">
                <div className="flex items-center justify-center mb-10">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-gray-900 text-white flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl">
                        <item.icon className="h-10 w-10 text-red-500" />
                      </div>
                      <span className="absolute -top-4 -right-4 text-6xl font-black text-gray-100 -z-10 group-hover:text-red-50 group-hover:-translate-y-2 transition-all duration-500">{item.step}</span>
                   </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to start planning your event?</h2>
           <p className="text-xl md:text-2xl text-red-100 mb-12 max-w-2xl mx-auto font-medium">Join thousands of customers in Lahore who found their perfect venue effortlessly.</p>
           <button className="bg-white text-red-600 px-12 py-6 rounded-3xl text-2xl font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95 inline-flex items-center group">
              Open AI Chat
              <Bot className="ml-3 h-8 w-8 animate-pulse text-red-400 group-hover:text-red-600" />
           </button>
        </div>
      </section>
    </div>
  );
}

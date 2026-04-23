"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import { MessageSquare, X, Bot } from "lucide-react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] animate-in slide-in-from-bottom-8 duration-500 ease-out">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform ${
          isOpen ? "bg-gray-900 rotate-90 scale-90" : "bg-[#C8102E] hover:scale-110 active:scale-95 hover:shadow-red-600/40"
        }`}
      >
        {isOpen ? (
          <X className="h-8 w-8 text-white" />
        ) : (
          <div className="relative">
             <MessageSquare className="h-8 w-8 text-white" />
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-[#C8102E]"></span>
             </span>
          </div>
        )}
      </button>
      
      {!isOpen && (
        <div className="mr-20 bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 mb-[-12px] animate-in fade-in slide-in-from-right-4 duration-1000 delay-1000">
           <p className="text-gray-900 font-bold text-sm flex items-center">
             <Bot className="h-4 w-4 text-red-600 mr-2" />
             Assalamu Alaikum! 👋
           </p>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

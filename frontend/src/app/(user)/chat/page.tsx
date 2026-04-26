"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { Send, Bot, MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FullChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Sidebar / Info Panel could go here if needed, but let's stick to full width */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">AI Event Assistant</h1>
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-xs text-gray-500 font-medium">Online & Ready to Help</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-gray-400">
            <Info className="h-4 w-4" />
            <span className="text-xs font-medium">Powered by Anthropic Claude</span>
          </div>
        </div>

        {/* Message Container */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-8 space-y-2 scroll-smooth bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-6">
              <div className="bg-blue-100 p-6 rounded-full">
                <MessageSquare className="h-12 w-12 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">Start a Conversation</h3>
                <p className="text-gray-500">How can I help you plan your perfect event today? You can search for venues, check prices, or manage your bookings.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                {["Search for large halls", "When is Grand Ballroom free?", "Cancel my last booking", "Show me venues under $500"].map((hint) => (
                  <button 
                    key={hint}
                    onClick={() => setInput(hint)}
                    className="p-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-all text-left shadow-sm"
                  >
                    "{hint}"
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m} />
          ))}
          {isLoading && (
            <div className="flex justify-start items-center space-x-4 mb-4">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gray-600" />
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex space-x-1.5">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* Typing Area */}
        <div className="p-8 border-t bg-gray-50/30">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-x-0 -top-6 flex justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">AI Assistant listening...</span>
            </div>
            <div className="relative flex items-center shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-600 transition-all duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about hall bookings..."
                className="w-full bg-white border-none py-6 pl-8 pr-20 text-lg focus:outline-none placeholder:text-gray-400"
              />
              <div className="absolute right-4 flex items-center">
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="h-12 w-12 rounded-2xl"
                  size="icon"
                >
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">Press Enter to send. I can help with hall searching, booking creation, and more.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import HallCard from "../HallCard";
import { sendMessage } from "@/lib/api";
import { X, Bot, Sparkles, RefreshCcw } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  halls?: any[];
}

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let savedSession = localStorage.getItem("shaadihall_session");
    if (!savedSession) {
      savedSession = uuidv4();
      localStorage.setItem("shaadihall_session", savedSession);
    }
    setSessionId(savedSession);

    setMessages([
      {
        text: "Assalamu Alaikum! 👋 Main ShaadiHall ka AI assistant hoon. Aapko apne event ke liye perfect hall dhundhne mein madad karunga. Kya aap hall book karna chahte hain?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = async (text: string, overrideHalls?: any) => {
    // Add user message to UI
    const userMsg: Message = { text, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendMessage(text, sessionId);
      const botMsg: Message = {
        text: response.response,
        sender: "bot",
        timestamp: new Date(),
        halls: response.halls || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
       console.error("Chat error:", error);
       setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble connecting to my brain. Please ensure the backend server is running on port 8000!",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectHall = (hall: any) => {
    handleSendMessage(`I would like to book ${hall.name} (Hall ID: ${hall.id})`);
  };

  const resetChat = () => {
    const newSession = uuidv4();
    localStorage.setItem("shaadihall_session", newSession);
    setSessionId(newSession);
    setMessages([
      {
        text: "Chat reset. How can I help you from scratch?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl h-full flex flex-col rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight leading-none">AI Assistant</h3>
            <p className="text-red-100 text-[10px] font-bold uppercase tracking-widest mt-1">Lahore Specialist</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={resetChat} className="p-2 hover:bg-white/10 rounded-xl transition-colors opacity-70" title="Reset Chat">
               <RefreshCcw className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-4">
            <ChatMessage text={msg.text} sender={msg.sender} />
            {msg.halls && msg.halls.length > 0 && (
              <div className="flex flex-col space-y-4 ml-10 animate-in slide-in-from-left-4 duration-500">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suggested Venues:</p>
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
                  {msg.halls.map((hall) => (
                    <div key={hall.id} className="min-w-[280px] snap-center">
                      <HallCard 
                        hall={hall} 
                        showSelectButton 
                        onSelect={handleSelectHall} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-400 p-2 animate-pulse">
            <Bot className="h-4 w-4" />
            <div className="flex space-x-1">
               <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
               <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100" />
               <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-white border-t border-gray-50">
        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        <div className="flex items-center justify-center mt-3 space-x-2 opacity-30">
           <Sparkles className="h-3 w-3 text-red-600" />
           <p className="text-[10px] font-black tracking-widest uppercase text-gray-900">Powered by ShaadiHall AI</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

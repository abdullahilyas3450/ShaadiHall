"use client";

import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  text: string;
  sender: "user" | "bot";
}

const ChatMessage = ({ text, sender }: ChatMessageProps) => {
  const isBot = sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} items-end space-x-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center mb-1 flex-shrink-0 border border-red-200">
          <Bot className="h-4 w-4 text-red-600" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] px-5 py-3 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
          isBot
            ? "bg-white text-gray-800 rounded-bl-none border border-gray-100"
            : "bg-red-600 text-white rounded-br-none shadow-red-200 shadow-lg font-bold"
        }`}
      >
        {text}
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center mb-1 flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser ? "ml-3 bg-blue-600" : "mr-3 bg-gray-200"
        )}>
          {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-gray-600" />}
        </div>
        <div className={cn(
          "relative px-4 py-3 rounded-2xl shadow-sm",
          isUser 
            ? "bg-blue-600 text-white rounded-tr-none" 
            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

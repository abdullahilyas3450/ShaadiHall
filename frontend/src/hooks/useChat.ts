"use client";

import { useState } from "react";
import api from "@/lib/api";
import { ChatMessage } from "@/types";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await api.post("/chat/", {
        message: content,
        conversation_history: messages.slice(-10), // Keep history manageable
      });
      
      const assistantMessage: ChatMessage = { 
        role: "assistant", 
        content: response.data.message 
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting right now. Please try again later." 
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};

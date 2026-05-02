"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { ChatMessage, ChatHall } from "@/types";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/chat/", {
        message: content,
        conversation_history: [],
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.message,
        halls: response.data.halls || undefined,
        booking: response.data.booking || undefined,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectHall = useCallback(
    async (hall: ChatHall) => {
      // Send a structured message telling the agent the user selected this hall
      const bookMsg = `I want to book "${hall.name}" (Hall ID: ${hall.id})`;
      await sendMessage(bookMsg);
    },
    [sendMessage]
  );

  return { messages, sendMessage, selectHall, isLoading };
};

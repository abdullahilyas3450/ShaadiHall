"use client";

import React from "react";
import { ChatMessage as ChatMessageType, ChatHall } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot, MapPin, Users, Banknote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectHall?: (hall: ChatHall) => void;
}

const ChatHallCard = ({
  hall,
  onSelect,
}: {
  hall: ChatHall;
  onSelect?: (hall: ChatHall) => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col min-w-[260px] max-w-[280px] snap-start"
    >
      <div
        className="h-36 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${
            hall.image_url ||
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white font-bold text-sm truncate">{hall.name}</h4>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center text-gray-500 text-xs gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
          <span className="truncate">{hall.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-xs gap-1.5">
          <Users className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
          <span>{hall.capacity} guests</span>
        </div>
        <div className="flex items-center text-gray-900 font-bold text-sm gap-1.5">
          <Banknote className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
          <span>PKR {Number(hall.price_per_day).toLocaleString()}/day</span>
        </div>

        {onSelect && (
          <Button
            onClick={() => onSelect(hall)}
            className="w-full mt-2 text-xs py-2"
            size="sm"
          >
            Book Now
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export const ChatMessage = ({ message, onSelectHall }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex flex-col w-full mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "items-end" : "items-start"
      )}
    >
      {/* Text bubble */}
      <div
        className={cn(
          "flex max-w-[85%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-sm",
            isUser ? "ml-3 bg-blue-600" : "mr-3 bg-gray-200"
          )}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <div
          className={cn(
            "relative px-5 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>

      {/* Hall cards carousel — only when halls are present */}
      {!isUser && message.halls && message.halls.length > 0 && (
        <div className="mt-3 w-full">
          <div className="flex gap-3 overflow-x-auto pb-3 pl-12 pr-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {message.halls.map((hall) => (
              <ChatHallCard
                key={hall.id}
                hall={hall}
                onSelect={onSelectHall}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking confirmation card */}
      {!isUser && message.booking && message.booking.status === "confirmed" && (
        <div className="mt-3 ml-12 bg-green-50 border border-green-200 rounded-2xl p-4 max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-bold text-green-800 text-sm">
              Booking Confirmed!
            </span>
          </div>
          <p className="text-xs text-green-700">
            Booking ID:{" "}
            <code className="bg-green-100 px-1.5 py-0.5 rounded font-mono">
              {message.booking.booking_id}
            </code>
          </p>
        </div>
      )}
    </div>
  );
};

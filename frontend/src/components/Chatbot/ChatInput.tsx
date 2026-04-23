"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center group">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here in English or Urdu..."
        disabled={disabled}
        className="w-full bg-white border border-gray-100 rounded-[2rem] pl-6 pr-14 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-inner outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={`absolute right-2 p-3 bg-red-600 text-white rounded-full transition-all flex items-center justify-center shadow-lg transform active:scale-95 disabled:bg-gray-200 disabled:shadow-none ${
          input.trim() ? "scale-100 rotate-0" : "scale-75 -rotate-45"
        }`}
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;

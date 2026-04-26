"use client";

import React from "react";
import { Hall } from "@/types";
import { HallCard } from "./HallCard";
import { motion } from "framer-motion";

interface HallGridProps {
  halls: Hall[];
  onBook: (hall: Hall) => void;
}

export const HallGrid = ({ halls, onBook }: HallGridProps) => {
  if (halls.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No halls found matching your criteria.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {halls.map((hall, index) => (
        <motion.div
          key={hall.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <HallCard hall={hall} onBook={onBook} />
        </motion.div>
      ))}
    </motion.div>
  );
};

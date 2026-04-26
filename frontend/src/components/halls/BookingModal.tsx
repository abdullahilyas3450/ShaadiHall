"use client";

import React, { useState, useEffect } from "react";
import { Hall } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface BookingModalProps {
  hall: Hall | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const BookingModal = ({ hall, isOpen, onClose, onSubmit }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hall && formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end > start) {
        const hours = (end.getTime() - start.getTime()) / (1000 * 3600);
        setTotalPrice(hours * hall.price_per_hour);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [formData, hall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        hall_id: hall?.id,
        title: formData.title,
        start_time: new Date(formData.startTime).toISOString(),
        end_time: new Date(formData.endTime).toISOString(),
        notes: formData.notes,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${hall?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Event Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Wedding Reception"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="datetime-local"
            required
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
          <Input
            label="End Time"
            type="datetime-local"
            required
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Special requirements..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between border border-blue-100">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Estimated Price</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{hall?.price_per_hour}/hour</p>
            <p className="text-xs text-gray-500">Includes all taxes</p>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full py-4 text-lg" 
          isLoading={isLoading}
          disabled={totalPrice <= 0}
        >
          Confirm Booking
        </Button>
      </form>
    </Modal>
  );
};

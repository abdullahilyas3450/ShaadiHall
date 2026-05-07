"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AddHallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export const AddHallModal = ({ isOpen, onClose, onSubmit, initialData }: AddHallModalProps) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    capacity: 0,
    location: "",
    price_per_hour: 0,
    image_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Hall" : "Add New Hall"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Hall Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Grand Ballroom"
        />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the venue..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Capacity"
            type="number"
            required
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          />
          <Input
            label="Price per Hour"
            type="number"
            required
            value={formData.price_per_hour}
            onChange={(e) => setFormData({ ...formData, price_per_hour: parseFloat(e.target.value) })}
          />
        </div>
        <Input
          label="Location"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="New York, NY"
        />
        <Input
          label="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
        >
          {initialData ? "Save Changes" : "Create Hall"}
        </Button>
      </form>
    </Modal>
  );
};

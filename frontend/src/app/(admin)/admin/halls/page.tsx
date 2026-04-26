"use client";

import React, { useState } from "react";
import { useHalls } from "@/hooks/useHalls";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { AddHallModal } from "@/components/admin/AddHallModal";
import { Badge } from "@/components/ui/Badge";
import { Edit, Trash2, Plus, LayoutGrid, List } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import api from "@/lib/api";

export default function AdminHallsPage() {
  const { halls, isLoading, refreshHalls } = useHalls();
  const { addHall } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<any>(null);

  const handleDeactivate = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate this hall? It will no longer be bookable.")) {
      try {
        await api.delete(`/halls/${id}`);
        refreshHalls();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingHall) {
      await api.patch(`/halls/${editingHall.id}`, data);
    } else {
      await addHall(data);
    }
    refreshHalls();
  };

  if (isLoading) return <Spinner size="xl" className="mt-20" />;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Hall Management</h1>
          <p className="text-gray-500">Add, edit, or deactivate venues in your system.</p>
        </div>
        <Button onClick={() => { setEditingHall(null); setIsAddModalOpen(true); }} className="px-6 py-6 rounded-2xl shadow-lg shadow-blue-100">
          <Plus className="h-5 w-5 mr-2" />
          Add New Venue
        </Button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b">
            <tr>
              <th className="px-8 py-5 font-bold">Venue Name</th>
              <th className="px-8 py-5 font-bold">Location</th>
              <th className="px-8 py-5 font-bold">Capacity</th>
              <th className="px-8 py-5 font-bold">Price/hr</th>
              <th className="px-8 py-5 font-bold">Status</th>
              <th className="px-8 py-5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {halls.map((hall) => (
              <tr key={hall.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 mr-3 flex-shrink-0 relative overflow-hidden">
                      {hall.image_url ? (
                        <img src={hall.image_url} alt="" className="object-cover h-full w-full" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          <Plus className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-gray-900">{hall.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">{hall.location}</td>
                <td className="px-8 py-5 font-medium">{hall.capacity} guests</td>
                <td className="px-8 py-5 font-bold text-gray-900">{formatCurrency(hall.price_per_hour)}</td>
                <td className="px-8 py-5">
                  <Badge variant={hall.is_active ? "success" : "cancelled"}>
                    {hall.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => { setEditingHall(hall); setIsAddModalOpen(true); }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeactivate(hall.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddHallModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingHall}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { ClientCard } from "@/components/cards/ClientCard";
import {
  useClientProfiles,
  ClientWithProfile,
} from "@/hooks/useClientProfiles";

export default function ClientsPage() {
  const { data: clients, loading, error } = useClientProfiles();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Loading Clients...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Error loading clients
          </h1>
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Automation Clients
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients?.map((client: ClientWithProfile) => (
            <ClientCard
              key={client.userProfile._id}
              userProfile={client.userProfile}
              clientProfile={client.clientProfile}
            />
          ))}
        </div>

        {clients?.length === 0 && (
          <p className="text-gray-400 text-center py-12">No clients found</p>
        )}
      </div>
    </div>
  );
}

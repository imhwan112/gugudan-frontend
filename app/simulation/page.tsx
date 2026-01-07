"use client";

import React, { useState, Suspense } from "react";
import SimulationSidebar from "@/components/simulation/SimulationSidebar";
import SimulationRoom from "@/components/simulation/SimulationRoom";

export default function SimulationPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleNewChatStarted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Suspense fallback={<div className="h-screen bg-white dark:bg-neutral-950" />}>
      <div className="flex h-screen bg-white dark:bg-neutral-950 overflow-hidden">
        <SimulationSidebar 
          key={refreshKey}
          selectedChatId={selectedChatId} 
          onSelectChat={(id) => setSelectedChatId(id)} 
        />
        <main className="flex-1 relative flex flex-col h-full overflow-hidden border-l border-gray-100 dark:border-white/5">
          <SimulationRoom 
            initialChatId={selectedChatId} 
            onNewChatStarted={handleNewChatStarted}
          />
        </main>
      </div>
    </Suspense>
  );
}
"use client";

import { useCallback, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { ChatRoomView } from "@/components/chat/ChatRoomView";

/** * 이미지 구조에 따른 정확한 임포트 경로
 * components - simulation - components 내부의 파일들 
 */
import SimulationSidebar from "@/components/simulation//SimulationSidebar";
import SimulationRoom from "@/components/simulation/SimulationRoom";

const STORAGE_KEY = "selectedRoomId";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const isSimulation = searchParams.get("mode") === "simulation";

  // 1) 일반 채팅용 상태
  const [roomId, setRoomId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  // --- 추가된 시뮬레이션 전용 상태 (여기서 정의해야 에러가 안 납니다) ---
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // 2) 일반 채팅 로직
  const handleSelectRoom = useCallback((nextRoomId: string | null) => {
    setRoomId(nextRoomId);
    if (nextRoomId) localStorage.setItem(STORAGE_KEY, nextRoomId);
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleRoomCreated = useCallback((newRoomId: string) => {
    setRoomId(newRoomId);
    localStorage.setItem(STORAGE_KEY, newRoomId);
  }, []);

  // --- 시뮬레이션 모드 렌더링 ---
  if (isSimulation) {
    return (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Simulation...</div>}>
        <div className="flex h-screen bg-white dark:bg-neutral-950 overflow-hidden">
          <SimulationSidebar 
            key={refreshKey}
            selectedChatId={selectedSimId} 
            onSelectChat={(id: string | null) => setSelectedSimId(id)} 
          />
          <main className="flex-1 relative flex flex-col h-full overflow-hidden border-l border-gray-100 dark:border-white/5">
            <SimulationRoom 
              initialChatId={selectedSimId} 
              onNewChatStarted={() => setRefreshKey((prev: number) => prev + 1)}
            />
          </main>
        </div>
      </Suspense>
    );
  }

  // --- 일반 채팅 모드 렌더링 ---
  return (
    <div className="flex h-screen">
      <ChatRoomList selectedRoomId={roomId} onSelect={handleSelectRoom} />
      <ChatRoomView roomId={roomId} onRoomCreated={handleRoomCreated} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <ChatPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
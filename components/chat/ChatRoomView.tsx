"use client";

import {useEffect, useRef, useState} from "react";
import {ChatMessage} from "./ChatMessage";
import {Feedback} from "./Feedback";
import {
    ArrowsRightLeftIcon,
    ChatBubbleLeftEllipsisIcon,
    FaceSmileIcon,
    HeartIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    StopIcon,
    XMarkIcon,
    PaperClipIcon,
    DocumentIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Message = {
  message_id?: number;
  role: "USER" | "ASSISTANT";
  content: string;
  user_feedback?: "LIKE" | "DISLIKE" | null;
  file_urls?: string[];
};
type RoomStatus = "ACTIVE" | "LOCKED" | "ENDED" | "UNKNOWN";

interface Props {
  roomId: string | null;
  onRoomCreated: (roomId: string) => void;
}

interface FileItem {
  file: File;
  previewUrl: string | null;
  name: string;
}

interface ChatRequestPayload {
  room_id: string | null;
  message: string;
  file_urls?: string[];
}


export function ChatRoomView({ roomId, onRoomCreated }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetMessageId, setTargetMessageId] = useState<number | null>(null);
  const [feedbackScore, setFeedbackScore] = useState<"LIKE" | "DISLIKE" | null>(null);

  const MAX_FILES = 4;
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // 상담 종료 관련 status
  const [roomStatus, setRoomStatus] = useState<RoomStatus>("UNKNOWN");
  const isInputBlocked = roomStatus === "LOCKED" || roomStatus === "ENDED";
  const blockReason =
    roomStatus === "LOCKED"
      ? "무료 이용 한도를 초과하여 새 메시지 전송이 제한됩니다. (기록 열람은 가능)"
      : roomStatus === "ENDED"
      ? "상담이 종료되어 더 이상 메시지를 보낼 수 없습니다."
      : "";

  // 자동 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, [roomId]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length > MAX_FILES) {
      alert(`파일은 최대 ${MAX_FILES}개까지만 업로드할 수 있습니다.`);
      return;
    }

    files.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const newItem: FileItem = {
        file: file,
        name: file.name,
        previewUrl: null
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newItem.previewUrl = reader.result as string;
          setSelectedFiles((prev) => [...prev, newItem]);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedFiles((prev) => [...prev, newItem]);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 파일 제거 핸들러
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /** 채팅 내역 + 상태 로드 */
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setRoomStatus("UNKNOWN");
      return;
    }

  // 상담 상태에 대한 추가
  const fetchRoomStatus = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms/${roomId}/status`;
    console.log("fetchRoomStatus url:", url);

    try {
      const res = await fetch(url, { method: "GET", credentials: "include" });
      console.log("fetchRoomStatus status:", res.status);

      const text = await res.text();
      console.log("fetchRoomStatus body:", text);

      if (!res.ok) {
        setRoomStatus("UNKNOWN");
        return;
      }

      const data = text ? JSON.parse(text) : {};
      const s = String(data?.status ?? "").toUpperCase();

      if (s === "ACTIVE") setRoomStatus("ACTIVE");
      else if (s === "LOCKED") setRoomStatus("LOCKED");
      else if (s === "ENDED") setRoomStatus("ENDED");
      else setRoomStatus("UNKNOWN");
    } catch (e) {
      console.error("fetchRoomStatus error:", e);
      setRoomStatus("UNKNOWN");
    }
  };

  const fetchMessages = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms/${roomId}/messages`;

    try {
      const res = await fetch(url, { credentials: "include" });
      const text = await res.text();

      if (res.ok) {
        const data = JSON.parse(text);
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
    void fetchRoomStatus();
    void fetchMessages();
  }, [roomId]);

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  /** 메시지 전송 통합 로직 (텍스트를 인자로 받음) */
  const handleSendMessage = async (textToSend?: string) => {
    if (isInputBlocked) return; // ✅ LOCKED/ENDED이면 전송 자체 차단

    const finalContent = textToSend || input;
    if (!finalContent.trim() || loading) return;

    setLoading(true);
    abortControllerRef.current = new AbortController();

    const currentFiles = [...selectedFiles];
    setInput("");
    setSelectedFiles([]);

    try {
      let uploadedUrls: string[] = [];

      if (currentFiles.length > 0) {
        const uploadPromises = currentFiles.map(async (item) => {
          const formData = new FormData();
          formData.append("file", item.file);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/upload`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
        if (res.ok) {
            const data = await res.json();
            return data.file_url; 
          }
          return null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.filter((url): url is string => typeof url === "string" && url.length > 0);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "USER",
          content: finalContent,
          file_urls: uploadedUrls,
        },
        { role: "ASSISTANT", content: "" },
      ]);

      const payload: ChatRequestPayload = {
        room_id: roomId,
        message: finalContent,
      };

      if (uploadedUrls.length > 0) {
        payload.file_urls = uploadedUrls;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/chat/stream-auto`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      // ✅ 1) 먼저 에러 처리 (여기가 핵심)
      if (!res.ok) {
        const errText = await res.text();
        console.log("sendMessage error body:", errText);

        // 서버가 상태를 안 내려줘도, 전송 실패로 LOCKED 추정
        if (
          res.status === 429 || // Too Many Requests
          res.status === 402 || // Payment Required (혹시)
          res.status === 403 || // Forbidden (혹시)
          errText.includes("한도") ||
          errText.toLowerCase().includes("quota") ||
          errText.toLowerCase().includes("limit")
        ) {
          setRoomStatus("LOCKED");
        }

        // 마지막 assistant 빈 버블 제거(선택)
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "ASSISTANT", content: assistantText };
          return copy;
        });
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }

    if (roomId) {
      const syncRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms/${roomId}/messages`,
        { credentials: "include" }
      );

      if (syncRes.ok) {
        const syncData: Message[] = await syncRes.json();

        setMessages((prev) => {
          return syncData.map((serverMsg) => {
            if (serverMsg.role !== "USER") return serverMsg;

            const local = prev.find(
              (p) =>
                p.role === "USER" &&
                p.content === serverMsg.content &&
                p.file_urls &&
                p.file_urls.length > 0
            );

            return local ?? serverMsg;
          });
        });
      }
    }

      if (!roomId) {
        const roomsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms`, { credentials: "include" });
        const rooms = await roomsRes.json();
        const newest = rooms[0];
        if (newest?.room_id) onRoomCreated(newest.room_id);
      }
    } catch (error: unknown) {
      if (!(error instanceof Error && error.name === "AbortError")) console.error(error);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const sendFeedbackRequest = async (msgId: number, satisfaction: string, reason?: string, comment?: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/feedback`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_id: msgId,
          satisfaction: satisfaction,
          reason: reason || null,
          comment: comment || null
        }),
      });
    } catch (e) {
      console.error("Feedback error:", e);
    }
  };

  const handleFeedbackClick = (msgId: number, score: "LIKE" | "DISLIKE") => {
    setTargetMessageId(msgId);
    setFeedbackScore(score);
    setIsModalOpen(true);
  };

  // 관계 고민 카테고리 데이터
  const categories = [
    {
      id: "communication",
      title: "대화의 온도",
      desc: "상대방과 자꾸 말이 어긋날 때",
      icon: <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />,
      text: "요즘 파트너와 대화를 하면 자꾸 오해가 생기고 어긋나는 것 같아 답답해요. 어떻게 대화를 풀어가면 좋을까요?"
    },
    {
      id: "distance",
      title: "관계의 거리",
      desc: "가까움과 서운함 사이 고민",
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
      text: "관계에서 적절한 거리를 유지하는 게 참 어려워요. 너무 가깝거나 멀게 느껴질 때 제 마음을 어떻게 정리해야 할까요?"
    },
    {
      id: "breakup",
      title: "이별과 정리",
      desc: "정리 이후 몰려오는 생각들",
      icon: <HeartIcon className="w-5 h-5" />,
      text: "관계가 끝난 뒤에 남은 복잡한 감정들을 정리하고 싶어요. 제 마음을 가만히 들여다볼 수 있게 도와주세요."
    },
    {
      id: "myself",
      title: "나의 마음",
      desc: "관계 속 잃어버린 나 찾기",
      icon: <FaceSmileIcon className="w-5 h-5" />,
      text: "관계에 집중하다 보니 제 자신의 마음을 돌보지 못한 것 같아요. 지금 제 감정을 찬찬히 정리해보고 싶어요."
    }
  ];

  // 상담 종료에 대한 멘트
  const endConsultation = async () => {
    if (!roomId) return;
    if (roomStatus === "ENDED") return;

    if (!confirm("상담을 종료하시겠습니까? 종료 후에는 메시지를 보낼 수 없습니다.")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/rooms/${roomId}/end`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ENDED" }),
        }
      );

      if (!res.ok) {
        alert("상담 종료에 실패했습니다.");
        return;
      }

      setRoomStatus("ENDED"); // ✅ 즉시 UI 반영
    } catch (e) {
      console.error(e);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-white relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <h2 className="font-bold text-gray-800 tracking-tight">마음 정리 동반자</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={endConsultation}
            disabled={!roomId || loading || roomStatus === "ENDED"}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            title="상담 종료"
          >
            상담 종료
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-3xl mx-auto py-8 space-y-6">
          {messages.length === 0 ? (
            /* ✨ 관계 상담 전용 웰컴 화면 */
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-700">
              <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                <SparklesIcon className="w-12 h-12 text-pink-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                어떤 마음을 <br/>정리하고 싶으신가요?
              </h1>
              <p className="text-gray-500 mb-12 max-w-sm text-sm leading-relaxed px-6">
                진단이나 분석보다는, 당신이 안전하게 속마음을 <br/>꺼내고 정리할 수 있도록 곁에 머무를게요.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-6">
                {categories.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSendMessage(item.text)} // 즉시 전송
                    className="group p-5 text-left border border-gray-100 bg-white rounded-2xl hover:bg-pink-50 hover:border-pink-200 transition-all shadow-sm hover:shadow-md text-gray-900"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-pink-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div className="font-bold group-hover:text-pink-600 transition-colors">{item.title}</div>
                    </div>
                    <div className="text-xs text-gray-500 leading-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => <ChatMessage key={idx} message_id={msg.message_id} role={msg.role} content={msg.content} user_feedback={msg.user_feedback} file_urls={msg.file_urls} onFeedback={handleFeedbackClick}/>)
          )}
          <div ref={bottomRef} className="h-24" />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4 md:p-6">
        <div className="max-w-3xl mx-auto relative group">
          <div className="flex flex-wrap gap-2 px-2 mb-3">
            {selectedFiles.map((item, idx) => (
              <div key={idx} className="relative group w-24 h-24 bg-gray-50 rounded-xl border-2 border-gray-100 flex flex-col items-center justify-center p-2 text-center shadow-sm">
                {item.previewUrl ? (
                  <Image src={item.previewUrl} alt="preview" fill className="object-cover rounded-xl" unoptimized />
                ) : (
                  <>
                    <DocumentIcon className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-500 line-clamp-2 break-all">{item.name}</span>
                  </>
                )}
                <button 
                  onClick={() => removeFile(idx)}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-red-500 z-10 shadow-md"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-pink-300 focus-within:ring-4 focus-within:ring-pink-50 transition-all">
          <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept="*/*" 
            />
            <div className="flex flex-col items-center">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isInputBlocked || selectedFiles.length >= MAX_FILES}
                className="p-2.5 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all disabled:opacity-20"
              >
                <PaperClipIcon className="w-6 h-6" />
              </button>
              {selectedFiles.length > 0 && (
                <span className="text-[9px] font-bold text-pink-500 mb-1">{selectedFiles.length}/{MAX_FILES}</span>
              )}
            </div>

            <textarea
              ref={inputRef}
              rows={1}
              disabled={isInputBlocked}
              className="flex-1 max-h-48 p-2 text-base text-gray-900 bg-transparent outline-none resize-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isComposing) {
                  e.preventDefault();
                  void handleSendMessage();
                }
              }}
              placeholder={isInputBlocked ? "기록 열람만 가능합니다." : "무엇이든 물어보세요"}
            />

            {loading ? (
              <button onClick={stopGeneration} className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                <StopIcon className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={() => void handleSendMessage()}
                disabled={!input.trim() || isInputBlocked}
                className="p-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* ? 안내 배너 */}
          {isInputBlocked && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {blockReason}
            </div>
          )}

          <p className="text-[11px] text-gray-400 mt-3 text-center tracking-tight">
            이 대화는 오직 당신의 기록 페이지에서 다시 돌아보며 마음을 정리하는 용도로만 사용됩니다.
          </p>
        </div>
      </div>
      <Feedback 
        isOpen={isModalOpen}
        feedbackScore={feedbackScore}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (reason: string, comment: string) => {
            if (targetMessageId && feedbackScore) {
              const validReasons = [
                "ACCURATE", "EMPATHETIC", "HELPFUL", 
                "INACCURATE", "OFFENSIVE", "TOO_LONG", 
                "NOT_EMPATHETIC", "IRRELEVANT"
              ];

              let finalReason: string;
              let finalComment: string | undefined = undefined;

              if (reason === "ETC") {
                finalReason = "OTHER";
                finalComment = comment || undefined; 
              } else if (validReasons.includes(reason)) {
                finalReason = reason;
                finalComment = undefined;
              } else {
                finalReason = "OTHER";
                finalComment = reason;
              }

              await sendFeedbackRequest(targetMessageId, feedbackScore, finalReason, finalComment);

              setMessages((prev) =>
                prev.map((m) => m.message_id === targetMessageId ? { ...m, user_feedback: feedbackScore } : m)
              );
              setIsModalOpen(false);
              alert("의견을 보내주셔서 감사합니다.");
            }
          }}
        />
    </div>
  );
}
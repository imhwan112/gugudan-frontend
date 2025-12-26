"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FeedbackProps {
  isOpen: boolean;
  feedbackScore: "LIKE" | "DISLIKE" | null;
  onClose: () => void;
  onSubmit: (reason: string, comment: string) => void;
}

export function Feedback({ isOpen, onClose, onSubmit, feedbackScore }: FeedbackProps) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

    const reasons = feedbackScore === "LIKE" 
        ? [
            { id: "ACCURATE", label: "정확한 분석" },
            { id: "EMPATHETIC", label: "따뜻한 공감" },
            { id: "HELPFUL", label: "도움이 됨" },
        ]
        : [
            { id: "INACCURATE", label: "상황 파악 오답" },
            { id: "OFFENSIVE", label: "말투가 불편함" },
            { id: "NOT_EMPATHETIC", label: "공감이 안 됨" },
            { id: "TOO_LONG", label: "답변이 너무 김" },
            { id: "IRRELEVANT", label: "엉뚱한 답변" },
            { id: "ETC", label: "기타 (직접 입력)" },
        ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-bold text-gray-900">어떤 점이 아쉬웠나요?</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {reasons.map((r) => (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  reason === r.id 
                  ? "bg-pink-50 border-pink-500 text-pink-600 shadow-sm" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <textarea
            className={`w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-50 transition-all resize-none h-24 ${
            reason !== "ETC" && "hidden"
            }`}
            placeholder="상세한 의견을 남겨주세요."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            disabled={!reason}
            onClick={() => onSubmit(reason, comment)}
            className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm disabled:bg-gray-200 disabled:text-gray-400 transition-all hover:bg-gray-800"
          >
            의견 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
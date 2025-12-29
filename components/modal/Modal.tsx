"use client";

import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    // 스크롤 잠금
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <button
        aria-label="close modal backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="font-semibold text-gray-900">{title}</div>
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            >
              닫기
            </button>
          </div>

          <div className="max-h-[70vh] overflow-auto px-5 py-5">
            {children}
          </div>

          <div className="px-5 py-4 border-t bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

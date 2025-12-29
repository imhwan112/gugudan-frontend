"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import TermsContent from "@/components/legal/TermsContent";
import PrivacyContent from "@/components/legal/PrivacyContent";

type LegalKey = "terms" | "privacy" | null;

export default function AppFooter() {
  const [openKey, setOpenKey] = useState<LegalKey>(null);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const close = () => setOpenKey(null);

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 text-center">
        {/* 브랜드 */}
        <div className="mb-6">
          <h4 className="text-white text-lg font-semibold mb-2">
            Gugudan
          </h4>
          <p className="text-sm text-gray-400">
            AI 기반 관계 상담 플랫폼
          </p>
        </div>

        {/* 링크 */}
        <div className="mb-6">
          <ul className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-sm">
            <li>
              <a href="#" className="hover:text-purple-400 transition-colors">
                공지사항
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400 transition-colors">
                자주 묻는 질문
              </a>
            </li>
            <li>
              <button
                onClick={() => setOpenKey("terms")}
                className="hover:text-purple-400 transition-colors"
              >
                이용약관
              </button>
            </li>
            <li>
              <button
                onClick={() => setOpenKey("privacy")}
                className="hover:text-purple-400 transition-colors"
              >
                개인정보처리방침
              </button>
            </li>
          </ul>
          {isAdmin ? (
            <>
              <Link href="/admin/faqs" className="hover:text-blue-600 transition text-blue-500">
                FAQ 관리
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/admin/inquiries" className="hover:text-blue-600 transition text-blue-500">
                문의 관리
              </Link>
              <span className="text-gray-300">|</span>
            </>
          ) : (
            <>
              <Link href="/faq" className="hover:text-gray-900 transition">
                FAQ
              </Link>
              <span className="text-gray-300">|</span>
              {isAuthenticated && (
                <>
                  <Link href="/inquiry" className="hover:text-gray-900 transition">
                    1:1 문의
                  </Link>
                  <span className="text-gray-300">|</span>
                </>
              )}
            </>
          )}
        </div>

        {/* 하단 고지 */}
        <div>
          <p className="text-sm text-gray-400">
            © 2025 Gugudan. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            본 서비스는 전문 상담을 대체하지 않으며, 참고용으로만 사용해주세요.
          </p>
        </div>
      </div>
      {/* Modal */}
      <Modal
        open={openKey !== null}
        title={openKey === "terms" ? "이용약관" : "개인정보처리방침"}
        onClose={close}
      >
        {openKey === "terms" ? <TermsContent /> : <PrivacyContent />}
      </Modal>
    </footer>
  );
}

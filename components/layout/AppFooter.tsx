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

  const baseLinks: { key: string; node: React.ReactNode }[] = [
    {
      key: "terms",
      node: (
        <button
          type="button"
          onClick={() => setOpenKey("terms")}
          className="hover:text-purple-400 transition-colors"
        >
          이용약관
        </button>
      ),
    },
    {
      key: "privacy",
      node: (
        <button
          type="button"
          onClick={() => setOpenKey("privacy")}
          className="hover:text-purple-400 transition-colors"
        >
          개인정보처리방침
        </button>
      ),
    },
  ];

  const adminLinks: { key: string; node: React.ReactNode }[] = [
    {
      key: "admin-faq",
      node: (
        <Link href="/admin/faqs" className="hover:text-purple-400 transition-colors">
          FAQ 관리
        </Link>
      ),
    },
    {
      key: "admin-inquiries",
      node: (
        <Link href="/admin/inquiries" className="hover:text-purple-400 transition-colors">
          문의 관리
        </Link>
      ),
    },
  ];

  const userLinks: { key: string; node: React.ReactNode }[] = [
    {
      key: "faq",
      node: (
        <Link href="/faq" className="hover:text-purple-400 transition-colors">
          자주 묻는 질문
        </Link>
      ),
    },
    ...(isAuthenticated
      ? [
          {
            key: "inquiry",
            node: (
              <Link href="/inquiry" className="hover:text-purple-400 transition-colors">
                1:1 문의
              </Link>
            ),
          },
        ]
      : []),
  ];

  const links = [...baseLinks, ...(isAdmin ? adminLinks : userLinks)];

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 text-center">
        {/* 브랜드 */}
        <div className="mb-6">
          <h4 className="text-white text-lg font-semibold mb-2">Love-Note</h4>
          <p className="text-sm text-gray-400">관계를 정리하는 AI 가이드</p>
        </div>

        <div className="mb-6">
          <nav aria-label="Footer links">
            <ul className="flex flex-wrap justify-center items-center gap-y-2 text-sm">
              {links.map((item, idx) => (
                <li key={item.key} className="flex items-center">
                  {item.node}
                  {idx !== links.length - 1 && (
                    <span className="mx-3 text-gray-600 select-none">|</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 하단 고지 */}
        <div>
          <p className="text-sm text-gray-400">© 2025 Love-Note. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            본 서비스는 개인의 관계 이해를 돕기 위한 참고용 가이드이며, <br />
            전문적인 의료·심리적 판단을 대체하지 않습니다.
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

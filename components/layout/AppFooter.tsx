"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";

export function AppFooter() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
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
          <span>© {new Date().getFullYear()} Gugudan</span>
        </div>
      </div>
    </footer>
  );
}
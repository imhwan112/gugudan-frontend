"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { UserRole } from "@/types/auth";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV_ITEMS = [
  { id: "start", label: "시작하기" },
  { id: "about", label: "러브노트는?" },
  { id: "mbti", label: "MBTI" },
  { id: "team", label: "개발팀" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const close = () => setOpen(false);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open || isMobile) return;
    const onDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) close();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, isMobile]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (path?: string) => {
    if (!path) return;
    close();
    router.push(path);
  };

  const onLogout = async () => {
    close();
    await logout();
  };

  const onNav = (id: NavId) => {
    close();
    const home = ROUTES.HOME ?? "/";
    const isHome = pathname === home;

    if (!isHome) {
      router.push(home + `#${id}`);
      return;
    }
    scrollToId(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href={ROUTES.HOME ?? "/"} className="shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            러브노트
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1 text-sm text-gray-700">
          {NAV_ITEMS.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => onNav(it.id)}
              className="px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              {it.label}
            </button>
          ))}
        </nav>

        {/* Right: Hamburger Only */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Admin Badge (선택사항) */}
          {isAuthenticated && isAdmin && (
            <span className="hidden sm:inline-flex text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
              관리자
            </span>
          )}

          {/* Hamburger Menu */}
          <div className="relative">
            <button
              type="button"
              aria-label="menu"
              onClick={() => setOpen((v) => !v)}
              className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <span className="text-lg leading-none">☰</span>
            </button>

            {/* Desktop dropdown */}
            {!isMobile && open && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-gray-200 bg-white shadow-lg p-2"
              >
                {/* 섹션 네비 */}
                <div className="px-2 py-2">
                  <div className="text-xs text-gray-500 px-1 mb-2">이동</div>
                  {NAV_ITEMS.map((it) => (
                    <button
                      key={it.id}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => onNav(it.id)}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>

                <div className="my-1 h-px bg-gray-100" />

                {/* 고객 지원 */}
                <div className="px-2 py-2">
                  <div className="text-xs text-gray-500 px-1 mb-2">고객 지원</div>
                  
                  <button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => go("/faq")}
                  >
                    자주 묻는 질문
                  </button>

                  {isAuthenticated ? (
                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => go("/inquiry")}
                    >
                      1:1 문의
                    </button>
                  ) : (
                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 cursor-not-allowed"
                      onClick={() => alert("로그인이 필요한 서비스입니다.")}
                    >
                      1:1 문의 (로그인 필요)
                    </button>
                  )}
                </div>

                <div className="my-1 h-px bg-gray-100" />

                {/* 계정 */}
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      <div className="font-medium text-gray-900">
                        {user?.nickname ?? "사용자"}님
                        {isAdmin && (
                          <span className="ml-1 text-blue-600 font-semibold">
                            (관리자)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">계정</div>
                    </div>

                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => go(ROUTES.MY_PAGE)}
                    >
                      My Page
                    </button>

                    <div className="my-1 h-px bg-gray-100" />

                    <button
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-red-600 transition-colors"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => go(ROUTES.LOGIN)}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile bottom sheet */}
          {isMobile && open && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/30" onClick={close} />
              <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 shadow-2xl">
                <div className="mx-auto h-1 w-10 rounded-full bg-gray-200 mb-3" />

                {/* 섹션 네비 */}
                <div className="grid gap-2 mb-2">
                  {NAV_ITEMS.map((it) => (
                    <button
                      key={it.id}
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                      onClick={() => onNav(it.id)}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>

                <div className="my-2 h-px bg-gray-100" />

                {/* 고객 지원 */}
                <div className="mb-2">
                  <div className="text-xs text-gray-500 px-4 mb-2">고객 지원</div>
                  
                  <button
                    className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                    onClick={() => go("/faq")}
                  >
                    자주 묻는 질문
                  </button>

                  {isAuthenticated ? (
                    <button
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                      onClick={() => go("/inquiry")}
                    >
                      1:1 문의
                    </button>
                  ) : (
                    <button
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400"
                      onClick={() => alert("로그인이 필요한 서비스입니다.")}
                    >
                      1:1 문의 (로그인 필요)
                    </button>
                  )}
                </div>

                <div className="my-2 h-px bg-gray-100" />

                {/* 계정 */}
                {isAuthenticated ? (
                  <>
                    <button
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                      onClick={() => go(ROUTES.MY_PAGE)}
                    >
                      My Page
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 text-red-600 transition-colors"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                    onClick={() => go(ROUTES.LOGIN)}
                  >
                    Login
                  </button>
                )}

                <div className="mt-2">
                  <Button variant="ghost" className="w-full" onClick={close}>
                    닫기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
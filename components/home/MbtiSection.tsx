"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "@/hooks/useInView";

type MbtiItem = {
  code: string;
  label: string;
  className: string;
};

type CategoryKey = "marriage" | "dating" | "crush";

const MBTI_LIST: MbtiItem[] = [
  { code: "INTJ", label: "용의주도한 전략가", className: "from-violet-500 to-fuchsia-500" },
  { code: "INTP", label: "논리적인 사색가", className: "from-blue-500 to-cyan-500" },
  { code: "ENTJ", label: "대담한 통솔자", className: "from-red-500 to-rose-500" },
  { code: "ENTP", label: "뜨거운 논쟁가", className: "from-orange-500 to-amber-500" },

  { code: "INFJ", label: "선의의 옹호자", className: "from-emerald-500 to-teal-500" },
  { code: "INFP", label: "열정적인 중재자", className: "from-green-500 to-emerald-500" },
  { code: "ENFJ", label: "정의로운 사회운동가", className: "from-pink-500 to-fuchsia-500" },
  { code: "ENFP", label: "재기발랄한 활동가", className: "from-yellow-500 to-amber-500" },

  { code: "ISTJ", label: "현실주의자", className: "from-indigo-500 to-blue-500" },
  { code: "ISFJ", label: "용감한 수호자", className: "from-sky-500 to-cyan-500" },
  { code: "ESTJ", label: "엄격한 관리자", className: "from-rose-500 to-red-500" },
  { code: "ESFJ", label: "사교적인 외교관", className: "from-lime-500 to-green-500" },

  { code: "ISTP", label: "만능 재주꾼", className: "from-slate-500 to-gray-600" },
  { code: "ISFP", label: "호기심 많은 예술가", className: "from-teal-500 to-emerald-500" },
  { code: "ESTP", label: "모험을 즐기는 사업가", className: "from-amber-500 to-orange-500" },
  { code: "ESFP", label: "자유로운 영혼의 연예인", className: "from-fuchsia-500 to-purple-600" },
];

const STORAGE_KEY = "selected_mbti";
const DEFAULT_CATEGORY: CategoryKey = "dating";
const FALLBACK_MBTI = "intj";

function track(event: string, payload?: Record<string, unknown>) {
  console.log("[track]", event, payload ?? {});
}

export default function MbtiSection() {
  const [selectedMbti, setSelectedMbti] = useState<string>(FALLBACK_MBTI);
  
  // ✅ 애니메이션 훅 추가
  const headerRef = useInView<HTMLDivElement>({ threshold: 0.2 });
  const gridRef = useInView<HTMLDivElement>({ threshold: 0.1 });
  const categoryRef = useInView<HTMLDivElement>({ threshold: 0.2 });

  // localStorage 복원
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSelectedMbti(saved);
  }, []);

  const categoryLinks = useMemo(() => {
    const mbti = selectedMbti || FALLBACK_MBTI;
    return {
      marriage: `/mbti/${mbti}/marriage`,
      dating: `/mbti/${mbti}/dating`,
      crush: `/mbti/${mbti}/crush`,
    } as const;
  }, [selectedMbti]);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* ✅ Header - 페이드인 */}
        <div
          ref={headerRef.ref}
          className={[
            "text-center max-w-2xl mx-auto transition-all duration-700",
            headerRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          ].join(" ")}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            ✨ MBTI로 살펴보는 관계 이야기
          </div>

          <h2 className="mt-5 text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-300">
            지금 마음에 맞는 관계 이야기를<br className="hidden md:block" />
            MBTI로 천천히 살펴볼 수 있어요
          </h2>

          <p className="mt-4 text-sm md:text-base text-gray-600 break-keep dark:text-gray-400 leading-relaxed">
            각 MBTI 성향을 참고해,
            <br className="hidden md:block" />
            지금 마음에 가까운 관계를 천천히 살펴봐요.
          </p>
        </div>

        {/* ✅ MBTI Grid - 스태거 애니메이션 */}
        <div
          ref={gridRef.ref}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {MBTI_LIST.map((m, idx) => {
            const mbtiLower = m.code.toLowerCase();
            const href = `/mbti/${mbtiLower}/${DEFAULT_CATEGORY}`;
            const isSelected = selectedMbti === mbtiLower;

            return (
              <Link
                key={m.code}
                href={href}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(STORAGE_KEY, mbtiLower);
                  }
                  setSelectedMbti(mbtiLower);

                  track("mbti_card_click", {
                    mbti: m.code,
                    mbti_lower: mbtiLower,
                    category: DEFAULT_CATEGORY,
                  });
                }}
                title={`${m.code} - ${m.label}`}
                className={[
                  "relative group block rounded-xl overflow-hidden",
                  "shadow-md hover:shadow-xl",
                  "transition-all duration-500 ease-out",
                  "hover:-translate-y-0.5 hover:scale-[1.02]",
                  "active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
                  isSelected ? "ring-2 ring-purple-300" : "ring-1 ring-transparent",
                  // ✅ 스태거 애니메이션
                  gridRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                ].join(" ")}
                style={{ 
                  transitionDelay: gridRef.inView ? `${idx * 50}ms` : "0ms" 
                }}
              >
                <div
                  className={[
                    `w-full bg-gradient-to-r ${m.className} text-white`,
                    "px-3 py-3 md:px-4 md:py-3.5",
                    "min-h-[64px] md:min-h-[72px]",
                    "flex items-center justify-center",
                  ].join(" ")}
                >
                  <div className="text-center leading-tight">
                    <div className="text-sm md:text-base font-bold tracking-wide opacity-95">
                      {m.code}
                    </div>
                    <div className="mt-0.5 text-[11px] md:text-xs opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                      {m.label}
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>

        {/* ✅ Category Box - 페이드인 + 스케일 */}
        <div
          ref={categoryRef.ref}
          className={[
            "mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8",
            "transition-all duration-700",
            categoryRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ].join(" ")}
        >
          <div className="text-center text-sm md:text-base font-semibold text-gray-800">
            카테고리별로 더 자세한 조언을 확인하세요
          </div>

          <div className="mt-2 text-center text-xs text-gray-500">
            선택된 MBTI:{" "}
            <span className="font-semibold text-gray-700">
              {selectedMbti.toUpperCase()}
            </span>
          </div>

          {/* ✅ 카테고리 카드 - 스태거 애니메이션 */}
          <div className="mt-6 grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { key: "marriage", icon: "💍", title: "결혼", desc: "MBTI별 결혼 조언", bg: "purple" },
              { key: "dating", icon: "💞", title: "연애", desc: "MBTI별 연애 조언", bg: "pink" },
              { key: "crush", icon: "🌙", title: "썸", desc: "MBTI별 썸 조언", bg: "amber" },
            ].map((cat, idx) => (
              <Link
                key={cat.key}
                href={categoryLinks[cat.key as CategoryKey]}
                onClick={() => track("mbti_category_click", { category: cat.key, mbti: selectedMbti })}
                className={[
                  `rounded-xl bg-${cat.bg}-50 hover:bg-${cat.bg}-100`,
                  "transition-all duration-500 ease-out",
                  "hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg",
                  "active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
                  "p-5 text-center",
                  // ✅ 스태거 애니메이션
                  categoryRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                ].join(" ")}
                style={{ 
                  transitionDelay: categoryRef.inView ? `${(idx + 1) * 150}ms` : "0ms" 
                }}
              >
                <div className="text-2xl">{cat.icon}</div>
                <div className="mt-3 text-sm font-semibold text-gray-900">{cat.title}</div>
                <div className="mt-1 text-xs text-gray-600">{cat.desc}</div>
              </Link>
            ))}
          </div>

          <div
            className={[
              "mt-6 text-center text-xs text-gray-500 transition-all duration-700 delay-500",
              categoryRef.inView ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            💡 각 MBTI를 눌러, 지금 마음에 가까운 관계 이야기를 읽어보세요
          </div>
        </div>
      </div>
    </section>
  );
}
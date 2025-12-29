"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MbtiItem = {
  code: string;
  label: string;
  className: string; // tailwind gradient
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
  // 나중에 GTM 붙일 때 여기만 교체하면 됨
  // window.dataLayer?.push({ event, ...payload })
  console.log("[track]", event, payload ?? {});
}

export default function MbtiSection() {
  const [selectedMbti, setSelectedMbti] = useState<string>(FALLBACK_MBTI);

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
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            ✨ MBTI 맞춤 상담
          </div>

          {/* ✅ 타이틀 문구 교체(원하면 다시 바꿔도 됨) */}
          <h2 className="mt-5 text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-300 font-bold">
            MBTI로 보는 <br className="hidden md:block" />
            연애·결혼·썸 스타일 한 번에
          </h2>

          <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed break-keep dark:text-gray-400 leading-relaxed">
            각 MBTI 유형별 특성을 고려한 맞춤형 연애·결혼·썸 조언을 제공합니다.
            <br className="hidden md:block" />
            원하는 관계 상황에 맞게 빠르게 확인해보세요.
          </p>
        </div>

        {/* mbti grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {MBTI_LIST.map((m) => {
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
                  "group block rounded-xl overflow-hidden",
                  "shadow-md hover:shadow-xl",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-0.5 hover:scale-[1.03]",
                  "active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
                  isSelected ? "ring-2 ring-purple-300" : "ring-1 ring-transparent",
                ].join(" ")}
              >
                <div className={`h-full w-full bg-gradient-to-r ${m.className} text-white px-4 py-5`}>
                  <div className="text-center">
                    <div className="text-sm font-semibold tracking-wide opacity-95">{m.code}</div>
                    <div className="mt-1 text-xs opacity-90">{m.label}</div>
                  </div>
                </div>

                {/* hover 시 살짝 하이라이트 */}
                <div className="pointer-events-none absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>

        {/* category box */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="text-center text-sm md:text-base font-semibold text-gray-800">
            카테고리별로 더 자세한 조언을 확인하세요
          </div>

          <div className="mt-2 text-center text-xs text-gray-500">
            선택된 MBTI: <span className="font-semibold text-gray-700">{selectedMbti.toUpperCase()}</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            <Link
              href={categoryLinks.marriage}
              onClick={() => track("mbti_category_click", { category: "marriage", mbti: selectedMbti })}
              className={[
                "rounded-xl bg-purple-50 hover:bg-purple-100",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg",
                "active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
                "p-5 text-center",
              ].join(" ")}
            >
              <div className="text-2xl">💍</div>
              <div className="mt-3 text-sm font-semibold text-gray-900">결혼</div>
              <div className="mt-1 text-xs text-gray-600">MBTI별 결혼 조언</div>
            </Link>

            <Link
              href={categoryLinks.dating}
              onClick={() => track("mbti_category_click", { category: "dating", mbti: selectedMbti })}
              className={[
                "rounded-xl bg-pink-50 hover:bg-pink-100",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg",
                "active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
                "p-5 text-center",
              ].join(" ")}
            >
              <div className="text-2xl">💞</div>
              <div className="mt-3 text-sm font-semibold text-gray-900">연애</div>
              <div className="mt-1 text-xs text-gray-600">MBTI별 연애 조언</div>
            </Link>

            <Link
              href={categoryLinks.crush}
              onClick={() => track("mbti_category_click", { category: "crush", mbti: selectedMbti })}
              className={[
                "rounded-xl bg-amber-50 hover:bg-amber-100",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg",
                "active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
                "p-5 text-center",
              ].join(" ")}
            >
              <div className="text-2xl">🌙</div>
              <div className="mt-3 text-sm font-semibold text-gray-900">썸</div>
              <div className="mt-1 text-xs text-gray-600">MBTI별 썸 조언</div>
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            💡 각 MBTI 카드를 클릭하면 해당 유형의 <b>연애(기본)</b> 페이지로 이동합니다
          </div>
        </div>
      </div>
    </section>
  );
}

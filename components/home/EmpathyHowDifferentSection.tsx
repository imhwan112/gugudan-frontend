"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [showBot, setShowBot] = useState(false);

  useEffect(() => {
    if (!inView) {
      setShowBot(false);
      return;
    }
    const t = window.setTimeout(() => setShowBot(true), 650);
    return () => window.clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting); 
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

export default function EmpathyHowDifferentSection() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });
  const [showBot, setShowBot] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setShowBot(true), 650);
    return () => window.clearTimeout(t);
  }, [inView]);

  const cards = [
    { title: "관심이 있는 건지 모르겠어요", desc: "연락·행동이 애매하면, 기준이 금방 흐려져요." },
    { title: "내가 예민한 건가요?", desc: "서운함이 쌓였는데 말로 꺼내기 어려울 때가 있어요." },
    { title: "이 관계를 계속해야 할까요?", desc: "놓기 싫지만 붙잡기 힘든 순간이 와요." },
    { title: "마음이 복잡해서 말이 안 나와요", desc: "정리되지 않은 감정도 괜찮아요." },
  ];

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
    >
      {/* Empathy 헤더 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
          ✨ 지금 마음을 정리하는 첫 질문
        </div>

        <h3 className="mt-5 text-2xl md:text-3xl font-bold text-gray-900 break-keep">
          이런 생각, 해본 적 있나요?
        </h3>

        <p className="mt-3 text-gray-600 break-keep leading-relaxed">
          love-note는 “정답”보다,
          <br className="hidden md:block" />
          지금 마음의 맥락을 먼저 정리해요.
        </p>
      </div>

      {/* Empathy 카드 4개 */}
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="text-base font-semibold text-gray-900 break-keep">{c.title}</div>
            <div className="mt-2 text-sm text-gray-600 break-keep">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* 아래: HowDifferent (2번째 스샷처럼 바로 이어붙이기) */}
      <div className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
        {/* 왼쪽: 대화형 미리보기 */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">대화 흐름 미리보기</div>
          <p className="mt-2 text-sm text-gray-600 break-keep">
            막연한 감정을 “말”로 바꾸고, 지금 할 수 있는 다음 행동을 정리해요.
          </p>

          <div className="mt-6 space-y-4">
            <div
              className={[
                "max-w-[85%] rounded-2xl bg-gray-100 px-4 py-3 text-gray-800 transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              “연락이 줄었는데… 내가 예민한 건가요?”
            </div>

            <div
              className={[
                "ml-auto max-w-[85%] rounded-2xl bg-purple-600 px-4 py-3 text-white transition-all duration-700",
                showBot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              먼저 “사실”과 “느낌”을 분리해볼게요. <br />
              줄어든 건 빈도인가요, 톤인가요, 약속의 태도인가요?
            </div>

            <div
              className={[
                "max-w-[85%] rounded-2xl bg-gray-100 px-4 py-3 text-gray-800 transition-all duration-700",
                showBot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              “빈도도 줄었고… 약속도 미뤄요.”
            </div>

            <div
              className={[
                "ml-auto max-w-[85%] rounded-2xl bg-purple-600 px-4 py-3 text-white transition-all duration-700",
                showBot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              그럼 “예민함” 문제가 아니라 <br />
              관계의 우선순위 신호일 가능성이 있어요. <br />
              다음으로는 “확인 질문”을 부드럽게 준비해볼까요?
            </div>
          </div>
        </div>

        {/* 오른쪽: 차별점 */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 break-keep">love-note는 이렇게 달라요</h3>
          <p className="mt-3 text-gray-600 break-keep leading-relaxed">
            단정된 결론을 주기보다,
            <br className="hidden md:block" />
            지금 상황을 정리하고 “선택할 수 있는 말과 행동”을 만들어줘요.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="text-sm font-semibold text-gray-800">일반</div>
              <div className="mt-1 text-sm text-gray-600 break-keep">
                질문 → 결과 / 유형 고정 / 결론 단정
              </div>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5 border border-purple-100">
              <div className="text-sm font-semibold text-purple-800">love-note</div>
              <div className="mt-1 text-sm text-purple-700 break-keep">
                대화 → 맥락 정리 / 상황 반영 / 선택을 돕는 제안
              </div>
            </div>

            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li>• “왜 불편한지”를 말로 만들어줌</li>
              <li>• 상대/나/관계의 포인트를 분리해줌</li>
              <li>• 지금 할 수 있는 “다음 한 문장”을 만들어줌</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

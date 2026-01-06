"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

export default function TeamSection() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ 애니메이션 훅 추가
  const mascotRef = useInView<HTMLDivElement>({ threshold: 0.2 });
  const cardsRef = useInView<HTMLDivElement>({ threshold: 0.1 });

  const cards = [
    {
      icon: "🎯",
      title: "우리의 미션",
      desc: '누구나 부담 없이, 관계 고민을 "정리하고 시작"할 수 있는 길을 만들어요.',
    },
    {
      icon: "🫶",
      title: "우리의 가치",
      desc: '공감 · 신뢰 · 프라이버시를 지키면서, "현실적으로 도움이 되는 답"을 목표로 해요.',
    },
    {
      icon: "✨",
      title: "우리의 비전",
      desc: '애매한 감정과 상황을 "말로 정리할 수 있게" 돕는, 따뜻한 AI 관계 파트너가 되고 싶어요.',
    },
  ];

  return (
    <section className="w-full pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* ✅ Mascot Area - 페이드인 + 스케일 */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div
            ref={mascotRef.ref}
            className={[
              "rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-lg overflow-hidden",
              "transition-all duration-700",
              mascotRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-95",
            ].join(" ")}
          >
            {/* ✅ 헤더 텍스트 - 페이드인 */}
            <div
              className={[
                "p-4 md:p-6 transition-all duration-700 delay-200",
                mascotRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              ].join(" ")}
            >
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  구구단 팀
                </h2>
                우리는 이렇게 만들고 있어요
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center break-keep">
                구구단은 관계를 '정답'으로 재단하기보다,
                <br />
                사용자가 스스로 선택할 수 있도록 생각을 정리하는 데 집중해요.
                <br />
                차가운 기능보다, 사람에게 도움이 되는 경험을 먼저 고민합니다.
              </p>
            </div>

            {/* ✅ 마스코트 이미지 - 페이드인 */}
            <div
              className={[
                "relative w-full aspect-[16/9] bg-gray-50 dark:bg-white/5",
                "transition-all duration-700 delay-400",
                mascotRef.inView ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <Image
                src="/images/home/gugudan-mascot.jpeg"
                alt="구구단 마스코트"
                fill
                className={[
                  "object-contain p-6 transition-opacity duration-500",
                  imageLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, 768px"
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* ✅ 3 Cards - 스태거 애니메이션 */}
        <div
          ref={cardsRef.ref}
          className="mt-10 grid md:grid-cols-3 gap-6"
        >
          {cards.map((card, idx) => (
            <div
              key={card.title}
              className={[
                "rounded-2xl bg-white/90 dark:bg-white/5 p-8 text-center border border-blue-100/70 dark:border-white/10 shadow-sm",
                "transition-all duration-700 ease-out",
                "hover:scale-[1.03] hover:shadow-md",
                "will-change-transform",
                // ✅ 스태거 애니메이션
                cardsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              ].join(" ")}
              style={{ 
                transitionDelay: cardsRef.inView ? `${idx * 150}ms` : "0ms" 
              }}
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow">
                {card.icon}
              </div>
              <div className="mt-5 font-semibold text-gray-900 dark:text-gray-100">
                {card.title}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-keep">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
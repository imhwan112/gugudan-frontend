"use client";

import Image from "next/image";
import { useInView } from "@/hooks/useInView";

type Props = {
  imageSrc?: string;
};

export default function HomeSpecialReasonSection({
  imageSrc = "/images/home/home-special-reason.jpg",
}: Props) {
  // ✅ 애니메이션 훅 추가
  const headerRef = useInView<HTMLDivElement>({ threshold: 0.2 });
  const cardsRef = useInView<HTMLDivElement>({ threshold: 0.1 });
  const boxRef = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="">
      {/* ✅ 섹션 헤더 - 페이드인 */}
      <div
        ref={headerRef.ref}
        className={[
          "text-center max-w-2xl mx-auto mb-10 transition-all duration-700",
          headerRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        ].join(" ")}
      >
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-200 font-bold">
          러브노트는 이렇게 달라요
        </h3>
        <p className="mt-3 text-sm md:text-base text-gray-600 break-keep dark:text-gray-400 leading-relaxed">
          공감 중심의 대화로
          <br className="hidden md:block" />
          언제 어디서나 편안하게 마음을 꺼낼 수 있어요
        </p>
      </div>

      {/* ✅ 3개 카드 - 스태거 애니메이션 */}
      <div
        ref={cardsRef.ref}
        className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto"
      >
        <FeatureCard
          icon="🔒"
          iconBg="bg-purple-100"
          title="당신의 이야기는 밖으로 나가지 않아요"
          desc="이곳에서 나눈 이야기는 안전하게 보호돼요."
          inView={cardsRef.inView}
          delay={0}
        />
        <FeatureCard
          icon="💬"
          iconBg="bg-pink-100"
          title="기다리게 하지 않아요"
          desc="말이 떠오를 때, 바로 이어서 적을 수 있어요."
          inView={cardsRef.inView}
          delay={150}
        />
        <FeatureCard
          icon="💜"
          iconBg="bg-indigo-100"
          title="판단하지 않아요"
          desc="맞고 틀림보다, 지금의 감정을 먼저 존중해요."
          inView={cardsRef.inView}
          delay={300}
        />
      </div>

      {/* ✅ 아래 큰 박스 - 페이드인 + 스케일 */}
      <div className="mt-10 max-w-5xl mx-auto">
        <div
          ref={boxRef.ref}
          className={[
            "rounded-3xl bg-white/60 border border-purple-100 shadow-sm p-6 md:p-10",
            "transition-all duration-700",
            boxRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ].join(" ")}
        >
          <div className="grid gap-8 md:grid-cols-2 items-center">
            {/* ✅ 왼쪽 텍스트 - 슬라이드 인 */}
            <div
              className={[
                "transition-all duration-700 delay-200",
                boxRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
              ].join(" ")}
            >
              <p className="text-sm text-gray-500 mb-2">24시간 언제든지</p>
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 break-keep">
                이야기를 천천히 꺼내도 괜찮아요
              </h4>

              <div className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                <p>
                  혼자서 감당하기 버거운 마음을<br />
                  꼭 해결하려고 애쓰지 않아도 괜찮아요.
                </p>
              </div>

              {/* ✅ 체크리스트 - 순차 등장 */}
              <ul className="mt-6 space-y-3 text-sm md:text-base text-gray-700">
                {[
                  "지금 느끼는 감정을 있는 그대로 남길 수 있어요",
                  "서두르지 않고, 이어서 기록할 수 있어요",
                  "판단 없이 안전하게 보관돼요",
                ].map((text, idx) => (
                  <li
                    key={idx}
                    className={[
                      "flex items-center gap-3 transition-all duration-700",
                      boxRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                    ].join(" ")}
                    style={{ 
                      transitionDelay: boxRef.inView ? `${400 + idx * 100}ms` : "0ms" 
                    }}
                  >
                    <span className="inline-flex w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                      ✓
                    </span>
                    <span className="break-keep">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ 오른쪽 이미지 - 슬라이드 인 */}
            <div
              className={[
                "relative w-full aspect-[4/3] rounded-2xl overflow-hidden",
                "transition-all duration-700 delay-300",
                boxRef.inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
              ].join(" ")}
            >
              <Image
                src={imageSrc}
                alt="러브노트 특별한 이유"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  desc,
  inView,
  delay,
}: {
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  inView: boolean;
  delay: number;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/70 border border-purple-100 shadow-sm p-7 text-center",
        "transition-all duration-700 ease-out",
        "hover:scale-[1.03] hover:shadow-md",
        "will-change-transform",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      ].join(" ")}
      style={{ 
        transitionDelay: inView ? `${delay}ms` : "0ms" 
      }}
    >
      <div
        className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <span className="text-xl">{icon}</span>
      </div>
      <h5 className="text-gray-900 font-semibold mb-2">{title}</h5>
      <p className="text-sm text-gray-600 break-keep leading-relaxed">{desc}</p>
    </div>
  );
}
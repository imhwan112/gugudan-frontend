"use client";

import Image from "next/image";

type Props = {
  // 오른쪽 이미지 교체용 (원하면 다른 이미지 넣을 수 있게)
  imageSrc?: string;
};

export default function HomeSpecialReasonSection({
  imageSrc = "/images/home/home-special-reason.jpg",
}: Props) {
  return (
    <section className="mt-20">
      {/* 섹션 헤더 */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-200 font-bold">
          구구단이 특별한 이유
        </h3>
        <p className="mt-3 text-sm md:text-base text-gray-600 break-keep dark:text-gray-400 leading-relaxed">
          AI 기술과 공감 중심 대화로
          <br className="hidden md:block" />
          언제 어디서나 편안한 상담을 받을 수 있습니다
        </p>
      </div>

      {/* 3개 카드 */}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        <FeatureCard
          icon="🔒"
          iconBg="bg-purple-100"
          title="완벽한 비밀 보장"
          desc="대화 내용은 암호화되어 안전하게 보호돼요"
        />
        <FeatureCard
          icon="💬"
          iconBg="bg-pink-100"
          title="즉각적인 응답"
          desc="기다릴 필요 없이 바로 대화를 시작해요"
        />
        <FeatureCard
          icon="💜"
          iconBg="bg-indigo-100"
          title="따뜻한 공감"
          desc="판단하지 않고 당신의 이야기를 경청해요"
        />
      </div>

      {/* 아래 큰 박스(텍스트 + 이미지) */}
      <div className="mt-10 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white/60 border border-purple-100 shadow-sm p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            {/* 왼쪽 텍스트 */}
            <div>
              <p className="text-sm text-gray-500 mb-2">24시간 언제든지</p>
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 break-keep">
                당신의 이야기를 들어요
              </h4>

              <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                혼자 고민하는 시간을 줄이고, 전문적인 AI 상담사와 함께
                당신의 고민을 해결해보세요. 결혼, 연애, 썸까지 모든 관계의 고민을
                함께 나눌 수 있습니다.
              </p>

              <ul className="mt-6 space-y-3 text-sm md:text-base text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="inline-flex w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                    ✓
                  </span>
                  <span className="break-keep">실시간 AI 상담으로 즉각적인 답변</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                    ✓
                  </span>
                  <span className="break-keep">MBTI 기반 맞춤형 조언 제공</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                    ✓
                  </span>
                  <span className="break-keep">편안하고 안전한 상담 환경</span>
                </li>
              </ul>
            </div>

            {/* 오른쪽 이미지 */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={imageSrc}
                alt="Gugudan special reason"
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
}: {
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 border border-purple-100 shadow-sm p-7 text-center
    transition-all duration-300 ease-out
    transform hover:scale-[1.03]
    hover:shadow-md
    will-change-transform"
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

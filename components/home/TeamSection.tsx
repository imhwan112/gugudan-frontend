"use client";

import Image from "next/image";

export default function TeamSection() {
  return (
    <section className="w-full pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-200 font-bold">구구단 팀</h2>
          <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed break-keep dark:text-gray-400 leading-relaxed">
            우리는 AI 기술로 더 많은 사람들의 관계 고민을 해결하고
            <br className="hidden md:block" />
            따뜻한 연결을 만들어가는 팀입니다
          </p>
        </div>

        {/* 3 cards */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-purple-50 p-8 text-center border border-blue-100 shadow-sm
                        transition-all duration-300 transform hover:scale-[1.03]
                        hover:shadow-md
                        will-change-transform"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-white flex items-center justify-center shadow">
              🎯
            </div>
            <div className="mt-5 font-semibold text-gray-900">우리의 미션</div>
            <p className="mt-2 text-sm text-gray-600 break-keep">
              AI 상담으로 누구나 쉽게 관계 고민을 해결할 수 있는 세상을 만듭니다
            </p>
          </div>

          <div className="rounded-2xl bg-pink-50 p-8 text-center border border-blue-100 shadow-sm
                        transition-all duration-300 transform hover:scale-[1.03]
                        hover:shadow-md
                        will-change-transform"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-white flex items-center justify-center shadow">
              👥
            </div>
            <div className="mt-5 font-semibold text-gray-900">우리의 가치</div>
            <p className="mt-2 text-sm text-gray-600 break-keep">
              공감, 신뢰, 프라이버시를 최우선으로 생각합니다
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-8 text-center border border-blue-100 shadow-sm
                        transition-all duration-300 transform hover:scale-[1.03]
                        hover:shadow-md
                        will-change-transform"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-white flex items-center justify-center shadow">
              ⚡
            </div>
            <div className="mt-5 font-semibold text-gray-900">우리의 비전</div>
            <p className="mt-2 text-sm text-gray-600 break-keep">
              AI와 인간의 따뜻한 감성이 조화를 이루는 미래를 그립니다
            </p>
          </div>
        </div>

        {/* gradient banner */}
        <div className="mt-10 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 md:px-10 py-10 text-white text-center">
            <div className="text-sm md:text-base font-semibold">
              함께 만들어가는 따뜻한 세상
            </div>
            <p className="mt-3 text-sm md:text-base opacity-95 break-keep">
              구구단은 계속해서 발전하고 있습니다.
              <br className="hidden md:block" />
              여러분의 소중한 피드백과 함께 더 나은 서비스를 만들어가겠습니다.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur">
                <b className="font-semibold"></b>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur">
                 <b className="font-semibold"></b>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur">
                 <b className="font-semibold"></b>
              </span>
            </div>
          </div>
        </div>

        {/* mascot image area */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="text-sm font-semibold text-gray-900 text-center">
                구구단을 만드는 사람들
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-600 text-center break-keep">
                구구단은 혼자 만들어지지 않았어요.<br />
                상담, 기술, 그리고 사람의 마음을 고민하는<br />
                개발자들이 함께 모여 만들고 있어요.<br /><br />
                차가운 기능보다,<br />
                사람에게 도움이 되는 경험을 먼저 생각합니다.
              </p>
            </div>

            {/* ✅ 아래 src는 네가 파일로 저장해서 넣으면 됨 */}
            <div className="relative w-full aspect-[16/9] bg-gray-50">
              <Image
                src="/images/home/gugudan-mascot.jpeg"
                alt="Gugudan mascot"
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

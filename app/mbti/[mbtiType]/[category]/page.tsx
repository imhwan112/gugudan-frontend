"use client";

import Link from "next/link";
import { useParams, useRouter, usePathname  } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Lightbulb, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type CategoryKey = "marriage" | "dating" | "crush";

// default
const FALLBACK_MBTI = "intj";
const FALLBACK_CATEGORY: CategoryKey = "dating";

const categoryInfo: Record<
  CategoryKey,
  { title: string; emoji: string; color: string; bg: string }
> = {
  marriage: {
    title: "결혼",
    emoji: "💍",
    color: "from-pink-500 to-pink-600",
    bg: "from-pink-50 to-pink-100",
  },
  dating: {
    title: "연애",
    emoji: "💕",
    color: "from-purple-500 to-purple-600",
    bg: "from-purple-50 to-purple-100",
  },
  crush: {
    title: "썸",
    emoji: "💫",
    color: "from-amber-500 to-amber-600",
    bg: "from-amber-50 to-amber-100",
  },
};

const mbtiDescriptions: Record<string, { name: string; traits: string[] }> = {
  INTJ: { name: "용의주도한 전략가", traits: ["전략적 사고", "독립적", "완벽주의", "장기 계획"] },
  INTP: { name: "논리적인 사색가", traits: ["논리적 분석", "호기심", "창의적", "이론적 사고"] },
  ENTJ: { name: "대담한 통솔자", traits: ["리더십", "결단력", "목표지향", "효율성"] },
  ENTP: { name: "뜨거운 논쟁가", traits: ["창의적", "논쟁적", "모험적", "빠른 사고"] },
  INFJ: { name: "선의의 옹호자", traits: ["통찰력", "이상주의", "공감 능력", "헌신적"] },
  INFP: { name: "열정적인 중재자", traits: ["이상주의", "창의적", "감수성", "진정성"] },
  ENFJ: { name: "정의로운 사회운동가", traits: ["카리스마", "공감 능력", "사교적", "영감적"] },
  ENFP: { name: "재기발랄한 활동가", traits: ["열정적", "창의적", "사교적", "긍정적"] },
  ISTJ: { name: "현실주의자", traits: ["책임감", "조직적", "신뢰성", "실용적"] },
  ISFJ: { name: "용감한 수호자", traits: ["헌신적", "세심함", "책임감", "지원적"] },
  ESTJ: { name: "엄격한 관리자", traits: ["조직력", "실용적", "결단력", "전통적"] },
  ESFJ: { name: "사교적인 외교관", traits: ["사교적", "협조적", "책임감", "세심함"] },
  ISTP: { name: "만능 재주꾼", traits: ["실용적", "논리적", "유연함", "모험적"] },
  ISFP: { name: "호기심 많은 예술가", traits: ["예술적", "유연함", "감수성", "자유로움"] },
  ESTP: { name: "모험을 즐기는 사업가", traits: ["행동적", "대담함", "현실적", "사교적"] },
  ESFP: { name: "자유로운 영혼의 연예인", traits: ["활발함", "즐거움", "사교적", "즉흥적"] },
};

// ✅ 이벤트 훅 포인트 (GTM/GA 붙일 때 여기만 바꾸면 됨)
function track(event: string, payload?: Record<string, unknown>) {
  // 예: window.dataLayer?.push({ event, ...payload })
  // 지금은 콘솔로만
  console.log("[track]", event, payload ?? {});
}

export default function MBTIDetailPage() {
  const params = useParams<{ mbtiType: string; category: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading } = useAuth();

  const mbtiType = (params?.mbtiType ?? "").toString();
  const categoryRaw = (params?.category ?? "dating").toString();

  const mbtiUpperCase = mbtiType.toUpperCase();
  const category = (["marriage", "dating", "crush"].includes(categoryRaw)
    ? categoryRaw
    : "dating") as CategoryKey;

  const currentCategory = categoryInfo[category];
  const currentMBTI = mbtiDescriptions[mbtiUpperCase] || { name: "MBTI 유형", traits: [] };

  const sections = [
    {
      icon: Heart,
      title: "관계 특성",
      content: `${mbtiUpperCase} 유형은 ${currentCategory.title}에서 독특한 접근 방식을 가지고 있습니다. ${
        currentMBTI.traits[0] ?? "특유의 강점"
      }과 ${currentMBTI.traits[1] ?? "관계 스타일"}의 특성이 관계에서 중요한 역할을 합니다.`,
    },
    {
      icon: MessageCircle,
      title: "소통 방식",
      content: `${mbtiUpperCase}는 ${currentCategory.title} 관계에서 소통할 때 자신만의 스타일을 가지고 있습니다. 상대방과의 효과적인 대화 방법을 알아보세요.`,
    },
    {
      icon: Lightbulb,
      title: "주의할 점",
      content: `${currentCategory.title} 단계에서 ${mbtiUpperCase} 유형이 주의해야 할 점들이 있습니다. 이러한 부분을 인식하고 개선하면 더 건강한 관계를 만들 수 있습니다.`,
    },
    {
      icon: TrendingUp,
      title: "관계 발전 팁",
      content: `${mbtiUpperCase} 유형을 위한 ${currentCategory.title} 관계 발전 전략입니다. 당신의 강점을 활용하여 더 깊은 유대감을 형성하세요.`,
    },
  ];

  const otherCategories = (Object.keys(categoryInfo) as CategoryKey[]).filter((k) => k !== category);

  return (
    <div className="min-h-screen bg-white">

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => {
              track("mbti_back_to_home", { mbtiType: mbtiUpperCase, category });
              router.push("/");
            }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </button>

          {/* Hero */}
          <div className={`bg-gradient-to-br ${currentCategory.bg} rounded-3xl p-8 md:p-12 mb-12`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-4">{currentCategory.emoji}</div>
              <h1 className="mb-4 text-3xl md:text-5xl font-extrabold text-gray-900">
                {mbtiUpperCase} × {currentCategory.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                {currentMBTI.name}의 {currentCategory.title} 가이드
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {currentMBTI.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-gray-700 shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-12">
              <h2 className="mb-4 text-white text-2xl font-bold">
                {mbtiUpperCase}를 위한 {currentCategory.title} 조언
              </h2>
              <p className="text-purple-100 leading-relaxed">
                {mbtiUpperCase} 유형은 {currentMBTI.traits.join(", ")} 등의 특성을 가지고 있어{" "}
                {currentCategory.title} 관계에서 독특한 강점을 발휘할 수 있습니다. 당신의 성격적
                특성을 이해하고 활용하여 더 행복한 관계를 만들어가세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                  onClick={() => track("mbti_section_click", { mbtiType: mbtiUpperCase, category, section: section.title })}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${currentCategory.color} text-white mb-4`}
                  >
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* AI Consultation CTA */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center mb-12">
              <h3 className="mb-4 text-xl font-bold text-gray-900">더 자세한 상담이 필요하신가요?</h3>
              <p className="text-gray-600 mb-6">
                AI 상담사와 1:1로 대화하며 당신만의 맞춤 조언을 받아보세요
              </p>
              <button
                onClick={() => { track("mbti_cta_start_chat", { mbtiType: mbtiUpperCase, category, isAuthenticated, });
                  if (!isAuthenticated) {
                    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                  }
                  router.push("/chat");
                }}
                disabled={isLoading}
                className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${currentCategory.color} text-white rounded-full
                  hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none`}
              >
                AI 상담 시작하기
                <MessageCircle className="w-5 h-5" />
              </button>

              {!isAuthenticated && !isLoading && (
                <p className="mt-4 text-sm text-gray-500">
                  로그인 후 AI 상담을 시작할 수 있어요
                </p>
              )}
            </div>
          </div>

          {/* Other Categories */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center mb-8 text-lg font-bold text-gray-900">
              {mbtiUpperCase}의 다른 관계 조언도 확인해보세요
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {otherCategories.map((key) => {
                const info = categoryInfo[key];
                return (
                  <Link
                    key={key}
                    href={`/mbti/${mbtiType}/${key}`}
                    onClick={() => track("mbti_other_category_click", { mbtiType: mbtiUpperCase, from: category, to: key })}
                    className={`block p-8 rounded-2xl bg-gradient-to-br ${info.bg} hover:shadow-lg transition-all duration-300 hover:scale-105 text-center`}
                  >
                    <div className="text-4xl mb-3">{info.emoji}</div>
                    <h4 className="mb-2 text-lg font-bold text-gray-900">{info.title}</h4>
                    <p className="text-gray-600">
                      {mbtiUpperCase}의 {info.title} 가이드 보기
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900">
                {mbtiUpperCase} {currentCategory.title} - 자주 묻는 질문
              </h2>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {mbtiUpperCase}는 {currentCategory.title}할 때 어떤 특징이 있나요?
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {mbtiUpperCase} 유형은 {currentMBTI.traits[0] ?? "특유의 성향"}하고{" "}
                    {currentMBTI.traits[1] ?? "관계 스타일"} 성격으로 {currentCategory.title} 관계에서
                    신중하면서도 진지한 태도를 보입니다. 상대방과의 깊은 교감을 중요하게 생각하며,
                    장기적인 관점에서 관계를 바라봅니다.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {mbtiUpperCase}에게 맞는 {currentCategory.title} 스타일은?
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {mbtiUpperCase}는 진정성 있고 깊이 있는 대화를 선호합니다. 표면적인 관계보다는
                    서로를 깊이 이해하고 존중하는 관계를 추구합니다.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {mbtiUpperCase} {currentCategory.title} 조언은 어디서 받을 수 있나요?
                  </h3>
                  <p className="text-gray-600 mt-2">
                    구구단 AI 상담 서비스를 통해 24시간 언제든지 {mbtiUpperCase} 유형에 맞는{" "}
                    {currentCategory.title} 조언을 받으실 수 있습니다. MBTI 기반 맞춤형 상담으로 더
                    효과적인 해결책을 찾아보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

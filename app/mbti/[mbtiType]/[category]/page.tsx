import type { Metadata } from "next";
import MBTIDetailClient from "./MBTIDetailClient";

import { categoryInfo, type CategoryKey } from "@/app/mbti/_content/categoryInfo";
import { mbtiDescriptions } from "@/app/mbti/_content/mbtiMeta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Love-Note";

const VALID_CATEGORIES: CategoryKey[] = ["marriage", "dating", "crush"];
const VALID_MBTI = new Set(Object.keys(mbtiDescriptions)); // "INTJ" 등

function safeCategory(raw: string): CategoryKey {
  return VALID_CATEGORIES.includes(raw as CategoryKey) ? (raw as CategoryKey) : "dating";
}

function safeMbti(raw: string): string {
  const m = (raw ?? "").toUpperCase();
  return VALID_MBTI.has(m) ? m : "MBTI";
}

type Params = { mbtiType: string; category: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { mbtiType, category: categoryRaw } = await params;

  const mbti = safeMbti(mbtiType);
  const category = safeCategory(categoryRaw);

  const cat = categoryInfo[category];
  const mbtiMeta = mbtiDescriptions[mbti] ?? { name: "MBTI 유형", oneLiner: "" };

  const title = `${mbti} ${cat.title} 가이드`;
  const description =
    `${mbtiMeta.name}${mbtiMeta.oneLiner ? ` · ${mbtiMeta.oneLiner}` : ""} — ` +
    `MBTI 기반으로 ${cat.title}에서 자주 생기는 흐름과 대화 포인트를 정리했어요.`;

  // ✅ canonical은 "정규화된 값"으로 고정 (SEO 안정)
  const canonicalPath = `/mbti/${mbti.toLowerCase()}/${category}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath }, // ✅ 경로로
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "ko_KR",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: `${SITE_URL}/og/mbti-default.png`,
          width: 1200,
          height: 630,
          alt: `${mbti} ${cat.title} 가이드`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [`${SITE_URL}/og/mbti-default.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <MBTIDetailClient />;
}

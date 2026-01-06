import "./globals.css";
import type {Metadata} from "next";
import Script from 'next/script';
import {AuthProvider} from "@/components/auth/AuthProvider";
import {AppHeader} from "@/components/layout/AppHeader";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Love-Note";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 관계를 정리하는 AI 가이드`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "MBTI 기반 관계 가이드와 상황별 대화 정리를 제공합니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 관계를 정리하는 AI 가이드`,
    description: "MBTI 기반 관계 가이드와 상황별 대화 정리를 제공합니다.",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <head>
            {/* 1. 구글 애드센스 스크립트 추가 */}
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5936532559612748"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
            {/* Google Tag Manager */}
            {GTM_ID && (
                <Script
                    id="gtm-head"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                              })(window,document,'script','dataLayer','${GTM_ID}');
                            `,
                    }}
                />
            )}
            {/*title은 metadata가 자동 생성함 */}
            {/* <title>러브노트</title> */} 
        </head>
        <body>
            
        {/* GTM noscript */}
        {GTM_ID && (
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                    height="0"
                    width="0"
                    style={{display: 'none', visibility: 'hidden'}}
                />
            </noscript>
        )}
        <AuthProvider>
        <AppHeader />
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}

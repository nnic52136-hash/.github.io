import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import Header from "./components/chrome/Header";
import Footer from "./components/chrome/Footer";
import PageTransition from "./components/chrome/PageTransition";
import DeferredMount from "./components/chrome/DeferredMount";
import SiteLoader from "./components/chrome/SiteLoader";
import CommandPalette from "./components/command-palette/CommandPalette";
import GravityModeLoader from "./components/easter-eggs/GravityModeLoader";
import SmoothScroll from "./components/chrome/SmoothScroll";
import { NowPlayingProvider } from "./components/status/LanyardCards";
import NowPlayingBar from "./components/status/NowPlayingBar";
import SeasonTint from "./components/chrome/SeasonTint";
import NoiseOverlay from "./components/chrome/NoiseOverlay";
import ServiceWorkerRegistration from "./components/chrome/ServiceWorkerRegistration";
import GuestbookSection from "./components/guestbook/GuestbookSection";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SHARE_IMAGE } from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "亞瑟原",
    "Yase",
    "李中原",
    "電子科",
    "自學生",
    "全端開發",
    "個人網站",
  ],
  authors: [{ name: "李中原 / 亞瑟原", url: SITE_URL }],
  creator: "李中原 / 亞瑟原",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        {/* 防止主題亮暗閃爍 (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var t=localStorage.getItem('theme');
  if(t!=='light'&&t!=='dark')t='dark';
  document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();`,
          }}
        />
        {/* 開場 Splash Screen 動畫時序控制 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  function add(c){try{document.body.classList.add(c);}catch(e){}}
  function has(c){try{return document.body.classList.contains(c);}catch(e){return false;}}
  requestAnimationFrame(function(){requestAnimationFrame(function(){add('site-loading');});});
  function schedule(){
    if(document.readyState!=='loading'){setTimeout(function(){add('site-revealing');setTimeout(function(){add('site-revealed');},450);},300);}
    else document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){add('site-revealing');setTimeout(function(){add('site-revealed');},450);},300);});
  }
  schedule();
  setTimeout(function(){if(!has('site-revealing'))add('site-revealing');if(!has('site-revealed'))add('site-revealed');},2000);
})();`,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_TITLE} 雜談`}
          href="/feed.xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;700&family=Shippori+Mincho:wght@500;600;700&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var hrefs=["https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;700&family=Shippori+Mincho:wght@500;600;700&display=swap"];
  var homeFont="https://font.emtech.cc/css/LXGWHeartSerif";
  if(location.pathname==="/"){
    var connect=document.createElement('link');connect.rel='preconnect';connect.href='https://font.emtech.cc';document.head.appendChild(connect);
    var preload=document.createElement('link');preload.rel='preload';preload.as='style';preload.href=homeFont;preload.setAttribute('data-home-quote-font','');document.head.appendChild(preload);
    hrefs.push(homeFont);
  }
  function apply(){hrefs.forEach(function(href){var l=document.createElement('link');l.rel='stylesheet';l.href=href;if(href===homeFont)l.setAttribute('data-home-quote-font','');document.head.appendChild(l);});}
  if('requestIdleCallback' in window) requestIdleCallback(apply); else setTimeout(apply,0);
})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Noto+Serif+TC:wght@400;700&family=Shippori+Mincho:wght@500;600;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://font.emtech.cc/css/LXGWHeartSerif"
          />
        </noscript>
      </head>
      <body>
        {/* JSON-LD 結構化資料：修正為李中原個人身分與社群對應 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_TITLE,
                  alternateName: ["李中原", "亞瑟原", "Yase"],
                  inLanguage: "zh-Hant",
                  description: SITE_DESCRIPTION,
                  publisher: { "@id": `${SITE_URL}/#person` },
                },
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: "李中原",
                  alternateName: ["亞瑟原", "Yase", "豆乾"],
                  url: SITE_URL,
                  image: `${SITE_URL}/assets/brand/avatar.webp`,
                  description: SITE_DESCRIPTION,
                  knowsAbout: [
                    "軟體開發",
                    "人工智能",
                    "網頁開發",
                    "嵌入式系統",
                    "專案管理",
                  ],
                  affiliation: {
                    "@type": "Organization",
                    name: "市立大安高工",
                  },
                  sameAs: [
                    SITE_URL,
                    // 此處可放入你的真實社群連結，例如：
                    // "https://github.com/your-username",
                    // "https://x.com/your-username",
                  ],
                },
              ],
            }),
          }}
        />
        <ThemeProvider>
          <NowPlayingProvider>
            <a className="skip-link" href="#main">
              跳到主要內容
            </a>
            <SiteLoader />
            <Header />
            <main className="main" id="main" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
              <GuestbookSection />
            </main>
            <Footer />
            <DeferredMount name="backToTop" />
            <CommandPalette />
            <GravityModeLoader />
            <SmoothScroll />
            <SeasonTint />
            <NoiseOverlay />
            <DeferredMount name="konami" />
            <DeferredMount name="confetti" />
            <NowPlayingBar />
            <ServiceWorkerRegistration />
          </NowPlayingProvider>
        </ThemeProvider>
        <Script
          src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
          strategy="lazyOnload"
        />
        <Analytics />
      </body>
    </html>
  );
}
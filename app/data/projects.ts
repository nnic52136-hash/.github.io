export interface Project {
  slug: string;
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  href: string;
  cover: string;
  siteUrl?: string;
  longDesc?: string;
  why?: string;
  difficulties?: string;
  demoUrl?: string;
  releaseTimeline?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "yetanotherbusapp",
    kicker: "APP",
    color: "blue",
    title: "YetAnotherBusApp",
    desc: "現代化跨平台公車動態查詢 App",
    why: "等公車最討厭的就是不知道車到底來了沒....我們想要做的是一個開源、高自訂性、介面乾淨、跨平台的查詢工具",
    longDesc:
      "用 Flutter 打造的公車動態查詢 App，支援 Android / iOS 跨平台，提供路線、站牌與到站動態查詢，介面以現代化為目標重新設計",
    tags: ["Flutter", "Dart"],
    releaseTimeline: true,
    icon: "flutter",
    href: "https://github.com/AvianJay/yetanotherbusapp",
    cover: "/assets/projects/YABus.webp",
    siteUrl: "https://busapp.avianjay.sbs/",
  },
];

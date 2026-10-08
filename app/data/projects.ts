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
    slug: "Yase Origin",
    kicker: "網頁",
    color: "blue",
    title: "Yase Origin",
    desc: "紀錄生活跟隨筆的個人網站",
    why: "因為想要看見自己，想要有一個自己的天地",
    longDesc:
      "特別致謝 itouSouta 的主題開源與設計靈感",
    tags: ["nextjs", "css", "typescript"],
    releaseTimeline: true,
    icon: "nextjs",
    href: "https://github.com/nnic52136-hash/.github.io",
    cover: "/assets/projects/Yase Origin.webp",
    siteUrl: "https://github-io-sigma-ten.vercel.app/p",
  },
];

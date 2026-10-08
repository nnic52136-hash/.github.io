export type ExperienceCategory =
  "project" | "organization" | "contest" | "volunteer" | "education";

export interface ExperienceItem {
  // 基礎資訊
  id: string;
  title: string;
  organization?: string; // 組織 / 單位 (例如: "QRACON 籌備團隊")
  role?: string; // 角色 / 職稱 (例如: "行銷組長")

  // 時間設定
  startDate?: string; // "YYYY-MM"
  endDate?: string; // "YYYY-MM" 或 "Present"
  period?: string; // 顯示文字 (例如: "2026.05 - 2026.09")

  // 分類與標籤
  tags?: string[]; // 頂部快速篩選標籤 (例: ["活動籌備", "比賽"])
  color: string; // 色彩主題 ("purple" | "blue" | "green" 等)

  // 內容敘述
  summary?: string; // 卡片摘要 (Hover 展開顯示)
  longDesc?: string; // Modal 彈窗內的完整心得

  // 跳轉模式與資源
  hasDetail?: boolean; // true: 導向 /experience/[slug]，false: 開啟 Modal 彈窗
  slug?: string; // 長文 MDX 檔名 (content/experience/[slug].mdx)
  href?: string; // 外部連結
  images?: string[]; // Modal 彈窗圖片

  // 舊欄位相容 (可選)
  org?: string;
  desc?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "學歷-1",
    title: "宜蘭私立中道雙語小學",
    organization: "國小",
    role: "一~四年級",
    period: "2016.08 - 2020.07",
    tags: ["學歷"],
    color: "purple",
    summary: "夢開始的地方、童年的錨點",
    hasDetail: false,
    longDesc: "補充中....",
    href: "http://www.cdes.ilc.edu.tw/",
    images: ["/assets/experience/scvhoollll.webp"],
  },
  {
    id: "學歷-2",
    title: "新北市蘆洲區仁愛國民小學",
    organization: "國小",
    role: "五~六年級",
    period: "2020.08 - 2022.07",
    tags: ["學歷"],
    color: "purple",
    summary: "夢的翅膀已經受了傷",
    hasDetail: false,
    longDesc: "補充中....",
    href: "https://www.jaes.ntpc.edu.tw/",
    images: ["/assets/experience/unnamed.webp"],
  },
  {
    id: "學歷-3",
    title: "新北市私立格致中學",
    organization: "國中",
    role: "七~九年級",
    period: "2022.08 - 2025.07",
    tags: ["學歷"],
    color: "purple",
    summary: "拉玩了，要不是有幾個白癡在。勉強給到一星，",
    hasDetail: false,
    longDesc: "補充中....",
    href: "https://www.gjsh.ntpc.edu.tw/home",
    images: ["/assets/experience/格致.jpg"],
  },
  {
    id: "學歷-4",
    title: "臺北市立大安高級工業職業學校",
    organization: "高中",
    role: "十年級",
    period: "2025.08 - 2026.07",
    tags: ["學歷"],
    color: "purple",
    summary: "真正開智跟探索的地方，學習的起點",
    hasDetail: false,
    longDesc: "補充中....",
    href: "https://www.taivs.tp.edu.tw/",
    images: ["/assets/experience/大安.jpg"],
  },
  {
    id: "學歷-5",
    title: "大安高工休學生/教育局自學生",
    organization: "高中",
    role: "十一年級",
    period: "2026.08 - Now",
    tags: ["學歷"],
    color: "purple",
    summary: "走自己的路",
    hasDetail: false,
  },
  {
    id: "exp-2",
    title: "QRACON 2026 行銷組",
    organization: "QRACON 籌備團隊",
    role: "組長",
    period: "2026.05 - Now",
    tags: ["活動籌備"],
    color: "purple",
    summary:
      "負責 QRACON 2026 全盤行銷策略、社群文案與薛丁格的貓主題視覺企劃。",
    hasDetail: true,
    slug: "qracon-2026",
  },
  {
    id: "exp-1",
    title: "Hackit Campfire ",
    organization: "社群",
    role: "參與核心籌備",
    period: "2025.12 - 2026.02.28",
    tags: ["活動籌備", "社群"],
    color: "blue",
    summary: "學會為自己而活的地方，找一天認真寫篇文吧",
    hasDetail: false,
    longDesc:
      "主要負責 社群公關、宣傳曝光、贊助對接、任務安排、跨組溝通、工具人",
    href: "https://www.instagram.com/p/DTt_e4JkU6I/",
    images: ["/assets/experience/Campfire.png"],
  },
  {
    id: "exp-3",
    title: "大安電資",
    organization: "大安高工",
    role: "公關長",
    period: "2026.07 - 2026.09",
    tags: ["組織&社團"],
    color: "purple",
    summary: "負責公關。",
    hasDetail: true,
    slug: "dacsssc",
  },
];

export const EXPERIENCE = EXPERIENCES;

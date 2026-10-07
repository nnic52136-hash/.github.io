export type ExperienceCategory = 'project' | 'organization' | 'contest' | 'volunteer' | 'education';

export interface ExperienceItem {
  // 基礎資訊
  id: string;
  title: string;
  organization?: string;     // 組織 / 單位 (例如: "QRACON 籌備團隊")
  role?: string;             // 角色 / 職稱 (例如: "行銷組長")

  // 時間設定
  startDate?: string;        // "YYYY-MM"
  endDate?: string;          // "YYYY-MM" 或 "Present"
  period?: string;           // 顯示文字 (例如: "2026.05 - 2026.09")

  // 分類與標籤
  tags?: string[];           // 頂部快速篩選標籤 (例: ["活動籌備", "比賽"])
  color: string;             // 色彩主題 ("purple" | "blue" | "green" 等)

  // 內容敘述
  summary?: string;          // 卡片摘要 (Hover 展開顯示)
  longDesc?: string;         // Modal 彈窗內的完整心得

  // 跳轉模式與資源
  hasDetail?: boolean;       // true: 導向 /experience/[slug]，false: 開啟 Modal 彈窗
  slug?: string;             // 長文 MDX 檔名 (content/experience/[slug].mdx)
  href?: string;             // 外部連結
  images?: string[];         // Modal 彈窗圖片

  // 舊欄位相容 (可選)
  org?: string;
  desc?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-2",
    title: "QRACON 2026 行銷組",
    organization: "QRACON 籌備團隊",
    role: "組長",
    period: "2026.05 - Now",
    tags: ["活動籌備"],
    color: "purple",
    summary: "負責 QRACON 2026 全盤行銷策略、社群文案與薛丁格的貓主題視覺企劃。",
    hasDetail: true,
    slug: "qracon-2026",
  },
  {
    id: "exp-1",
    title: "FRC Team 8585 公關長",
    organization: "大安高工",
    role: "公關長",
    period: "2026.04 - Now",
    tags: ["組織&社團"],
    color: "blue",
    summary: "贊助企劃書撰寫與企業對接。",
    hasDetail: false,
    longDesc: "負責 FRC Team 8585 的對外公關，撰寫贊助企劃書並向廠商進行 Pitch。",
    href: "https://github.com",
    images: ["/assets/projects/itousouta15.webp"],
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
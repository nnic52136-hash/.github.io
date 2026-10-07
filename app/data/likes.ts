// app/data/likes.ts (或你專案中對應的資料檔)

// 1. 定義分類型別與資料規格 (Schema)
export type LikeCategoryKey = 'books' | 'singers' | 'movies' | 'spots' | 'anime' | 'vtuber';

// 新版標準型別
export interface LikeItem {
  id: string;
  category: LikeCategoryKey;
  title: string;             // 書名 / 歌手 / 電影 / 展覽景點 / 動畫
  subtitle?: string;         // 作者 / 推薦歌曲 / 導演 / 地點
  coverImage: string;        // 封面照路徑 (例如: /assets/likes/books/atomic-habits.webp)
  rating?: number;           // 星級 (1-5)
  tags: string[];
  summary: string;           // 一句話心得
  hasDetail: boolean;        // true 代表有長文 MDX，點擊進入內頁
  slug?: string;             // 對應 content/likes/[category]/[slug].mdx
  externalUrl?: string;      // 外部連結 (如 Spotify, 博客來)
}

// 舊版相容介面 (修正 layout 型別擴充)
export interface Like {
  id?: string;
  category?: string;
  title: string;
  sub?: string;
  cover?: string;
  coverImage?: string;
  href?: string;
  channelId?: string;
  tags?: string[];
  personRating?: number;
  note?: string;
  hasDetail?: boolean;
  slug?: string;
  summary?: string;
  subtitle?: string;
}

export interface LikeCategory {
  key: string;
  label: string;
  en: string;
  layout: 'circle' | 'square' | 'portrait' | 'landscape'; // 👈 關鍵修正：加入 'portrait'
  items: Like[];
}

// 將新版 LikeItem 轉譯為舊版 Like 介面的相容轉換函式
const normalizeLike = (item: LikeItem): Like => ({
  ...item,
  category: item.category,
  cover: item.coverImage,
  coverImage: item.coverImage,
  sub: item.subtitle,
  href: item.externalUrl,
  channelId: undefined,
  note: item.summary,
  personRating: item.rating,
  tags: item.tags,
  summary: item.summary,
  subtitle: item.subtitle,
  slug: item.slug,             // 確保 slug 正確傳遞
  hasDetail: item.hasDetail,   // 確保 hasDetail 正確傳遞
});

// 2. 導出實際資料陣列 (所有資料統一新增在這裡)
export const LIKES: LikeItem[] = [
  {
    id: "book-1",
    category: "books",
    title: "原子習慣",
    subtitle: "James Clear",
    coverImage: "/assets/likes/books/atomic-habits.webp",
    rating: 5,
    tags: ["自我提升", "習慣養成"],
    summary: "細微改變帶來巨大成就，極度實用的習慣塑造指南。",
    hasDetail: true,
    slug: "atomic-habits",
  },
  {
    id: "singer-1",
    category: "singers",
    title: "ヨルシカ (Yorushika)",
    subtitle: "n-buna / suis",
    coverImage: "/assets/likes/singers/yorushika.webp",
    rating: 5,
    tags: ["J-Pop", "Rock"],
    summary: "充滿文學感與夏日哀愁感的樂團，歌詞極具感染力。",
    hasDetail: false,
    externalUrl: "https://youtu.be/F64yFFnZfkI",
  },
  {
    id: "movie-green-book",
    category: "movies",
    title: "幸福綠皮書",
    subtitle: "Peter Farrelly",
    coverImage: "/assets/likes/movies/green-book.webp", // 👈 封面圖放置路徑
    rating: 5,
    tags: ["電影", "劇情", "真事改編"],
    summary: "跨越種族與偏見的真摯友誼，兼具幽默與深刻思考的經典好片。",
    hasDetail: true,                                    // 👈 設定為 true，點擊可看長文
    slug: "green-book"                                // 👈 對應 MDX 檔名
  },
  {
    id: "spot-tft-2026",
    category: "spots",
    title: "TFT 2026 有感節",
    subtitle: "Teach For Taiwan",
    coverImage: "/assets/likes/spots/tft-2026.webp",   // 👈 封面圖放置路徑
    rating: 5,
    tags: ["展覽", "教育", "公益"],
    summary: "探討台灣教育不平等與社會創新的年度有感展覽。",
    hasDetail: true,                                   // 👈 設定為 false，若暫無內頁文章
    slug: "tft-2026"  // 外連官網（可選）
  },
];

// 同步導出 LIKES_DATA（別名相容，解決遺漏 member 報錯）
export const LIKES_DATA = LIKES;

// 3. 導出分類地圖 (所有分類自動從 LIKES 陣列過濾並轉譯)
export const LIKE_CATEGORIES: LikeCategory[] = [
  {
    key: "books",
    label: "書籍與閱讀",
    en: "BOOKS",
    layout: "portrait", // 👈 直向海報 2:3 比例
    items: LIKES.filter((item) => item.category === "books").map(normalizeLike),
  },
  {
    key: "movies",
    label: "電影與影集",
    en: "MOVIES",
    layout: "portrait", // 👈 直向海報 2:3 比例
    items: LIKES.filter((item) => item.category === "movies").map(normalizeLike),
  },
  {
    key: "singers",
    label: "歌手與音樂",
    en: "SINGERS",
    layout: "square",   // 👈 正方形 1:1 專輯比例
    items: LIKES.filter((item) => item.category === "singers").map(normalizeLike),
  },
  {
    key: "spots",
    label: "展覽與景點",
    en: "SPOTS",
    layout: "portrait",   // 👈 正方形比例
    items: LIKES.filter((item) => item.category === "spots").map(normalizeLike),
  },
];
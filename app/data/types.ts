// app/data/types.ts

// 1. 部落格文章 Schema
export interface PostMetadata {
  slug: string;
  title: string;
  date: string;               // 格式: "YYYY-MM-DD"
  description: string;
  category: string;           // 例: "技術探索" | "生活隨筆" | "自學紀錄"
  tags: string[];
  cover?: string;
  published: boolean;
}

// 2. 四大類別收藏 Schema
export type LikeCategory = 'books' | 'singers' | 'movies' | 'spots';

export interface LikeItem {
  id: string;
  category: LikeCategory;
  title: string;              // 書名 / 歌手名 / 電影名 / 展覽景點名
  subtitle?: string;          // 作者 / 推薦歌曲 / 導演 / 地點
  coverImage: string;
  rating?: number;            // 1~5 星級
  tags: string[];
  summary: string;            // 一句話心得短評
  hasDetail: boolean;         // true 則點擊進入 MDX 詳細頁
  slug?: string;              // 對應 content/likes/[category]/[slug].mdx
  externalUrl?: string;       // 外部連結 (如 Spotify, 博客來)
}

// 3. 經歷 (時間軸/日曆) Schema
export interface ExperienceItem {
  id: string;
  title: string;              // 專案 / 職位名稱
  organization: string;       // 組織 / 單位名稱
  role: string;               // 角色描述
  startDate: string;          // 格式: "YYYY-MM"
  endDate?: string;           // 格式: "YYYY-MM" 或 "Present"
  category: 'project' | 'organization' | 'contest' | 'volunteer';
  color: string;              // 日曆色塊顏色 (十六進制，如 "#3B82F6")
  summary: string;
  hasDetail: boolean;
  slug?: string;              // 對應 content/experience/[slug].mdx
}
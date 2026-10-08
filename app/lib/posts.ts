import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  cover?: string;
  tags: string[];
  category?: string;
  series?: string;
  seriesOrder?: number;
  wordCount: number;
  readingTime: number;
  content: string;
  likesCount?: number; // 👈 支援按讚數型別
}

export type PostSummary = Omit<Post, "content">;

// 1. 精準字數計算（中文字算 1 字，英文/數字區塊每個算 1 字）
function calculateReadingStats(content: string) {
  const cleanContent = content
    .replace(/---[\s\S]*?---/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*>\-_|~[\]()!:]/g, " ");

  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const nonChinese = cleanContent.replace(/[\u4e00-\u9fa5]/g, " ");
  const words = nonChinese.trim() ? nonChinese.trim().split(/\s+/) : [];

  const totalWords = chineseChars + words.length;
  const readingTime = Math.max(1, Math.ceil(totalWords / 350));

  return { wordCount: totalWords, readingTime };
}

function sanitizeCoverPath(cover: string | undefined): string {
  if (!cover) return "";
  let cleanPath = cover.replace(/\\/g, "/");
  if (cleanPath.startsWith("public/")) {
    cleanPath = cleanPath.replace(/^public\//, "/");
  }
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }
  return cleanPath;
}

function formatDate(rawDate: any): string {
  if (!rawDate) return "2026-01-01";
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return String(rawDate);
  return d.toISOString().split("T")[0];
}

// 取得所有文章
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);

  const allPosts = fileNames
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      return getPostBySlug(slug);
    })
    .filter((post): post is Post => post !== null);

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 2. 供單篇文章內頁 (`/writing/[slug]`) 使用的單篇讀取函式
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPathMdx = path.join(postsDirectory, `${slug}.mdx`);
    const fullPathMd = path.join(postsDirectory, `${slug}.md`);

    let fullPath = "";
    if (fs.existsSync(fullPathMdx)) fullPath = fullPathMdx;
    else if (fs.existsSync(fullPathMd)) fullPath = fullPathMd;
    else return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const stats = calculateReadingStats(content);

    const fallbackSummary = content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/#|>|\*|_|`|\[.*?\]\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);

    const rawCover = data.cover || data.image || data.thumbnail;

    return {
      slug,
      title: data.title || slug,
      summary:
        data.summary ||
        data.description ||
        (fallbackSummary ? `${fallbackSummary}...` : "暫無文章摘要"),
      date: formatDate(data.date),
      cover: sanitizeCoverPath(rawCover),
      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags
          ? [String(data.tags)]
          : [],
      category: data.category || "未分類",
      series: data.series || null,
      seriesOrder: Number(data.seriesOrder) || 0,
      wordCount: stats.wordCount,
      readingTime: stats.readingTime,
      content,
      likesCount: Number(data.likesCount) || 0, // 👈 確保每篇文章都有預設按讚數
    };
  } catch {
    return null;
  }
}

export function getPostSummaries(): PostSummary[] {
  return getAllPosts().map(({ content, ...summary }) => summary);
}

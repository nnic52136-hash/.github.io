import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 根內容目錄常數定義
const CONTENT_PATH = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_PATH, "posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  category?: string;
  excerpt?: string;
  content: string;
  published?: boolean;
}

/**
 * 取得所有已發布的 MDX 部落格文章列表（按日期倒序排序）
 */
export async function getPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR);
  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        category: data.category || "未分類",
        excerpt: data.excerpt || data.description || "",
        content,
        published: data.published ?? true,
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * 依據 slug 取得單篇部落格文章
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * 通用函式：依據子目錄（及可選類別）與 slug 讀取 MDX 內文與 Frontmatter
 */
export async function getMdxBySlug(
  subDir: string,
  slug: string,
  category?: string
) {
  const targetDir = category
    ? path.join(CONTENT_PATH, subDir, category)
    : path.join(CONTENT_PATH, subDir);
  const filePath = path.join(targetDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    frontmatter: data,
    content,
  };
}

/**
 * 讀取 content/likes/[category]/[slug].mdx 檔案 (相容舊元件)
 */
export async function getLikePost(category: string, slug: string) {
  return getMdxBySlug("likes", slug, category);
}

/**
 * 讀取 content/experience/[slug].mdx 檔案 (相容舊元件)
 */
export async function getExperiencePost(slug: string) {
  return getMdxBySlug("experience", slug);
}

/**
 * 抓取指定資料夾（及可選子分類）下所有 MDX 檔案的 Metadata 列表（自動過濾草稿並按日期排序）
 */
export async function getAllMdxMeta<T = any>(
  subDir: string,
  category?: string
): Promise<T[]> {
  const targetDir = category
    ? path.join(CONTENT_PATH, subDir, category)
    : path.join(CONTENT_PATH, subDir);

  if (!fs.existsSync(targetDir)) return [];

  const files = fs.readdirSync(targetDir);

  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(targetDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        slug,
        category: category || data.category,
        ...data,
      } as T;
    })
    .filter((post: any) => post.published !== false);

  return posts.sort((a: any, b: any) => {
    const dateA = new Date(a.date || a.startDate || "1970-01-01").getTime();
    const dateB = new Date(b.date || b.startDate || "1970-01-01").getTime();
    return dateB - dateA;
  });
}

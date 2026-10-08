import { getAllPosts } from "../../lib/posts";

/* Cmd+K 搜尋索引：本地 Writing 文章列表。
   改成從本地 lib/posts 載入文章資料，確保與專案架構一致。 */

export interface RemoteSearchItem {
  id: string;
  title: string;
  sub?: string;
  href: string;
  external?: boolean;
  category: string;
}

export async function GET() {
  const posts = getAllPosts();

  const items: RemoteSearchItem[] = posts
    .map((post, index) => ({
      id: post.slug || `writing-${index}`,
      title: post.title,
      sub: post.summary || post.date || "",
      href: `/writing/${post.slug}`,
      external: false,
      category: "文章",
    }))
    .filter((item) => item.title && item.title.trim() !== "");

  return Response.json({ items });
}

import type { MetadataRoute } from "next";
import { LIKE_CATEGORIES } from "./data";
import { getAllPosts } from "./lib/posts";
import { SITE_URL } from "./lib/seo";

/* 靜態路由刻意不給 lastModified：內容跟著 data.ts 走，只有重新部署才會變，
   填 new Date() 等於每次抓 sitemap 都宣稱「剛剛改過」——沒訊號還不如省略。
   文章路由則根據文章的實際日期給予 lastModified。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/api",
    "/experience",
    "/likes",
    "/links",
    "/projects",
  ];

  const likeCategoryRoutes = LIKE_CATEGORIES.map((cat) => `/likes/${cat.key}`);

  // 從本地 lib/posts 取得所有文章
  const posts = getAllPosts();

  // 計算最新文章的發布時間，給予 /writing 列表頁
  const newestPostTimestamp = posts.reduce((max, p) => {
    const postTime = p.date ? new Date(p.date).getTime() : 0;
    return Math.max(max, isNaN(postTime) ? 0 : postTime);
  }, 0);

  // 為每一篇文章建立動態路由條目
  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    ...(post.date ? { lastModified: new Date(post.date) } : {}),
  }));

  return [
    // 1. 靜態頁面與 Like 分類頁
    ...[...staticRoutes, ...likeCategoryRoutes].map((path) => ({
      url: `${SITE_URL}${path}`,
    })),

    // 2. 文章列表主頁 (/writing)
    {
      url: `${SITE_URL}/writing`,
      ...(newestPostTimestamp
        ? { lastModified: new Date(newestPostTimestamp) }
        : {}),
    },

    // 3. 所有單篇文章頁面 (/writing/[slug])
    ...postRoutes,
  ];
}

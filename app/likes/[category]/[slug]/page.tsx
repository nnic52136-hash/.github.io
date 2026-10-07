import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { LIKES } from "../../../data/likes";
import { getLikePost } from "../../../lib/mdx";
import { pageMetadata } from "../../../lib/seo";

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

// 四大分類中文名稱映照表
const CATEGORY_LABEL: Record<string, string> = {
  books: "書籍閱讀",
  singers: "音樂歌手",
  movies: "影視作品",
  spots: "展覽景點",
};

// 1. 預先生成所有 hasDetail === true 的 SSG 靜態路由
export async function generateStaticParams() {
  return LIKES.filter((item) => item.hasDetail && item.slug).map((item) => ({
    category: item.category,
    slug: item.slug!,
  }));
}

// 2. 動態產生 SEO 元資料
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = LIKES.find(
    (i) => i.category === params.category && i.slug === params.slug
  );
  if (!item) return {};

  const categoryName = CATEGORY_LABEL[params.category] || "收藏";
  return pageMetadata({
    title: `${item.title} - ${categoryName}`,
    description: item.summary || `${item.title} 的詳細心得與紀錄`,
    path: `/likes/${params.category}/${params.slug}`,
  });
}

// 3. 頁面主體渲染
export default async function LikeDetailPage({ params }: Props) {
  const { category, slug } = params;

  // 尋找 static data 裡的基本資料
  const item = LIKES.find((i) => i.category === category && i.slug === slug);
  if (!item || !item.hasDetail) {
    notFound();
  }

  // 尋找 content/likes/[category]/[slug].mdx 內文檔
  const postData = await getLikePost(category, slug);
  if (!postData) {
    notFound();
  }

  // 星級渲染輔助（例如: 5 星 -> ★★★★★）
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <article className="like-detail-container">
      {/* 返回按鈕 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/likes" style={{ opacity: 0.7, textDecoration: "none" }}>
          ← 返回所有收藏列表
        </Link>
      </div>

      {/* 標題與元資料區 */}
      <header className="like-detail-header" style={{ marginBottom: "2rem" }}>
        <div className="thought-meta" style={{ marginBottom: "0.5rem" }}>
          <span className="thought-tag">
            {CATEGORY_LABEL[category] || category}
          </span>
          {item.rating && (
            <span style={{ color: "#f59e0b", marginLeft: "0.5rem" }}>
              {renderStars(item.rating)}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0.5rem 0" }}>
          {item.title}
        </h1>

        {item.subtitle && (
          <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "0.5rem" }}>
            {item.subtitle}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            {item.tags.map((tag) => (
              <span key={tag} className="thought-tag" style={{ opacity: 0.8 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 一句話短評引言區（使用專案現有 thought-item 樣式） */}
      {item.summary && (
        <div
          className="thought-item"
          style={{
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
            borderLeft: "4px solid var(--accent, #3b82f6)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <p style={{ margin: 0, fontStyle: "italic", opacity: 0.9 }}>
            「{item.summary}」
          </p>
        </div>
      )}

      <div className="divider" style={{ marginBottom: "2rem" }} />

      {/* MDX 心得內文渲染 */}
      <div className="post-content markdown-body">
        <MDXRemote source={postData.content} />
      </div>
    </article>
  );
}
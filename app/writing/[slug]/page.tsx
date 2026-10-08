import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Guestbook from "../../components/guestbook/Guestbook";
import WritingReaction from "../../components/writing/WritingReaction";
import { getPostBySlug } from "../../lib/posts";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const postPath = `/writing/${resolvedParams.slug}`;

  return (
    <article className="post-container">
      {/* 乾淨優雅的 RWD 樣式定義 */}
      <style>{`
        .post-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* --- 桌面端佈局 (雙欄) --- */
        .post-layout-grid {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 48px;
          align-items: start;
        }

        .post-meta-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          border-radius: 12px;
          background: var(--panel, rgba(255, 255, 255, 0.03));
          border: 1px solid var(--bd, rgba(255, 255, 255, 0.08));
          position: sticky;
          top: 24px;
        }

        .meta-item-label {
          font-size: 0.75rem;
          color: var(--dim);
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: 0.02em;
        }

        .meta-item-val {
          font-size: 0.88rem;
          color: var(--tx);
        }

        /* --- 手機端佈局 (≤ 768px)：自然流動橫向排列 --- */
        @media (max-width: 768px) {
          .post-layout-grid {
            display: flex;
            flex-direction: column;
            gap: 28px;
          }

          .post-meta-sidebar {
            position: static;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px 20px;
            padding: 16px 18px;
            border-radius: 10px;
          }

          .post-meta-sidebar .meta-divider {
            display: none;
          }

          .meta-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .meta-item-label {
            margin-bottom: 0;
            display: inline-block;
          }
        }
      `}</style>

      {/* 頂部返回連結 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/writing"
          style={{
            opacity: 0.7,
            textDecoration: "none",
            fontSize: "0.88rem",
            color: "var(--tx)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "opacity 0.2s",
          }}
        >
          ← 返回文章列表
        </Link>
      </div>

      {/* 主版面 */}
      <div className="post-layout-grid">
        {/* =================================================================
           文章後設資訊欄 (桌面端左側邊欄 / 行動端頂部橫向流體欄)
           ================================================================= */}
        <aside className="post-meta-sidebar">
          {/* 1. 發布時間 */}
          <div className="meta-group">
            <div className="meta-item-label">發布時間</div>
            <div className="meta-item-val" style={{ fontWeight: 600 }}>
              {post.date}
            </div>
          </div>

          {/* 2. 文章分類 */}
          {post.category && (
            <div className="meta-group">
              <div className="meta-item-label">分類</div>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: "var(--inset, rgba(255, 255, 255, 0.06))",
                    fontSize: "0.8rem",
                    color: "var(--tx)",
                    border: "1px solid var(--bd, rgba(255, 255, 255, 0.1))",
                  }}
                >
                  {post.category}
                </span>
              </div>
            </div>
          )}

          {/* 3. 文章數據 */}
          <div className="meta-group">
            <div className="meta-item-label">數據</div>
            <div
              className="meta-item-val"
              style={{ fontSize: "0.82rem", opacity: 0.85 }}
            >
              {post.wordCount || 0} 字 · {post.readingTime || 1} 分鐘
            </div>
          </div>

          {/* 4. 文章標籤 */}
          {post.tags && post.tags.length > 0 && (
            <div className="meta-group">
              <div className="meta-item-label">標籤</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "var(--inset, rgba(255, 255, 255, 0.04))",
                      color: "var(--dim)",
                      border: "1px solid var(--bd, rgba(255, 255, 255, 0.06))",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="meta-divider"
            style={{
              height: "1px",
              background: "var(--bd, rgba(255, 255, 255, 0.08))",
              margin: "4px 0",
            }}
          />

          {/* 5. 文章互動按鈕 */}
          <div className="meta-group" style={{ alignItems: "center" }}>
            <WritingReaction
              id={resolvedParams.slug}
              initialCount={post.likesCount || 0}
              size="md"
            />
          </div>
        </aside>

        {/* =================================================================
           右側主內容：大標題 -> 純文字前言 -> MDX 內文
           ================================================================= */}
        <main
          className="post-main-content"
          style={{ minWidth: 0, width: "100%" }}
        >
          {/* 大標題 */}
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 800,
              lineHeight: 1.3,
              margin: "0 0 16px 0",
              color: "var(--tx)",
              letterSpacing: "-0.01em",
            }}
          >
            {post.title}
          </h1>

          {/* 純文字前言 (已完全移除背景框與邊框) */}
          {post.summary && (
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--dim)",
                margin: "0 0 24px 0",
              }}
            >
              {post.summary}
            </p>
          )}

          <div
            style={{
              height: "1px",
              background: "var(--bd, rgba(255, 255, 255, 0.08))",
              marginBottom: "28px",
            }}
          />

          {/* MDX 內文 */}
          <div className="post-content markdown-body">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>

          {/* 留言板 */}
          <div
            style={{
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--bd, rgba(255, 255, 255, 0.08))",
            }}
          >
            <Guestbook path={postPath} />
          </div>
        </main>
      </div>
    </article>
  );
}

// app/experience/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllMdxMeta, getMdxBySlug } from "../../lib/mdx";
import { pageMetadata } from "../../lib/seo";
import { ExperienceItem } from "../../data/types";

interface Props {
  params: { slug: string };
}

// 預先產生靜態 SSG 頁面
export async function generateStaticParams() {
  const experiences = await getAllMdxMeta<ExperienceItem>("experience");
  return experiences
    .filter((i) => i.hasDetail && i.slug)
    .map((i) => ({ slug: i.slug! }));
}

// 動態 SEO Metadata 產生
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getMdxBySlug("experience", params.slug);
  if (!item) return {};

  return pageMetadata({
    title: `${item.frontmatter.title} - 經歷紀錄`,
    description: item.frontmatter.summary || `${item.frontmatter.title} 的詳細紀錄`,
    path: `/experience/${params.slug}`,
  });
}

export default async function ExperienceDetailPage({ params }: Props) {
  // 從 MDX 解析工具讀取檔案
  const item = await getMdxBySlug("experience", params.slug);
  if (!item) notFound();

  const { frontmatter, content } = item;

  return (
    <article className="post-container">
      {/* 頂部返回導覽 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/experience" style={{ opacity: 0.7, textDecoration: "none", fontSize: "0.9rem" }}>
          ← 返回經歷總覽
        </Link>
      </div>

      {/* 文章標頭（動態渲染分類與多個標籤） */}
      <header style={{ marginBottom: "2rem" }}>
        <div className="thought-meta" style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* 預設分類或標籤 */}
          <span className="thought-tag">{frontmatter.category || "經歷"}</span>
          
          {/* 動態渲染前端帶入的 tags 陣列：新增什麼標籤，這裡就會跟著新增什麼！ */}
          {frontmatter.tags && frontmatter.tags.map((tag: string, index: number) => (
            <span key={index} className="thought-tag" style={{ backgroundColor: "rgba(128, 128, 128, 0.15)" }}>
              {tag}
            </span>
          ))}

          <span className="thought-date" style={{ marginLeft: "auto" }}>
            {frontmatter.startDate} {frontmatter.endDate ? `~ ${frontmatter.endDate}` : ""}
          </span>
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>
          {frontmatter.title}
        </h1>
        {frontmatter.organization && (
          <p style={{ opacity: 0.8, fontSize: "1.1rem" }}>
            {frontmatter.organization} {frontmatter.role ? `· ${frontmatter.role}` : ""}
          </p>
        )}
      </header>

      <div className="divider" style={{ marginBottom: "2rem" }} />

      {/* MDX 內文渲染區 */}
      <div className="post-content markdown-body">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
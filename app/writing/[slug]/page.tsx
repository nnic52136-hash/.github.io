import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Guestbook from "@/app/components/guestbook/Guestbook";
import { getAllPosts, getPostBySlug } from "@/app/lib/posts";
import { pageMetadata } from "@/app/lib/seo";

interface Props {
  params: {
    slug: string;
  };
}

// 1. 產生靜態頁面路由
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. 自動生成動態文章的 SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.summary || `${post.title} - 亞瑟原的隨筆文章`,
    path: `/writing/${params.slug}`,
  });
}

// 3. 文章頁面主要組件
export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // 為每一篇文章定義專屬的留言板 key
  const postPath = `/writing/${params.slug}`;

  return (
    <article className="post-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/writing" style={{ opacity: 0.7, textDecoration: "none" }}>
          ← 返回文章列表
        </Link>
      </div>

      <header className="post-header" style={{ marginBottom: "2rem" }}>
        <div
          className="thought-meta"
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className="thought-date">{post.date}</span>
          {post.category && <span className="thought-tag">{post.category}</span>}
          <span>・ {post.wordCount} 字</span>
          <span>・ 閱讀 {post.readingTime} 分鐘</span>
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>
          {post.title}
        </h1>

        {post.summary && (
          <p style={{ opacity: 0.8, fontSize: "1.05rem", lineHeight: 1.6, marginTop: "0.5rem" }}>
            {post.summary}
          </p>
        )}
      </header>

      <div className="divider" style={{ marginBottom: "2rem" }} />

      {/* MDX 內文渲染區 */}
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

      {/* 文章獨立留言區：直接調用 Guestbook，不受 GuestbookSection 白名單攔截 */}
      <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <Guestbook path={postPath} />
      </div>
    </article>
  );
}
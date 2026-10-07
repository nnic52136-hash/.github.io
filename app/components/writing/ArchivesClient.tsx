"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PostItem } from "./WritingClient";

export default function ArchivesClient({ posts }: { posts: PostItem[] }) {
  // 按年份分組文章
  const archivesByYear = useMemo(() => {
    const map: Record<string, PostItem[]> = {};

    posts.forEach((post) => {
      const year = post.date ? post.date.substring(0, 4) : "未分類";
      if (!map[year]) map[year] = [];
      map[year].push(post);
    });

    // 年份由新到舊排序
    return Object.entries(map).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [posts]);

  return (
    <div style={{ marginTop: "24px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/writing" style={{ color: "var(--dim)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← 返回文章列表
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {archivesByYear.map(([year, yearPosts]) => (
          <div key={year}>
            {/* 年份大標題 */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                borderBottom: "1px solid var(--bd)",
                paddingBottom: "8px",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                {year}
              </h2>
              <span style={{ fontSize: "0.85rem", color: "var(--dim)" }}>({yearPosts.length} 篇)</span>
            </div>

            {/* 精簡時間線文章列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "8px" }}>
              {yearPosts.map((post) => {
                const monthDay = post.date ? post.date.substring(5) : "";

                return (
                  <Link
                    key={post.slug}
                    href={`/writing/${post.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      textDecoration: "none",
                      color: "inherit",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      transition: "background 0.15s ease",
                    }}
                    className="archive-item-hover"
                  >
                    <time
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.88rem",
                        color: "var(--dim)",
                        flexShrink: 0,
                        width: "55px",
                      }}
                    >
                      {monthDay}
                    </time>

                    <span
                      style={{
                        fontSize: "1.02rem",
                        fontWeight: 500,
                        color: "var(--tx)",
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </span>

                    {post.category && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "var(--inset)",
                          color: "var(--dim)",
                          flexShrink: 0,
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .archive-item-hover:hover {
          background: var(--inset);
        }
      `}</style>
    </div>
  );
}
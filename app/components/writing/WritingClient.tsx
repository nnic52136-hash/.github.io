"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface PostItem {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  summary?: string;
  cover?: string;
  category?: string;
  tags?: string[];
  series?: string;
  seriesOrder?: number;
  wordCount?: number;
  readingTime?: number;
}

export default function WritingClient({ posts }: { posts: PostItem[] }) {
  const [viewMode, setViewMode] = useState<"timeline" | "folder">("timeline");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null); // 格式 YYYY-MM
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 1. 統計所有「分類」與文章數量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // 2. 統計所有「標籤」與文章數量
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // 3. 統計「月份彙整」（例如：2026年 06月）
  const monthlyArchives = useMemo(() => {
    const map: Record<string, { label: string; key: string; count: number }> = {};
    posts.forEach((post) => {
      if (post.date && post.date.length >= 7) {
        const yearMonthKey = post.date.substring(0, 7); // e.g. "2026-06"
        const [y, m] = yearMonthKey.split("-");
        const label = `${y} 年 ${m} 月`;
        if (!map[yearMonthKey]) {
          map[yearMonthKey] = { label, key: yearMonthKey, count: 0 };
        }
        map[yearMonthKey].count += 1;
      }
    });
    return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
  }, [posts]);

  // 4. 多重條件過濾文章清單
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory = selectedCategory ? post.category === selectedCategory : true;
      const matchTag = selectedTag ? post.tags?.includes(selectedTag) : true;
      const matchMonth = selectedMonth ? post.date?.startsWith(selectedMonth) : true;
      const matchSearch = searchQuery
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.summary || post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchCategory && matchTag && matchMonth && matchSearch;
    });
  }, [posts, selectedCategory, selectedTag, selectedMonth, searchQuery]);

  // 5. 系列資料夾整理 (Folder View)
  const seriesMap = useMemo(() => {
    const map: Record<string, PostItem[]> = {};
    const unassigned: PostItem[] = [];

    filteredPosts.forEach((post) => {
      if (post.series) {
        if (!map[post.series]) map[post.series] = [];
        map[post.series].push(post);
      } else {
        unassigned.push(post);
      }
    });

    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
    });

    if (unassigned.length > 0) {
      map["隨筆與單篇創作"] = unassigned;
    }

    return map;
  }, [filteredPosts]);

  // 清除所有過濾條件
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSelectedMonth(null);
    setSearchQuery("");
  };

  const hasActiveFilter = selectedCategory || selectedTag || selectedMonth || searchQuery;

  return (
    <div style={{ width: "100%", maxWidth: "1160px", margin: "0 auto", padding: "0 16px" }}>
      {/* 響應式雙欄佈局：左側側邊欄、右側主要內容區 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "36px",
          alignItems: "start",
        }}
        className="writing-layout-container"
      >
        {/* =================================================================
           左側邊欄 (Sidebar)：分類、標籤雲、彙整
           ================================================================= */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "sticky",
            top: "24px",
          }}
          className="writing-left-sidebar"
        >
          {/* 搜尋框與清除篩選 */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "var(--panel)",
              border: "1px solid var(--bd)",
            }}
          >
            <input
              type="text"
              placeholder="搜尋文章關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--inset)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
                fontSize: "0.88rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "6px 0",
                  borderRadius: "6px",
                  background: "var(--inset)",
                  border: "1px solid var(--bd)",
                  color: "var(--blue)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                重設所有篩選條件
              </button>
            )}
          </div>

          {/* 1. 分類 (Categories) */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "var(--panel)",
              border: "1px solid var(--bd)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--tx)",
                marginBottom: "12px",
                letterSpacing: "0.08em",
                borderBottom: "1px solid var(--bd)",
                paddingBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              分類
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {categoryCounts.length === 0 ? (
                <div style={{ fontSize: "0.82rem", color: "var(--dim)" }}>尚無分類</div>
              ) : (
                categoryCounts.map(([cat, count]) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(active ? null : cat)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background: active ? "var(--inset)" : "transparent",
                        color: active ? "var(--blue)" : "var(--dim)",
                        fontWeight: active ? 600 : 400,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>{cat}</span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          background: "var(--inset)",
                          color: "var(--dim)",
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. 標籤雲 (Tag Cloud) */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "var(--panel)",
              border: "1px solid var(--bd)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--tx)",
                marginBottom: "12px",
                letterSpacing: "0.08em",
                borderBottom: "1px solid var(--bd)",
                paddingBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              標籤雲
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {tagCounts.map(([tag, count]) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={`cloud-${tag}`}
                    onClick={() => setSelectedTag(active ? null : tag)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      border: "1px solid",
                      borderColor: active ? "var(--blue)" : "var(--bd)",
                      background: active ? "var(--blue)" : "var(--inset)",
                      color: active ? "var(--btntx, #000)" : "var(--tx)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    #{tag} <span style={{ opacity: 0.65, fontSize: "0.7rem" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 彙整 (Monthly Archives) */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "var(--panel)",
              border: "1px solid var(--bd)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                borderBottom: "1px solid var(--bd)",
                paddingBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--tx)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                文章彙整
              </span>
              <Link
                href="/archives"
                style={{ fontSize: "0.75rem", color: "var(--purple)", textDecoration: "none" }}
              >
                完整歸檔 →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {monthlyArchives.map((archive) => {
                const active = selectedMonth === archive.key;
                return (
                  <button
                    key={archive.key}
                    onClick={() => setSelectedMonth(active ? null : archive.key)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "none",
                      background: active ? "var(--inset)" : "transparent",
                      color: active ? "var(--blue)" : "var(--dim)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      textAlign: "left",
                    }}
                  >
                    <span>{archive.label}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({archive.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* =================================================================
           右側主內容區 (Main Column)：原版封面卡片 + 模式切換器
           ================================================================= */}
        <main className="writing-main-content">
          {/* 頂部標頭與模式切換按鈕 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontWeight: 600, letterSpacing: "0.05em", color: "var(--dim)", fontSize: "0.88rem" }}>
              {viewMode === "timeline" ? `POSTS (${filteredPosts.length})` : "SERIES FOLDERS"}
            </div>

            {/* 視圖切換按鈕 (時間線 / 系列資料夾) */}
            <div
              style={{
                display: "inline-flex",
                gap: "4px",
                background: "var(--inset)",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid var(--bd)",
              }}
            >
              <button
                onClick={() => setViewMode("timeline")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === "timeline" ? "var(--panel)" : "transparent",
                  color: viewMode === "timeline" ? "var(--tx)" : "var(--dim)",
                  transition: "all 0.2s ease",
                }}
              >
                時間線
              </button>
              <button
                onClick={() => setViewMode("folder")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === "folder" ? "var(--panel)" : "transparent",
                  color: viewMode === "folder" ? "var(--tx)" : "var(--dim)",
                  transition: "all 0.2s ease",
                }}
              >
                系列資料夾
              </button>
            </div>
          </div>

          <div className="divider" style={{ height: "1px", background: "var(--bd)", marginBottom: "24px" }} />

          {/* 無文章提示 */}
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "1.1rem", color: "var(--tx)" }}>沒有符合條件的文章</div>
              <div style={{ fontSize: "0.875rem", color: "var(--dim)", marginTop: "8px" }}>
                請嘗試清除側邊欄的篩選條件或關鍵字
              </div>
            </div>
          ) : viewMode === "timeline" ? (
            /* ================= 原版時間線模式 (保留暗化封面與漸層) ================= */
            <div
              style={{
                position: "relative",
                paddingLeft: "20px",
                borderLeft: "2px solid var(--bd)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {filteredPosts.map((post) => {
                const summaryText = post.summary || post.excerpt;
                return (
                  <div key={post.slug} style={{ position: "relative" }}>
                    {/* 原版時間線節點圓點 */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-26px",
                        top: "24px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "var(--dim)",
                        border: "2px solid var(--bg)",
                        boxShadow: "0 0 0 2px var(--bd)",
                      }}
                    />

                    {/* 原版長篇封面卡片 */}
                    <Link
                      href={`/writing/${post.slug}`}
                      className="thought-item"
                      style={{
                        display: "block",
                        color: "inherit",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "14px",
                        padding: "24px",
                        border: "1px solid var(--bd)",
                        background: "var(--panel)",
                        textDecoration: "none",
                        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      {/* 低亮度背景封面圖 */}
                      {post.cover && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${post.cover})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: 0.3,
                            filter: "brightness(0.35) contrast(1.1)",
                            zIndex: 0,
                            transition: "transform 0.3s ease, opacity 0.3s ease",
                          }}
                        />
                      )}

                      {/* 動態漸層遮罩 */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(135deg, var(--panel) 25%, transparent 100%)",
                          zIndex: 1,
                        }}
                      />

                      {/* 卡片主體內容 */}
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            alignItems: "center",
                            marginBottom: "10px",
                            fontSize: "0.8rem",
                            color: "var(--dim)",
                          }}
                        >
                          <span style={{ color: "var(--tx)", fontWeight: 500 }}>{post.date}</span>
                          {post.category && (
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: "var(--inset)",
                                color: "var(--tx)",
                                fontSize: "0.75rem",
                              }}
                            >
                              {post.category}
                            </span>
                          )}
                          {post.wordCount && <span>• {post.wordCount} 字</span>}
                          {post.readingTime && <span>• 閱讀 {post.readingTime} 分鐘</span>}
                        </div>

                        <h2
                          style={{
                            fontSize: "1.3rem",
                            fontWeight: 600,
                            margin: "0 0 8px 0",
                            color: "var(--tx)",
                            lineHeight: 1.4,
                          }}
                        >
                          {post.title}
                        </h2>

                        {summaryText && (
                          <p
                            style={{
                              opacity: 0.85,
                              fontSize: "0.92rem",
                              lineHeight: 1.6,
                              marginBottom: "14px",
                              color: "var(--dim)",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {summaryText}
                          </p>
                        )}

                        {post.tags && post.tags.length > 0 && (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  background: "var(--inset)",
                                  color: "var(--dim)",
                                  border: "1px solid var(--bd)",
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ================= 原版系列資料夾模式 ================= */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {Object.entries(seriesMap).map(([seriesName, seriesPosts]) => (
                <div
                  key={seriesName}
                  style={{
                    borderRadius: "14px",
                    padding: "20px",
                    background: "var(--panel)",
                    border: "1px solid var(--bd)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--bd)",
                      paddingBottom: "12px",
                    }}
                  >
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 600, margin: 0, color: "var(--tx)" }}>
                      {seriesName}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        background: "var(--inset)",
                        color: "var(--dim)",
                        fontWeight: 500,
                      }}
                    >
                      {seriesPosts.length} 篇
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {seriesPosts.map((post, idx) => {
                      const orderDisplay = post.seriesOrder
                        ? String(post.seriesOrder).padStart(2, "0")
                        : String(idx + 1).padStart(2, "0");

                      return (
                        <Link
                          key={post.slug}
                          href={`/writing/${post.slug}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "var(--tx)",
                            fontSize: "0.875rem",
                            background: "var(--inset)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                            <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--dim)", flexShrink: 0 }}>
                              {orderDisplay}.
                            </span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {post.title}
                            </span>
                          </div>
                          {post.readingTime && (
                            <span style={{ fontSize: "0.75rem", color: "var(--dim)", flexShrink: 0, marginLeft: "12px" }}>
                              {post.readingTime}m
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* RWD 響應式微調 */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .writing-layout-container {
            grid-template-columns: 1fr !important;
          }
          .writing-left-sidebar {
            position: static !important;
          }
        }
        .thought-item:hover {
          transform: translateY(-2px);
          border-color: var(--bd2) !important;
          box-shadow: 0 8px 24px var(--shadow);
        }
      `}</style>
    </div>
  );
}
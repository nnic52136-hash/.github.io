"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ExperienceItem } from "../../data";
import ProjectModalShell from "../projects/ProjectModalShell";
import ExperienceDetailBody from "./ExperienceDetailBody";

interface Props {
  groups?: [string, ExperienceItem[]][];
  items?: ExperienceItem[];
}

export default function ExperienceTimeline({ groups, items }: Props) {
  const router = useRouter();
  const timelineEls = useRef<Set<HTMLDivElement>>(new Set());
  const rowEls = useRef<Set<HTMLDivElement>>(new Set());
  const [activeItem, setActiveItem] = useState<ExperienceItem | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("全部");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  timelineEls.current.clear();
  rowEls.current.clear();

  // 1. 統一解析傳入的經歷資料
  const rawItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (groups && groups.length > 0) {
      return groups.flatMap(([_, groupItems]) => groupItems);
    }
    return [];
  }, [groups, items]);

  // 2. 🔥 動態從所有經歷的 tags 中萃取出不重複的標籤清單，並自動加上「全部」
  const dynamicFilterTags = useMemo(() => {
    const tagSet = new Set<string>();
    rawItems.forEach((item) => {
      item.tags?.forEach((t) => tagSet.add(t));
    });
    return ["全部", ...Array.from(tagSet)];
  }, [rawItems]);

  // 3. 標籤快速篩選
  const filteredItems = useMemo(() => {
    if (selectedTag === "全部") return rawItems;
    return rawItems.filter((item) => item.tags?.includes(selectedTag));
  }, [rawItems, selectedTag]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timelines = [...timelineEls.current];
    const rows = [...rowEls.current];
    timelines.forEach((el) => el.setAttribute("data-scroll-progress", "on"));

    let ticking = false;
    const update = () => {
      ticking = false;
      const triggerY = window.innerHeight * 0.4;

      for (const el of timelines) {
        const rect = el.getBoundingClientRect();
        const progress = rect.height ? (triggerY - rect.top) / rect.height : 0;
        el.style.setProperty(
          "--exp-fill",
          String(Math.min(1, Math.max(0, progress)))
        );
      }

      for (const el of rows) {
        const rect = el.getBoundingClientRect();
        const passed = rect.bottom <= triggerY;
        const active = !passed && rect.top <= triggerY;
        el.classList.toggle("is-passed", passed);
        el.classList.toggle("is-active", active);

        const rowProgress = rect.height
          ? (triggerY - rect.top) / rect.height
          : passed
          ? 1
          : 0;
        el.style.setProperty(
          "--row-fill",
          String(Math.min(1, Math.max(0, rowProgress)))
        );
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filteredItems]);

  const handleCardClick = (item: ExperienceItem) => {
    if (item.hasDetail && item.slug) {
      router.push(`/experience/${item.slug}`);
    } else {
      setActiveItem(item);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      {/* 頂部動態生成標籤列（改為自動讀取資料中的 tags） */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        {dynamicFilterTags.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : 400,
                border: "1px solid",
                borderColor: isActive ? "var(--blue)" : "var(--bd)",
                background: isActive ? "var(--blue)" : "var(--inset)",
                color: isActive ? "var(--btntx, #000)" : "var(--tx)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tag !== "全部" && "#"}{tag}
            </button>
          );
        })}
      </div>

      {/* 時間軸清單 */}
      {filteredItems.length === 0 ? (
        <div style={{ padding: "60px 0", color: "var(--dim)", textAlign: "center" }}>
          尚無此標籤的經歷項目 (´･ω･`)
        </div>
      ) : (
        <div className="timeline-group" style={{ marginBottom: "28px" }}>
          <div
            className="exp-timeline"
            ref={(el) => {
              if (el) timelineEls.current.add(el);
            }}
          >
            {filteredItems.map((e, i) => {
              const itemId = e.id || `${e.title}-${i}`;
              const isHovered = hoveredId === itemId;
              const summaryText = e.summary || e.desc;
              const orgText = e.organization || e.org;
              const displayPeriod =
                e.period ||
                (e.startDate
                  ? `${e.startDate}${e.endDate ? ` - ${e.endDate}` : ""}`
                  : "");

              return (
                <div
                  className="exp-row"
                  key={itemId}
                  ref={(el) => {
                    if (el) rowEls.current.add(el);
                  }}
                  style={{ marginBottom: "16px" }}
                >
                  <div className="exp-node-col">
                    <span className={`exp-dot ${e.color ?? "blue"}`} />
                  </div>

                  {/* 卡片主體 */}
                  <div
                    className={`tl-card ${e.color ?? "blue"}`}
                    onClick={() => handleCardClick(e)}
                    onMouseEnter={() => setHoveredId(itemId)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      cursor: "pointer",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      background: "var(--panel)",
                      border: "1px solid var(--bd)",
                      transition: "all 0.25s ease",
                      borderColor: isHovered ? "var(--blue)" : "var(--bd)",
                      boxShadow: isHovered ? "0 8px 24px var(--shadow)" : "none",
                      transform: isHovered ? "translateY(-2px)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                      <div className="tl-title" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--tx)", margin: 0 }}>
                        {e.title}
                        {e.role && (
                          <span style={{ fontSize: "0.85rem", opacity: 0.75, marginLeft: "8px", fontWeight: 400, color: "var(--dim)" }}>
                            · {e.role}
                          </span>
                        )}
                      </div>
                      <div className="tl-period" style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "var(--dim)", flexShrink: 0 }}>
                        {displayPeriod}
                      </div>
                    </div>

                    {/* 滑鼠 Hover 展開內容 */}
                    <div
                      style={{
                        maxHeight: isHovered ? "200px" : "0px",
                        opacity: isHovered ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin-top 0.25s ease",
                        marginTop: isHovered ? "10px" : "0px",
                        borderTop: isHovered ? "1px solid var(--bd)" : "none",
                        paddingTop: isHovered ? "10px" : "0px",
                      }}
                    >
                      {orgText && (
                        <div style={{ fontSize: "0.85rem", color: "var(--purple)", fontWeight: 500, marginBottom: "4px" }}>
                          {orgText}
                        </div>
                      )}
                      {summaryText && (
                        <div style={{ fontSize: "0.88rem", color: "var(--dim)", lineHeight: 1.5, marginBottom: "8px" }}>
                          {summaryText}
                        </div>
                      )}
                      <div style={{ fontSize: "0.82rem", color: "var(--blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        {e.hasDetail ? "閱讀完整心得 →" : "查看詳細資訊 (彈窗) →"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 彈窗 */}
      {activeItem && (
        <ProjectModalShell
          kicker={activeItem.tags?.[0] ?? "經歷"}
          kickerColor={activeItem.color ?? "blue"}
          title={activeItem.title}
          desc={activeItem.organization || activeItem.org || activeItem.period}
          onClose={() => setActiveItem(null)}
        >
          <ExperienceDetailBody item={activeItem} />
        </ProjectModalShell>
      )}
    </div>
  );
}
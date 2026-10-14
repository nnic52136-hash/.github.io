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

  const [viewMode, setViewMode] = useState<"timeline" | "archive">("timeline");
  
  // 🔥 6 大維度的多選狀態 (每個維度對應一個陣列，支援複選)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  timelineEls.current.clear();
  rowEls.current.clear();

  // 1. 統一解析並去重傳入的經歷資料
  const rawItems = useMemo(() => {
    let list: ExperienceItem[] = [];
    if (items && items.length > 0) {
      list = items;
    } else if (groups && groups.length > 0) {
      list = groups.flatMap(([_, groupItems]) => groupItems);
    }
    const map = new Map<string, ExperienceItem>();
    list.forEach((item) => {
      if (item && item.id) map.set(item.id, item);
    });
    return Array.from(map.values());
  }, [groups, items]);

  // 2. 🔥 動態從所有經歷的屬性與 tags 中自動萃取出 6 大維度的選項 (強制獨立拆解字串與陣列)
  const dynamicDimensions = useMemo(() => {
    const types = new Set<string>();
    const orgs = new Set<string>();
    const domains = new Set<string>();
    const topics = new Set<string>();
    const roles = new Set<string>();
    const statuses = new Set<string>();

    // 💡 強化版：無論是字串、陣列，皆透過逗號或斜線徹底拆解為獨立標籤
    const addValues = (val: string | string[] | undefined, set: Set<string>) => {
      if (!val) return;
      const rawList = Array.isArray(val) ? val : [val];
      rawList.forEach((item) => {
        if (typeof item !== "string") return;
        // 同時支援逗號與中文逗號拆解
        item.split(/[,，]/).forEach((v) => {
          const clean = v.trim();
          if (clean) set.add(clean);
        });
      });
    };

    rawItems.forEach((item) => {
      addValues(item.type, types);
      addValues(item.organization || item.org, orgs);
      addValues(item.domain, domains);
      addValues(item.topic, topics);
      addValues(item.role, roles);
      addValues(item.status, statuses);
      
      // 兼容 tags 自動歸納
      item.tags?.forEach((t) => {
        const clean = t.trim();
        if (["學歷", "比賽", "實習", "社團", "營隊志工", "創業", "擺攤", "展覽"].includes(clean)) types.add(clean);
        if (["校內", "人社圈", "資訊圈", "辯論圈", "學治圈", "文學圈", "技職圈"].includes(clean)) domains.add(clean);
      });
    });

    return {
      "參與類型 (Type)": Array.from(types),
      "組織團隊 (Organization)": Array.from(orgs),
      "領域圈子 (Domain)": Array.from(domains),
      "主題技能 (Topic)": Array.from(topics),
      "角色 (Role)": Array.from(roles),
      "階段狀態 (Status)": Array.from(statuses),
    };
  }, [rawItems]);

  // 3. 多維度複合過濾（支援獨立拆解比對）
  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      const itemTags = item.tags?.map((t) => t.trim()) || [];

      // 💡 強化版：檢查欄位（字串或陣列）是否包含特定標籤（支援逗號分隔字串的獨立比對）
      const checkMatch = (field: string | string[] | undefined, val: string) => {
        if (!field) return false;
        const list = Array.isArray(field) ? field : [field];
        return list.some((f) => {
          if (typeof f !== "string") return false;
          return f.split(/[,，]/).map((s) => s.trim()).includes(val);
        });
      };

      for (const [dimName, selectedValues] of Object.entries(selectedFilters)) {
        if (!selectedValues || selectedValues.length === 0) continue;

        let matchesThisDimension = false;
        for (const val of selectedValues) {
          let match = false;
          if (dimName.includes("參與類型")) {
            match = checkMatch(item.type, val) || itemTags.includes(val);
          } else if (dimName.includes("組織團隊")) {
            match = checkMatch(item.organization || item.org, val);
          } else if (dimName.includes("領域圈子")) {
            match = checkMatch(item.domain, val) || itemTags.includes(val);
          } else if (dimName.includes("主題技能")) {
            match = checkMatch(item.topic, val) || itemTags.includes(val);
          } else if (dimName.includes("角色")) {
            match = checkMatch(item.role, val);
          } else if (dimName.includes("階段狀態")) {
            match = checkMatch(item.status, val);
          }

          if (match) {
            matchesThisDimension = true;
            break;
          }
        }

        if (!matchesThisDimension) return false;
      }
      return true;
    });
  }, [rawItems, selectedFilters]);

  // 4. 按年份歸檔分組
  const archivedGroups = useMemo(() => {
    const map: Record<string, ExperienceItem[]> = {};
    filteredItems.forEach((item) => {
      const p = item.period || item.startDate || "其他";
      const match = p.match(/\b(20\d{2}|19\d{2})\b/);
      const year = match ? `${match[1]} 年` : "未定年份";

      if (!map[year]) map[year] = [];
      map[year].push(item);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredItems]);

  // 多選點擊切換
  const handleTagClick = (dimName: string, val: string) => {
    setSelectedFilters((prev) => {
      const currentList = prev[dimName] || [];
      let updatedList: string[];

      if (currentList.includes(val)) {
        updatedList = currentList.filter((item) => item !== val);
      } else {
        updatedList = [...currentList, val];
      }

      const copy = { ...prev };
      if (updatedList.length === 0) {
        delete copy[dimName];
      } else {
        copy[dimName] = updatedList;
      }
      return copy;
    });
  };

  const handleClearAll = () => setSelectedFilters({});
  
  const totalActiveFiltersCount = Object.values(selectedFilters).reduce(
    (sum, list) => sum + list.length, 
    0
  );
  const hasActiveFilters = totalActiveFiltersCount > 0;

  // 時間線隨滑動變色的進度監聽動畫
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
  }, [filteredItems, viewMode]);

  const handleCardClick = (item: ExperienceItem) => {
    if (item.hasDetail && item.slug) {
      router.push(`/experience/${item.slug}`);
    } else {
      setActiveItem(item);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      {/* 頂部切換功能列與視圖模式 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--dim)",
            letterSpacing: "0.05em",
          }}
        >
          EXPERIENCES ({filteredItems.length})
        </div>

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
            type="button"
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
            type="button"
            onClick={() => setViewMode("archive")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background: viewMode === "archive" ? "var(--panel)" : "transparent",
              color: viewMode === "archive" ? "var(--tx)" : "var(--dim)",
              transition: "all 0.2s ease",
            }}
          >
            歸檔列表
          </button>
        </div>
      </div>

      {/* 6 大維度自動生成面板 (支援多選) */}
      <div
        style={{
          background: "var(--panel)",
          padding: "18px 22px",
          borderRadius: "14px",
          border: "1px solid var(--bd)",
          marginBottom: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
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
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--tx)",
            }}
          >
            自動檢索面板 (各分類支援複選)
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--blue)",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              清除所有篩選 ({totalActiveFiltersCount}) ✕
            </button>
          )}
        </div>

        {Object.entries(dynamicDimensions).map(([dimName, values]) => {
          if (values.length === 0) return null;
          const currentSelectedList = selectedFilters[dimName] || [];

          return (
            <div
              key={dimName}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--dim)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {dimName}
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {values.map((val) => {
                  const isActive = currentSelectedList.includes(val);
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleTagClick(dimName, val)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontSize: "0.8rem",
                        border: "1px solid",
                        borderColor: isActive ? "var(--blue)" : "var(--bd)",
                        background: isActive ? "var(--blue)" : "var(--inset)",
                        color: isActive ? "var(--btntx, #000)" : "var(--tx)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {dimName.includes("Role") ? val : `#${val}`}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 內容渲染區 */}
      {filteredItems.length === 0 ? (
        <div style={{ padding: "60px 0", color: "var(--dim)", textAlign: "center" }}>
          找不到符合條件的經歷項目 (´･ω･`)
        </div>
      ) : viewMode === "timeline" ? (
        /* 時間線模式 (帶有滾動填色特效) */
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
              
              const orgVal = e.organization || e.org;
              const orgText = Array.isArray(orgVal) ? orgVal.join(" · ") : orgVal;

              const roleText = Array.isArray(e.role) ? e.role.join(" / ") : e.role;

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
                      boxShadow: isHovered
                        ? "0 8px 24px var(--shadow)"
                        : "none",
                      transform: isHovered ? "translateY(-2px)" : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: "12px",
                      }}
                    >
                      <div
                        className="tl-title"
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "var(--tx)",
                          margin: 0,
                        }}
                      >
                        {e.title}
                        {roleText && (
                          <span
                            style={{
                              fontSize: "0.85rem",
                              opacity: 0.75,
                              marginLeft: "8px",
                              fontWeight: 400,
                              color: "var(--dim)",
                            }}
                          >
                            · {roleText}
                          </span>
                        )}
                      </div>
                      <div
                        className="tl-period"
                        style={{
                          fontSize: "0.85rem",
                          fontFamily: "monospace",
                          color: "var(--dim)",
                          flexShrink: 0,
                        }}
                      >
                        {displayPeriod}
                      </div>
                    </div>

                    <div
                      style={{
                        maxHeight: isHovered ? "200px" : "0px",
                        opacity: isHovered ? 1 : 0,
                        overflow: "hidden",
                        transition:
                          "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin-top 0.25s ease",
                        marginTop: isHovered ? "10px" : "0px",
                        borderTop: isHovered ? "1px solid var(--bd)" : "none",
                        paddingTop: isHovered ? "10px" : "0px",
                      }}
                    >
                      {orgText && (
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--purple)",
                            fontWeight: 500,
                            marginBottom: "4px",
                          }}
                        >
                          {orgText}
                        </div>
                      )}
                      {summaryText && (
                        <div
                          style={{
                            fontSize: "0.88rem",
                            color: "var(--dim)",
                            lineHeight: 1.5,
                            marginBottom: "8px",
                          }}
                        >
                          {summaryText}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--blue)",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {e.hasDetail
                          ? "閱讀完整心得 →"
                          : "查看詳細資訊 (彈窗) →"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 年份歸檔模式 */
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {archivedGroups.map(([year, yearItems]) => (
            <div key={year}>
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontFamily: "Shippori Mincho, serif",
                  color: "var(--tx)",
                  marginBottom: "14px",
                  borderBottom: "1px solid var(--bd)",
                  paddingBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{year}</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--dim)",
                    fontFamily: "sans-serif",
                  }}
                >
                  {yearItems.length} 項經歷
                </span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {yearItems.map((e) => {
                  const roleText = Array.isArray(e.role) ? e.role.join(" / ") : e.role;
                  return (
                    <div
                      key={e.id}
                      onClick={() => handleCardClick(e)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "var(--panel)",
                        border: "1px solid var(--bd)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "var(--tx)",
                          }}
                        >
                          {e.title}
                        </span>
                        {roleText && (
                          <span style={{ fontSize: "0.8rem", color: "var(--dim)" }}>
                            ({roleText})
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontFamily: "monospace",
                          color: "var(--dim)",
                          flexShrink: 0,
                        }}
                      >
                        {e.period}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 彈窗 Modal */}
      {activeItem && (
        <ProjectModalShell
          kicker={activeItem.tags?.[0] ?? "經歷"}
          kickerColor={activeItem.color ?? "blue"}
          title={activeItem.title}
          desc={[
            activeItem.summary,
            Array.isArray(activeItem.organization || activeItem.org)
              ? ((activeItem.organization || activeItem.org) as string[]).join(" · ")
              : (activeItem.organization || activeItem.org),
          ]
            .filter(Boolean)
            .join(" · ")}
          onClose={() => setActiveItem(null)}
        >
          <ExperienceDetailBody item={activeItem} />
        </ProjectModalShell>
      )}
    </div>
  );
}
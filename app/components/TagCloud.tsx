"use client";

import { useEffect, useState, useMemo } from "react";

interface TagData {
  text: string;
  count: number;
}

// 🎯 1. 顏色配方升級：採用高濃度/實體背景色，取代原本過淡的透明底色
const SOLID_THEMES = [
  { bg: "#7A8B74", border: "#63735E", color: "#FFFFFF" }, // 實體抹茶綠
  { bg: "#B58D8B", border: "#9A7573", color: "#FFFFFF" }, // 實體玫瑰粉
  { bg: "#6C7D99", border: "#556580", color: "#FFFFFF" }, // 實體莫蘭迪藍
  { bg: "#D1AC77", border: "#B5925F", color: "#FFFFFF" }, // 實體拿鐵黃
  { bg: "#8B749E", border: "#735E85", color: "#FFFFFF" }, // 實體丁香紫
];

function getTagHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 🎯 2. 真・文字雲空間演算法：確保最大值永遠在正中央，其餘依序向左右兩側擴展包圍
function generateCloudLayout(items: TagData[]): TagData[] {
  if (items.length === 0) return [];
  // 依據 count 降冪排序
  const sorted = [...items].sort((a, b) => b.count - a.count);
  const result: TagData[] = new Array(sorted.length);

  // 找出陣列中心點
  let left = Math.floor(sorted.length / 2);
  let right = left + 1;

  // 最大值放正中間
  result[left] = sorted[0];
  left--;

  // 其餘交錯放置於左右，形成包圍網
  for (let i = 1; i < sorted.length; i++) {
    if (i % 2 !== 0 && left >= 0) {
      result[left] = sorted[i];
      left--;
    } else if (right < sorted.length) {
      result[right] = sorted[i];
      right++;
    } else if (left >= 0) {
      result[left] = sorted[i];
      left--;
    }
  }
  return result.filter(Boolean);
}

export default function TagCloud() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 用於記錄剛剛被「+1」的標籤，以觸發流暢的長大動畫
  const [pulsingTag, setPulsingTag] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (data.tags) {
        const parsed: TagData[] = Object.entries(data.tags).map(
          ([text, count]) => ({
            text,
            count: Number(count),
          })
        );
        setTags(parsed);
      }
    } catch {
      // 靜默處理
    } finally {
      setMounted(true);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const { minCount, maxCount } = useMemo(() => {
    if (tags.length === 0) return { minCount: 1, maxCount: 1 };
    const counts = tags.map((t) => t.count);
    return {
      minCount: Math.min(...counts),
      maxCount: Math.max(...counts),
    };
  }, [tags]);

  // 取得空間計算後的雲朵陣列
  const cloudTags = useMemo(() => generateCloudLayout(tags), [tags]);

  // 留印功能
  const handleAddTag = async (tagText: string) => {
    const cleanText = tagText.trim();
    if (!cleanText || loading) return;

    setError(null);
    setInputTag("");
    setPulsingTag(cleanText); // 觸發動態特效

    setTags((prev) => {
      const exists = prev.find((t) => t.text === cleanText);
      if (exists) {
        return prev.map((t) =>
          t.text === cleanText ? { ...t, count: t.count + 1 } : t
        );
      }
      return [...prev, { text: cleanText, count: 1 }];
    });

    // 延遲解除長大特效鎖
    setTimeout(() => setPulsingTag(null), 400);

    try {
      setLoading(true);
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: cleanText }),
      });
      if (!res.ok) fetchTags();
    } catch {
      fetchTags();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tag-cloud-wrapper">
      <style jsx>{`
        .tag-cloud-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 1rem 0;
          gap: 1.5rem;
        }

        /* 🎯 真・文字雲舞台：允許空間自由擠壓交錯 */
        .cloud-space-stage {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-content: center;
          align-items: center;
          gap: 12px 16px;
          width: 100%;
          min-height: 140px;
          padding: 1rem;
          opacity: ${mounted ? 1 : 0}; /* 避免 SSR 資料跳動 */
          transition: opacity 0.5s ease;
        }

        /* 🎯 GPU 加速流暢標籤 */
        .cloud-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          border-width: 2px;
          border-style: solid;
          will-change: transform;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

          /* 核心物理過渡：針對 transform 與底色做極致平滑處理 */
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease,
            background-color 0.2s ease;
        }

        /* 出現時的彈出動畫 */
        @keyframes popIn {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .cloud-tag-pill:hover {
          transform: translateY(-5px) scale(1.12) !important;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
          z-index: 10;
        }

        .cloud-tag-pill:active {
          transform: scale(0.92) !important;
        }

        .max-highlight {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .tag-count-badge {
          font-size: 0.75em;
          opacity: 0.9;
          background: rgba(255, 255, 255, 0.25);
          padding: 2px 7px;
          border-radius: 8px;
          font-weight: 700;
          color: #fff;
        }

        /* 被點擊 +1 時的瞬間平滑膨脹 */
        .pulse-effect {
          transform: scale(1.2) !important;
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
          z-index: 20;
        }

        /* 🎯 SSR 真實表單：不再使用骨架屏，直接渲染真實 Input 避免閃爍 */
        .cloud-form {
          display: flex;
          gap: 8px;
          width: 100%;
          max-width: 380px;
        }

        .cloud-input {
          flex: 1;
          padding: 10px 20px;
          border-radius: 999px;
          border: 2px solid var(--bd2, var(--bd));
          background: var(--panel2, var(--panel));
          color: var(--tx);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .cloud-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cloud-input:focus {
          border-color: #7a8b74;
          box-shadow: 0 0 0 3px rgba(122, 139, 116, 0.2);
        }

        .cloud-btn {
          padding: 10px 24px;
          border-radius: 999px;
          border: none;
          background: var(--btn);
          color: var(--btntx);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cloud-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 12px var(--shadow, rgba(0, 0, 0, 0.1));
        }

        .cloud-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .cloud-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>

      {/* 文字雲展示區 */}
      <div className="cloud-space-stage">
        {mounted && cloudTags.length > 0
          ? cloudTags.map((t) => {
              const ratio =
                maxCount === minCount
                  ? 0.5
                  : (t.count - minCount) / (maxCount - minCount);
              const hash = getTagHash(t.text);
              const theme = SOLID_THEMES[hash % SOLID_THEMES.length];
              const isMax = t.count === maxCount && maxCount > 1;
              const isPulsing = pulsingTag === t.text;

              // 完全依賴空間推擠與字體大小，搭配 transform 長大
              const baseSize = 0.85 + ratio * 0.6; // 0.85rem ~ 1.45rem，級距拉開
              const fontSize = `${baseSize.toFixed(2)}rem`;
              const padding = isMax
                ? "10px 24px"
                : `${(6 + ratio * 4).toFixed(0)}px ${(14 + ratio * 8).toFixed(0)}px`;

              const borderRadius = "999px"; // 統一採用全圓角讓空間交錯更滑順
              const fontWeight = isMax ? "800" : ratio >= 0.5 ? "700" : "600";
              const offsetY = (hash % 9) - 4; // Y 軸交錯

              return (
                <button
                  key={t.text}
                  className={`cloud-tag-pill ${isMax ? "max-highlight" : ""} ${isPulsing ? "pulse-effect" : ""}`}
                  onClick={() => handleAddTag(t.text)}
                  style={{
                    fontSize,
                    padding,
                    borderRadius,
                    backgroundColor: theme.bg,
                    color: theme.color,
                    borderColor: theme.border,
                    fontWeight,
                    marginTop: `${offsetY}px`, // 打破水平對齊線
                  }}
                  title={`點擊為「${t.text}」+1（目前 ${t.count} 次）`}
                >
                  <span>#{t.text}</span>
                  <span className="tag-count-badge">{t.count}</span>
                </button>
              );
            })
          : mounted && (
              <span style={{ color: "var(--dim)", fontSize: "0.9rem" }}>
                尚無印記，寫下第一個印象吧！
              </span>
            )}
      </div>

      {/* SSR 真實渲染留印表單：取代骨架屏，杜絕閃爍 */}
      <form
        className="cloud-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTag(inputTag);
        }}
      >
        <input
          type="text"
          className="cloud-input"
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          placeholder="寫下對我的印象..."
          maxLength={20}
          disabled={!mounted || loading}
        />
        <button
          type="submit"
          className="cloud-btn"
          disabled={!mounted || loading || !inputTag.trim()}
        >
          留印
        </button>
      </form>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.8rem", margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

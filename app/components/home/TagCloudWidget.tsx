"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "echarts-wordcloud";

interface TagData {
  name: string;
  value: number;
}

export default function TagCloudWidget() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [inputTag, setInputTag] = useState("");
  const [loading, setLoading] = useState(false);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [rawTags, setRawTags] = useState<TagData[]>([]);
  const [themeVersion, setThemeVersion] = useState(0);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (data.tags) {
        const parsed: TagData[] = Object.entries(data.tags).map(
          ([name, value]) => ({
            name,
            value: Number(value),
          })
        );
        setRawTags(parsed);
      }
    } catch {
      // 靜默處理
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // 監聽亮暗色模式切換，即時重繪 ECharts 顏色
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeVersion((v) => v + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const computedStyle = getComputedStyle(document.documentElement);
    const colorBlue =
      computedStyle.getPropertyValue("--blue").trim() || "#889CE8";
    const colorPurple =
      computedStyle.getPropertyValue("--purple").trim() || "#D48CB3";
    const colorTx = computedStyle.getPropertyValue("--tx").trim() || "#F3E8F2";
    const colorDim =
      computedStyle.getPropertyValue("--dim").trim() || "#B599B7";
    const shadowColor =
      computedStyle.getPropertyValue("--shadow").trim() ||
      "rgba(5, 8, 20, 0.6)";

    const palette = [colorBlue, colorPurple, colorTx, colorDim];

    const option: echarts.EChartsOption = {
      tooltip: {
        show: true,
        formatter: (params: any) => `${params.name}: ${params.value}`,
      },
      series: [
        {
          type: "wordCloud",
          // 關鍵修正：diamond 為 echarts-wordcloud 官方定義的矩形/方形別名
          shape: "diamond",
          left: "center",
          top: "center",
          width: "100%",
          height: "100%",
          sizeRange: [18, 46],
          rotationRange: [-15, 15],
          rotationStep: 15,
          gridSize: 4,
          drawOutOfBound: true,
          layoutAnimation: false,
          textStyle: {
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: "bold",
            color: function () {
              return palette[Math.floor(Math.random() * palette.length)];
            },
          },
          emphasis: {
            focus: "self",
            textStyle: {
              textShadowBlur: 8,
              textShadowColor: shadowColor,
            },
          },
          data: rawTags,
        },
      ],
    };

    chartInstance.current.setOption(option, true);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rawTags, themeVersion]);

  const handleAddTag = async (tagText: string) => {
    const cleanText = tagText.trim();
    if (!cleanText || loading) return;

    setInputTag("");
    setLoading(true);

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: cleanText }),
      });
      if (res.ok) {
        fetchTags();
      }
    } catch {
      // 靜默處理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tag-cloud-inner">
      <style jsx>{`
        .tag-cloud-inner {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .echarts-container {
          width: 100%;
          height: 180px;
        }

        .cloud-form {
          display: flex;
          gap: 8px;
          width: 100%;
          margin-top: 8px;
          margin-bottom: 8px; /* 加上這行，推開底部邊距 */
        }

        .cloud-input {
          flex: 1;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1.5px solid var(--bd2);
          background: var(--inset);
          color: var(--tx);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .cloud-input::placeholder {
          color: var(--mute);
        }

        .cloud-input:focus {
          border-color: var(--blue);
        }

        .cloud-btn {
          padding: 8px 18px;
          border-radius: 999px;
          border: none;
          background: var(--btn);
          color: var(--btntx);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .cloud-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .cloud-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div ref={chartRef} className="echarts-container" />

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
          placeholder="留下你的印記..."
          maxLength={20}
        />
        <button
          type="submit"
          className="cloud-btn"
          disabled={!inputTag.trim() || loading}
        >
          送出
        </button>
      </form>
    </div>
  );
}

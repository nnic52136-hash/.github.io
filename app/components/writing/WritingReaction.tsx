"use client";

import { useState, useEffect } from "react";

interface WritingReactionProps {
  id: string; // 文章 slug
  initialCount?: number;
  size?: "sm" | "md" | "lg";
}

export default function WritingReaction({
  id,
  initialCount = 0,
  size = "md",
}: WritingReactionProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 1. 初始化：從 localStorage 讀取該訪客是否按過，並從 API 抓取伺服器最新的累積總數
  useEffect(() => {
    let isMounted = true;

    const storedLiked = localStorage.getItem(`liked_${id}`) === "true";
    setLiked(storedLiked);

    async function fetchReaction() {
      try {
        const res = await fetch(`/api/reactions?ids=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && typeof data[id] === "number") {
            setCount(data[id]);
          }
        }
      } catch (error) {
        console.error("無法取得按讚資料:", error);
      }
    }

    fetchReaction();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. 點擊按讚 / 收回讚
  const handleLike = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 250);

    const nextLikedState = !liked;
    const nextCount = nextLikedState ? count + 1 : Math.max(0, count - 1);

    // 立即更新前端畫面與 localStorage（即時反應，不卡頓）
    setLiked(nextLikedState);
    setCount(nextCount);
    localStorage.setItem(`liked_${id}`, String(nextLikedState));

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, liked: nextLikedState }),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") {
          setCount(data.count); // 採用伺服器回傳的真實最新總數
        }
      } else {
        // 如果 API 失敗，默默將狀態復原
        setLiked(liked);
        setCount(count);
        localStorage.setItem(`liked_${id}`, String(liked));
      }
    } catch (error) {
      console.error("按讚同步失敗:", error);
      setLiked(liked);
      setCount(count);
      localStorage.setItem(`liked_${id}`, String(liked));
    }
  };

  return (
    <button
      onClick={handleLike}
      aria-label="按讚"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "8px 16px",
        borderRadius: "9999px",
        border: liked
          ? "1px solid rgba(244, 63, 94, 0.4)"
          : "1px solid var(--bd, rgba(255, 255, 255, 0.12))",
        background: liked
          ? "rgba(244, 63, 94, 0.08)"
          : "var(--panel, rgba(255, 255, 255, 0.05))",
        color: liked ? "#f43f5e" : "var(--tx, #ececec)",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: 500,
        backdropFilter: "blur(8px)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: liked
          ? "0 2px 12px rgba(244, 63, 94, 0.18)"
          : "0 2px 8px rgba(0, 0, 0, 0.04)",
        userSelect: "none",
        outline: "none",
      }}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill={liked ? "#f43f5e" : "none"}
        stroke={liked ? "#f43f5e" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition:
            "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), fill 0.2s ease",
          transform: isAnimating ? "scale(1.35)" : "scale(1)",
        }}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>

      <span>讚</span>

      <span
        style={{
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          background: liked
            ? "rgba(244, 63, 94, 0.6)"
            : "var(--dim, rgba(255, 255, 255, 0.3))",
          margin: "0 1px",
        }}
      />

      <span
        style={{
          fontVariantNumeric: "tabular-nums",
          fontWeight: 600,
          opacity: count > 0 || liked ? 1 : 0.6,
        }}
      >
        {count}
      </span>
    </button>
  );
}
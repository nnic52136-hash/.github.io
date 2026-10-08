"use client";

import { useState } from "react";

interface WritingReactionProps {
  id: string;
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

  const handleLike = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 250);

    if (liked) {
      setCount((prev) => Math.max(0, prev - 1));
      setLiked(false);
    } else {
      setCount((prev) => prev + 1);
      setLiked(true);
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
      onMouseEnter={(e) => {
        if (!liked)
          e.currentTarget.style.borderColor =
            "var(--dim, rgba(255, 255, 255, 0.3))";
      }}
      onMouseLeave={(e) => {
        if (!liked)
          e.currentTarget.style.borderColor =
            "var(--bd, rgba(255, 255, 255, 0.12))";
      }}
    >
      {/* 向量愛心 Icon */}
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

      {/* 精緻圓點分隔替代原版豎線 */}
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

      {/* 數字欄位 (等寬數字防跳動) */}
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

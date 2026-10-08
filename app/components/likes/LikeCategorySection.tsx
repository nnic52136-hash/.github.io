"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LikeCategory } from "../../data";
import { useHorizontalWheelScroll } from "../../hooks/useHorizontalWheelScroll";
import { useVtuberLiveStatus } from "../../hooks/useVtuberLiveStatus";
import { sortLikesByRating } from "../../lib/sortLikes";
import LikeCard from "./LikeCard";

const INITIAL_COUNT = 9;
const BATCH_SIZE = 14;

export default function LikeCategorySection({
  cat,
  priorityImages = false,
}: {
  cat: LikeCategory;
  priorityImages?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [cat.key]);

  const liveMap = useVtuberLiveStatus(cat.layout === "circle");

  const sortedItems = useMemo(
    () =>
      sortLikesByRating(
        cat.items,
        "desc",
        (l) => !!(l.href && liveMap[l.href]?.live)
      ),
    [cat.items, liveMap]
  );

  const liveSignature = useMemo(
    () =>
      Object.keys(liveMap)
        .filter((href) => liveMap[href]?.live)
        .sort()
        .join(","),
    [liveMap]
  );

  useEffect(() => {
    if (liveSignature && trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [liveSignature]);

  useEffect(() => {
    const track = trackRef.current;
    const sentinel = sentinelRef.current;
    if (!track || !sentinel) return;
    if (!("IntersectionObserver" in window)) {
      setVisibleCount(sortedItems.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + BATCH_SIZE, sortedItems.length));
        }
      },
      { root: track, rootMargin: "0px 400px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sortedItems.length]);

  const preview = sortedItems.slice(0, visibleCount);

  return (
    <div className="like-category">
      <div className="like-cat-head">
        <div className="like-cat-head-text">
          <span className="like-cat-en">{cat.en}</span>
          <h2 className="like-cat-title">{cat.label}</h2>
        </div>
        <Link className="like-expand-btn" href={`/likes/${cat.key}`}>
          查看更多 →
        </Link>
      </div>
      <div className="likes-track" ref={trackRef} data-lenis-prevent-wheel>
        {preview.map((l, i) => {
          const { href: rawHref, ...lClean } = l;
          const isInternalArticle = Boolean(l.slug);
          const articleUrl = `/likes/${cat.key}/${l.slug}`;

          const cardElement = (
            <LikeCard
              l={isInternalArticle ? lClean : l}
              carousel
              layout={cat.layout === "landscape" ? "portrait" : cat.layout}
              priority={priorityImages && i < 2}
              live={l.href ? liveMap[l.href] : undefined}
            />
          );

          // 若為站內 MDX 文章，使用 Next.js 原生 <Link> 進行流暢轉場（同 Writing 專區）
          if (isInternalArticle) {
            return (
              <Link
                key={`${cat.key}-${l.slug}`}
                href={articleUrl}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "inline-block",
                }}
              >
                {cardElement}
              </Link>
            );
          }

          return <span key={`${cat.key}-${l.title}`}>{cardElement}</span>;
        })}
        {visibleCount < sortedItems.length && (
          <div ref={sentinelRef} className="likes-track-sentinel" aria-hidden />
        )}
      </div>
    </div>
  );
}

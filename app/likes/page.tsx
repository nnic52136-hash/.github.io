// app/likes/page.tsx
import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import LikeCategorySection from "../components/likes/LikeCategorySection";
import VtuberLiveWarmup from "../components/likes/VtuberLiveWarmup";
import { LIKE_CATEGORIES } from "../data";
import { pageMetadata } from "../lib/seo";

const description = "亞瑟原 喜歡的東西們 (╯✧∇✧)╯";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "喜歡的東西",
  description,
  path: "/likes",
});

export default function LikesPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <VtuberLiveWarmup />
      <PageHead kicker="LIKES" title="喜歡的東西" />
      {LIKE_CATEGORIES.map((cat, i) => (
        <LikeCategorySection cat={cat} key={cat.key} priorityImages={i === 0} />
      ))}
    </section>
  );
}
import type { Metadata } from "next";
import PageHead from "@/app/components/PageHead";
import ExperienceTimeline from "@/app/components/experience/ExperienceTimeline";
import { EXPERIENCES } from "@/app/data";
import { pageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "個人經歷與活動",
  description: "活動籌備、比賽、營隊、講座展覽與上台表演紀錄",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <section
      style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 16px" }}
    >
      <PageHead
        kicker="EXPERIENCE & ACTIVITIES"
        title="經歷與活動"
        desc="活動籌備 · 競賽歷程 · 營隊志工 · 講座展覽 · 上台表演"
      />
      {/* 直接渲染時間軸，由內部進行標籤篩選與 Hover 展開 */}
      <ExperienceTimeline items={EXPERIENCES} />
    </section>
  );
}

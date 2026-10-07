import type { Metadata } from "next";
import PageHead from "@/app/components/PageHead";
import ArchivesClient from "@/app/components/writing/ArchivesClient";
import { getPostSummaries } from "@/app/lib/posts";
import { pageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "文章歸檔",
  description: "全站所有文章時間軸歷史紀錄",
  path: "/archives",
});

export const revalidate = 3600;

export default async function ArchivesPage() {
  const posts = getPostSummaries();

  return (
    <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
      <PageHead
        kicker="ARCHIVES"
        title="文章歸檔"
        desc="依時間軸與年份彙整的所有公開文章紀錄"
      />
      <ArchivesClient posts={posts} />
    </section>
  );
}
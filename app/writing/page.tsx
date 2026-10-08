import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import WritingClient from "../components/writing/WritingClient";
// 引入 post.ts 中專門為列表頁導出的輕量化函數
import { getPostSummaries } from "../lib/posts";
import { pageMetadata } from "../lib/seo";

const description = "長文寫作、技術教學連載與隨筆心得 φ(*￣0￣)";

export const metadata: Metadata = pageMetadata({
  title: "文章",
  description,
  path: "/writing",
});

export const revalidate = 3600;

export default async function WritingPage() {
  // 取得不包含大體積內文 (content) 的文章卡片清單
  const posts = getPostSummaries();

  return (
    <section>
      <PageHead
        kicker="WRITING"
        title="文章專區"
        desc="技術教學連載 · 知識筆記 · 隨筆長文"
      />

      {/* 渲染 Client Component */}
      <WritingClient posts={posts} />
    </section>
  );
}

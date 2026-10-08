import { PROJECTS } from "../../../data";
import { getAllRepoInfo } from "../../../lib/github";
import { shieldBadge, svgResponse } from "../../../lib/badge";

// GitHub 總星數徽章：https://nnic52136-hash.github.io/api/badge/stars.svg
// 自動加總 data.ts 內所有專案的 GitHub Stars

// 快取時間（秒）：3600 秒 = 1 小時重新向 GitHub 拉取一次資料
export const revalidate = 3600;

export async function GET() {
  let stars = 0;
  const infos = await getAllRepoInfo(PROJECTS);

  for (const info of Object.values(infos)) {
    if (info) stars += info.stars;
  }

  // --- 自訂設定項目 ---
  const badgeLabel = "total stars"; // 1. 左側文字（可改為 "stars"、"github stars" 等）
  const badgeColor = "#22c55e"; // 2. 右側背景顏色（如綠色 #22c55e、紫色 #8b5cf6、藍色 #0070f3）

  // 3. 數字格式化（超過 1000 時顯示為 1.2k，若不需要可直接使用 String(stars)）
  const displayStars =
    stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars);

  return svgResponse(shieldBadge(badgeLabel, displayStars, badgeColor), 3600);
}

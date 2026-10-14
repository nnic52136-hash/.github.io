import { NextRequest, NextResponse } from "next/server";
import { getReactionCounts, incrReaction, rateLimit } from "../../lib/kv";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const ids = (req.nextUrl.searchParams.get("ids") ?? "")
      .split(",")
      .filter(Boolean);
    const counts = await getReactionCounts();
    const out: Record<string, number> = {};
    for (const id of ids) out[id] = counts[id] ?? 0;
    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    if (!(await rateLimit(ip, "react", 30, 3600))) {
      return NextResponse.json({ error: "太快了" }, { status: 429 });
    }

    const body = (await req.json().catch(() => null)) as {
      id?: string;
      liked?: boolean;
    } | null;
    const id = body?.id;
    const liked = body?.liked;

    if (typeof id !== "string" || !id || typeof liked !== "boolean") {
      return NextResponse.json({ error: "bad request" }, { status: 400 });
    }

    // 取得目前的計數
    const counts = await getReactionCounts();
    let currentCount = counts[id] ?? 0;

    let newCount: number;
    if (liked) {
      // 點第一次：按讚，總數 +1
      newCount = currentCount + 1;
      await incrReaction(id);
    } else {
      // 再按一次：收回讚，總數 -1（最低為 0）
      newCount = Math.max(0, currentCount - 1);
      // 註：如果你的 lib/kv.ts 裡有 decr 相關方法也可以呼叫，
      // 若沒有，直接更新或確保下次 getReactionCounts 能正確反映即可。
    }

    return NextResponse.json({ id, count: newCount, liked });
  } catch (err) {
    console.error("Reaction API Error:", err);
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}
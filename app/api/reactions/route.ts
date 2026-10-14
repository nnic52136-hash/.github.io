import { NextRequest, NextResponse } from "next/server";
import { getReactionCounts, incrReaction, rateLimit } from "../../lib/kv";
// 假設你的 lib/kv.ts 也有提供 decrReaction，或你可以直接用 Redis 的 decr

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
      return NextResponse.json({ error: "操作太快" }, { status: 429 });
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

    const counts = await getReactionCounts();
    let currentCount = counts[id] ?? 0;

    let newCount: number;
    if (liked) {
      // 點讚：總數 +1
      newCount = currentCount + 1;
      await incrReaction(id);
    } else {
      // 取消按讚：總數 -1（最低為 0）
      newCount = Math.max(0, currentCount - 1);
      
      // 💡 如果你的 lib/kv.ts 有提供 decrReaction(id)，請在這裡呼叫：
      // await decrReaction(id);
      // 或者如果沒有現成 decr，可以直接用 KV 設定該 id 的新數字：
      // await kv.set(`reaction_${id}`, newCount);
    }

    return NextResponse.json({ id, count: newCount, liked });
  } catch (err) {
    console.error("Reaction API Error:", err);
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}
import { NextResponse } from "next/server";
import { getTags, incrTag, rateLimit } from "@/app/lib/kv";

// 1. 取得所有標籤列表
export async function GET() {
  try {
    const tags = await getTags();
    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ error: "無法讀取標籤" }, { status: 500 });
  }
}

// 2. 訪客送出新標籤或點擊既有標籤 +1
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Rate Limit 防刷：同一個 IP 1 分鐘內最多送出 5 次標籤
    const allowed = await rateLimit(ip, "tags", 5, 60);
    if (!allowed) {
      return NextResponse.json(
        { error: "點太快囉！請過一分鐘後再試" },
        { status: 429 }
      );
    }

    const { tag } = await req.json().catch(() => ({}));
    if (!tag || typeof tag !== "string" || !tag.trim()) {
      return NextResponse.json({ error: "標籤不可為空" }, { status: 400 });
    }

    const newCount = await incrTag(tag);
    return NextResponse.json({ success: true, count: newCount });
  } catch {
    return NextResponse.json({ error: "伺服器連線失敗" }, { status: 500 });
  }
}

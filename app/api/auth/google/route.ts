import { NextRequest, NextResponse } from "next/server";
import { normalizePath } from "../../../lib/path";

export async function GET(req: NextRequest) {
  // 1. 取得使用者目前所在的文章網址（用於登入成功後跳回原文章）
  const returnTo =
    normalizePath(req.nextUrl.searchParams.get("returnTo")) ?? "/";

  // 2. 產生隨機 state 防止 CSRF 攻擊
  const state = crypto.randomUUID();

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID 未在環境變數設定" },
      { status: 500 }
    );
  }

  // 3. 組裝 Google OAuth 授權 URL
  const redirectUri = new URL("/api/auth/google/callback", req.url).toString();
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid profile email");
  googleAuthUrl.searchParams.set("state", state);

  // 4. 將 state 與回傳路徑存入 Cookie，並跳轉至 Google 登入頁
  const res = NextResponse.redirect(googleAuthUrl.toString());
  res.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
  });
  res.cookies.set("google_oauth_return", returnTo, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
  });

  return res;
}

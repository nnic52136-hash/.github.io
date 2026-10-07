import { NextRequest, NextResponse } from "next/server";
import { signGoogleIdentity } from "../../../lib/googleAuth"; // 替換為你的 Google 身份簽署邏輯
import { normalizePath } from "../../../../lib/path";

export async function GET(req: NextRequest) {
  const returnPath =
    normalizePath(req.cookies.get("google_oauth_return")?.value ?? null) ?? "/";
  const expectedState = req.cookies.get("google_oauth_state")?.value;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const fail = (reason: string) => {
    const res = NextResponse.redirect(
      new URL(`${returnPath}?auth_error=${reason}`, req.url)
    );
    res.cookies.delete("google_oauth_state");
    res.cookies.delete("google_oauth_return");
    return res;
  };

  if (!code || !state || !expectedState || state !== expectedState)
    return fail("state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("not_configured");

  try {
    const redirectUri = new URL(
      "/api/auth/google/callback",
      req.url
    ).toString();

    // 1. 向 Google 換取 access_token (格式為 x-www-form-urlencoded)
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = (await tokenRes.json().catch(() => ({}))) as {
      access_token?: string;
    };
    if (!tokenJson.access_token) return fail("token");

    // 2. 獲取 Google 使用者 Profile 與 Email
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`,
        },
      }
    );

    if (!userRes.ok) return fail("profile");

    const user = (await userRes.json()) as {
      id?: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!user.email || !user.picture) return fail("profile");

    // 3. 簽署身份憑證（帶入名稱、大頭貼、Email）
    const token = signGoogleIdentity({
      name: user.name || user.email.split("@")[0],
      avatarUrl: user.picture,
      email: user.email,
      googleId: user.id,
    });

    const res = NextResponse.redirect(
      new URL(`${returnPath}?google_token=${encodeURIComponent(token)}`, req.url)
    );
    res.cookies.delete("google_oauth_state");
    res.cookies.delete("google_oauth_return");
    return res;
  } catch {
    return fail("network");
  }
}
import crypto from "crypto";

/* 留言板的「用 Google 登入」是一次性的：callback 拿到 profile 後不建立 session，
   而是把 profile 簽成一個短效 token 經由 redirect query 帶回表單，送出留言時
   夾帶這個 token。伺服器驗簽章＋過期時間，client 端沒辦法憑空偽造成任何帳號。 */

// 讀取 Google 專用的簽署 Secret，若沒有可退回吃原本的 SECRET
const SECRET =
  process.env.GUESTBOOK_GOOGLE_SECRET ?? process.env.GUESTBOOK_GH_SECRET ?? "";
const TTL_MS = 10 * 60 * 1000; // Token 有效期 10 分鐘

export interface GoogleIdentity {
  name: string;
  avatarUrl: string;
  email: string;
  googleId?: string;
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
}

export function signGoogleIdentity(identity: GoogleIdentity): string {
  const payload = Buffer.from(
    JSON.stringify({ ...identity, exp: Date.now() + TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyGoogleIdentity(token: string): GoogleIdentity | null {
  if (!SECRET) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || sig !== sign(payload)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (
      typeof data.name !== "string" ||
      typeof data.avatarUrl !== "string" ||
      typeof data.email !== "string"
    )
      return null;

    return {
      name: data.name,
      avatarUrl: data.avatarUrl,
      email: data.email,
      googleId: typeof data.googleId === "string" ? data.googleId : undefined,
    };
  } catch {
    return null;
  }
}

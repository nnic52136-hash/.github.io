import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { LINKS } from "../data";
import { pageMetadata } from "../lib/seo";

const description = "Yase 的知交們 ∠( ᐛ 」∠)_";

export const metadata: Metadata = pageMetadata({
  title: "知交",
  description,
  path: "/links",
});

// 關鍵：自動幫外部頭像加上 wsrv.nl 代理並進行 encode
const getAvatarUrl = (url?: string) => {
  if (!url) return "";
  // 如果是本地圖片或已經是 wsrv 代理就直接回傳
  if (url.startsWith("/") || url.includes("wsrv.nl")) return url.trim();
  
  // 用 encodeURIComponent 把整串網址安全編碼，wsrv.nl 才能正確解析
  return `https://wsrv.nl/?url=${encodeURIComponent(url.trim())}`;
};

export default function LinksPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="LINKS" title="Friends" />
      <div className="links-grid">
        {LINKS.map((l, i) => (
          <a
            className="link-card"
            key={`${l.href}-${i}`}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="link-card-head">
              {l.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="link-avatar"
                  src={getAvatarUrl(l.avatar)}
                  alt={l.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="link-avatar link-avatar--placeholder">
                  {l.name[0]}
                </div>
              )}
              <div className="link-meta">
                <div className="link-name">{l.name}</div>
                <div className="link-handle">{l.handle}</div>
              </div>
              <span className="link-arrow">↗</span>
            </div>
            {l.desc && <div className="link-desc">{l.desc}</div>}
          </a>
        ))}
      </div>
    </section>
  );
}